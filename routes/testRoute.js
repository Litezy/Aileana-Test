const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test route
 *     description: Returns a test message
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", (req, res) => {
  res.json({ message: "Test endpoint is working!" });
});

module.exports = router;
