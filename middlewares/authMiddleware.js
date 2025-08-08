const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const UserAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", statusCode: 401, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ status: "error", statusCode: 404, message: "User with this ID not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(403).json({ status: "error", statusCode: 403, message: "Invalid or expired token" });
  }
};

module.exports = { UserAuth };
