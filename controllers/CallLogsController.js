const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ServerError = require("../error/ServerError");

// start a call
exports.startCall = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const callerId = req.user.id;

        if (!receiverId) {
            return res.status(400).json({ status: "error", message: "No valid receiver" });
        }
        if (callerId === receiverId) {
            return res.status(400).json({ status: "error", message: "You cannot call yourself" });
        }

        //check if the caller is trying to call themselves
        if (callerId === receiverId) {
            return res.status(400).json({ status: "error", message: "You cannot call yourself" });
        }

        //check if the receiver exists
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId }
        });

        if (!receiver) {
            return res.status(404).json({ status: "error", message: "Receiver not found" });
        }

        // Check if a call is already ongoing with the receiver
        const existingCall = await prisma.callLog.findFirst({
            where: {
                OR: [
                    { callerId, receiverId },
                    { callerId: receiverId, receiverId: callerId }
                ],
                endedAt: null // Only consider ongoing calls
            }
        });

        if (existingCall) {
            return res.status(400).json({ status: "error", message: "Call already in progress" });
        }

        const call = await prisma.callLog.create({
            data: {
                callerId,
                receiverId,
            },
        });

        return res.status(201).json({
            status: "success",
            message: "Call started",
            call
        });
    } catch (err) {
        ServerError(res, err);
    }
};

// End call
exports.endCall = async (req, res) => {
    try {
        const { callId } = req.body;

        const call = await prisma.callLog.findUnique({
            where: { id: callId },
        });

        if (!call) {
            return res.status(404).json({ status: "error", message: "Call not found" });
        }
        //check if the call has already ended   
        if (call.endedAt !== null) {
            return res.status(400).json({ status: "error", message: "Call already ended" });
        }

        const updatedCall = await prisma.callLog.update({
            where: { id: callId },
            data: { endedAt: new Date() },
        });

        return res.status(200).json({
            status: "success",
            message: "Call ended",
            call: updatedCall,
        });
    } catch (err) {
        ServerError(res, err);
    }
};

