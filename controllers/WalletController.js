const { PrismaClient } = require("@prisma/client");
const ServerError = require("../error/ServerError");

const prisma = new PrismaClient();

// POST /api/wallet/create
exports.createWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (existingWallet) {
      return res.status(400).json({status:"error", message: "Wallet already exists" });
    }

    // Create wallet with default balance 0
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
      },
    });

    res.status(201).json({
      message: "Wallet created successfully",
      wallet,
    });
  } catch (err) {
    ServerError(res, err);
  }
};

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    // Simulated fetch from DB for now
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ status: "error", message: "Wallet not found" });
    }

    // Simulated OnePipe balance mock
    const mockBalance = wallet.balance ?? 0;

    res.status(200).json({
      wallet,
      message: "Balance fetched (mock)",
    });
  } catch (err) {
    ServerError(res, err);
  }
};
