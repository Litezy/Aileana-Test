const express = require("express");
const { UserAuth } = require("../middlewares/authMiddleware");
const { sendMessage, createOrGetRoom, getChatHistory } = require("../controllers/MessageController");
const router = express.Router();

/**
 * @swagger
 * /api/message/room:
 *   post:
 *     summary: Create or get a chat room between two users
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *             properties:
 *               participantId:
 *                 type: string
 *                 description: ID of the user to chat with
 *     responses:
 *       200:
 *         description: Room already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot create room with yourself
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/room", UserAuth, createOrGetRoom);


/**
 * @swagger
 * /api/message/send:
 *   post:
 *     summary: Send a message to another user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - content
 *             properties:
 *               roomId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: receiverId and content required
 *       500:
 *         description: Internal server error
 */
router.post("/send", UserAuth, sendMessage);

/**
 * @swagger
 * /api/message/history/{withUserId}:
 *   get:
 *     summary: Get chat history with a specific user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: withUserId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the other user in the conversation
 *     responses:
 *       200:
 *         description: Successful retrieval of chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       senderId:
 *                         type: string
 *                       receiverId:
 *                         type: string
 *                       content:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/history/:withUserId", UserAuth,getChatHistory );


module.exports = router;
