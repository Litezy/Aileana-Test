const express = require("express");
const { UserAuth } = require("../middlewares/authMiddleware");
const { startCall, endCall } = require("../controllers/CallLogsController");
const router = express.Router();

/**
 * @swagger
 * /api/call/start:
 *   post:
 *     summary: Start a call between two users
 *     tags:
 *       - Calls
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the user to call
 *     responses:
 *       201:
 *         description: Call started successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/start", UserAuth, startCall);

/**
 * @swagger
 * /api/call/end:
 *   post:
 *     summary: End an ongoing call
 *     tags:
 *       - Calls
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - callId
 *             properties:
 *               callId:
 *                 type: string
 *                 description: ID of the call to end
 *     responses:
 *       200:
 *         description: Call ended successfully
 *       404:
 *         description: Call not found
 *       500:
 *         description: Server error
 */
router.post("/end", UserAuth, endCall);

module.exports = router;
