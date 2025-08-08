# Ailena Test Backend API

This is the backend API for the Ailena Test Assessment. It includes user authentication, wallet integration (mocked), real-time messaging via WebSocket, and call logging.

---

## 🚀 Features

- JWT-based authentication
- User signup & login
- Wallet creation (mocked OnePipe integration)
- Chat room creation
- Real-time messaging with Socket.IO
- Call start/end logging
- Swagger documentation at `/api-docs`

---

## 🛠️ Tech Stack

- **Node.js / Express.js** – Backend runtime and framework used for building RESTful APIs
- **PostgreSQL (via Prisma ORM)** – Relational database used to store and manage application data
- **Socket.IO** – Real-time bidirectional communication for messaging features
- **Swagger** – Interactive documentation for exploring and testing API endpoints
- **JWT (JSON Web Tokens)** – Secure token-based user authentication

> ⚠️ **Note:** Firebase was not integrated in this implementation as the system was designed using PostgreSQL and real-time communication handled via Socket.IO. However, the architecture is flexible and can be extended to incorporate Firebase for features like push notifications, Firestore, or authentication if required.


## 📦 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Litezy/Aileana-Test.git
   cd Aileana-Test
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a .env file using the example provided**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` and configure as needed**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/your_db
   JWT_SECRET=your_secret
   ```

5. **Initialize Prisma & Migrate Database**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the Server**
   ```bash
   npm run dev
   ```

- Server will run at: [http://localhost:5000](http://localhost:5000)  
- Swagger docs available at: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🧪 API Testing Guide

You can test endpoints using Swagger at `/api-docs`.

---

## 📂 API Route Overview

All main route files are registered in the server (`app.js`) as shown below:

```js
const testRoute = require("./routes/testRoute");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const callRoutes = require("./routes/callRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/test", testRoute);         // Testing route to check if server is responding
app.use("/api/auth", authRoutes);        // Signup and login routes
app.use("/api/wallet", walletRoutes);    // Create wallet and fetch balance
app.use("/api/call", callRoutes);        // Call routes
app.use("/api/message", messageRoutes);  // Message routes
```

---

## 🔌 WebSocket Events

- `room_created` – Triggered when room is created  
- `private-message` – Emitted when a message is sent  
- `disconnect` – Socket disconnect event  

---

## 📝 Assumptions Made

- All users are created before starting a conversation.  
- Auto create wallet upon successful signup for users.  
- `receiverId` is passed during messaging and calling — validated.  
- Call logs are only between two users, not group calls.  
- OnePipe integration is mocked — no real API calls.  
- WebSocket is used only for private messaging and room creation notification logged in the console.

## System Design/Architecture
 - `this can be found in the SYSTEMDESIGN.md`