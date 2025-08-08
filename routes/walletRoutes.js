const express = require("express");
const { createWallet, getWalletBalance } = require("../controllers/WalletController");
const { UserAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/wallet/create:
 *   post:
 *     summary: Create wallet for a user
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       400:
 *         description: Wallet already exists or user not found
 *       500:
 *         description: Server error
 */
router.post("/create", UserAuth, createWallet);

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance for the authenticated user
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   example: 1000.50
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Server error
 */
router.get("/balance", UserAuth, getWalletBalance);


module.exports = router;
