const { PrismaClient } = require("@prisma/client");
const ServerError = require("../error/ServerError");
const prisma = new PrismaClient();
const { getIO } = require("../utils/socketInstance");

exports.createOrGetRoom = async (req, res) => {
    try {
        const { participantId } = req.body;
        const userId = req.user.id;
        const io = getIO(); // Get the global io instance

        if (participantId === userId) {
            return res.status(400).json({
                status: 'error',
                message: "Cannot create room with yourself.",
            });
        }

        // Check if a room already exists between both users
        const existingRoom = await prisma.room.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: participantId },
                    { senderId: participantId, receiverId: userId }
                ]
            }
        });

        if (existingRoom) {
            return res.status(200).json({
                status: 'success',
                message: "Room found",
                room: existingRoom
            });
        }

        // Create new room
        const newRoom = await prisma.room.create({
            data: {
                senderId: userId,
                receiverId: participantId
            }
        });

        console.log("🏠 Emitting room_created event:");
        console.log(`- Room ID: ${newRoom.id}`);
        console.log(`- Sender ID: ${userId}`);
        console.log(`- Receiver ID: ${participantId}`);

        // Emit socket event to receiver
        io.to(participantId).emit("room_created", {
            roomId: newRoom.id,
            senderId: userId,
            receiverId: participantId
        });

        return res.status(201).json({
            status: 'success',
            message: "Room created",
            room: newRoom
        });

    } catch (err) {
        console.error("Room creation error:", err);
        ServerError(res, err);
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { roomId, content } = req.body;
        const senderId = req.user.id;
        const io = getIO(); // Get the global io instance

        if (!roomId || !content) {
            return res.status(400).json({ status: 'error', message: "roomId and content are required" });
        }

        const room = await prisma.room.findUnique({ where: { id: roomId } });

        if (!room) {
            return res.status(404).json({ status: 'error', message: "Room not found" });
        }

        // Ensure sender is part of the room
        if (![room.senderId, room.receiverId].includes(senderId)) {
            return res.status(403).json({ status: 'error', message: "You are not a participant in this room" });
        }

        const receiverId = senderId === room.senderId ? room.receiverId : room.senderId;

        const message = await prisma.message.create({
            data: {
                senderId,
                roomId,
                content,
            },
        });


        console.log("📨 Emitting private-message event:");
        console.log(`- From User ID: ${senderId}`);
        console.log(`- To User ID: ${receiverId}`);
        console.log(`- Room ID: ${roomId}`);
        console.log(`- Message: ${content}`);

        io.to(roomId).emit("private-message", {
            from: senderId,
            to: receiverId,
            roomId,
            message: content
        });

        res.status(201).json({ status: 'success', message: "Message sent", data: message });

    } catch (err) {
        ServerError(res, err);
    }
};




exports.getChatHistory = async (req, res) => {
    try {
        const { withUserId } = req.params;
        const userId = req.user.id;

        if (!withUserId) {
            return res.status(400).json({ status: 'error', message: "withUserId is required" });
        }
        if (withUserId === userId) {
            return res.status(400).json({ status: 'error', message: "Cannot get chat history with yourself" });
        }

        const room = await prisma.room.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: withUserId },
                    { senderId: withUserId, receiverId: userId }
                ]
            }
        });

        if (!room) {
            return res.status(404).json({ 
                status: 'error', 
                message: "No room found with this user" 
            });
        }

        const messages = await prisma.message.findMany({
            where: { roomId: room.id },
            orderBy: { timestamp: "asc" },
        });

        res.status(200).json({ 
            status: 'success',
            roomId: room.id, 
            messages 
        });

    } catch (err) {
        ServerError(res, err);
    }
};

