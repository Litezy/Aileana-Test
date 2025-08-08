const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../services/jwt");
const ServerError = require("../error/ServerError");
const validateEmail = require("../utils/validateEmail");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const { validatePassword } = require("../utils/passwordChecker");


// User signup and wallet creation
exports.signup = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ status: "error", message: "Invalid email format" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 6 characters with uppercase, lowercase, and number"
            });
        }
        // Check for existing user
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        let avatarFileName = null;

        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar;
            const ext = path.extname(avatar.name);
            const safeName = name.toLowerCase().replace(/\s+/g, "-");
            avatarFileName = `avatar-${safeName}-${Date.now()}${ext}`;
            const uploadPath = path.join(__dirname, "../uploads/avatars");

            // Create the directory if it doesn't exist
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            await avatar.mv(path.join(uploadPath, avatarFileName));
        }


        // Create user with nested wallet creation
        const newUser = await prisma.user.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword,
                avatar: avatarFileName ? avatarFileName : null,
                wallet: {
                    create: {
                        balance: 0, // default or initial balance
                    },
                },
            },
            include: {
                wallet: true,
            },
        });

        const token = generateToken(newUser);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                avatar: newUser.avatar,
                wallet: {
                    id: newUser.wallet.id,
                    balance: newUser.wallet.balance,
                },
            },
        });
    } catch (err) {
        ServerError(res, err);
    }
};



// user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
       if(!email || !password) {
            return res.status(400).json({ status: "error", message: "Email and password are required" });
        }
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
         console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (err) {
        ServerError(res, err);
    }
};


// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
            },
        });
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });
        res.status(200).json({ data: user, status: "success", statusCode: 200, message: "Profile fetched successfully" });
    } catch (err) {
        ServerError(res, err);
    }
};




// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        let avatarFileName;

        // Fetch the current user
        const existingUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { avatar: true },
        });

        // If a new avatar is uploaded
        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar;
            const ext = path.extname(avatar.name);
            const safeName = name?.toLowerCase().replace(/\s+/g, "-") || "user";
            avatarFileName = `avatar-${safeName}-${Date.now()}${ext}`;
            const uploadPath = path.join(__dirname, "../uploads/avatars");

            // Create upload directory if it doesn't exist
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            // Delete old avatar if it exists
            if (existingUser?.avatar) {
                const oldAvatarPath = path.join(uploadPath, existingUser.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }

            // Move new avatar into uploads
            await avatar.mv(path.join(uploadPath, avatarFileName));
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                email,
                phone,
                ...(avatarFileName && { avatar: avatarFileName }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
            },
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...updatedUser,
                avatar: updatedUser.avatar ? updatedUser.avatar : null,
            },
            status: "success",
            statusCode: 200,
        });
    } catch (err) {
        ServerError(res, err);
    }
};


