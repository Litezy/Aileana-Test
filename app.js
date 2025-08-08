const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const fileUpload = require("express-fileupload");
const { swaggerOptions } = require("./services/swaggerDocs");
const socketInstance = require("./utils/socketInstance");

const testRoute = require("./routes/testRoute");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const callRoutes = require("./routes/callRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
dotenv.config();
const prisma = new PrismaClient();

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true })); 

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initialize the global socket instance
socketInstance.init(io);

// Socket.IO message handling
require("./sockets/message.socket")(io);

// Register routes
app.use("/api/test", testRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/call", callRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (_, res) => {
  res.send("Ailena Test Backend API is running.");
});

module.exports = { app, server, io, prisma };