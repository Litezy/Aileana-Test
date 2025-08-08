// This typically would trigger when a new client connects/emit join and message actions to the socket server.

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("room_created", ({ roomId, senderId, receiverId }) => {
      console.log("🏠 New Room Created:");
      console.log(`- Room ID: ${roomId}`);
      console.log(`- Sender ID: ${senderId}`);
      console.log(`- Receiver ID: ${receiverId}`);
    });

    socket.on("private-message", ({ to, from, message, roomId }) => {
      console.log("📨 Private Message Event:");
      console.log(`- From User ID: ${from}`);
      console.log(`- To User ID: ${to}`);
      console.log(`- Room ID: ${roomId}`);
      console.log(`- Message: ${message}`);

      io.to(roomId).emit("private-message", {
        from,
        to,
        roomId,
        message,
        timestamp: new Date().toISOString(),
      });
    });


    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
