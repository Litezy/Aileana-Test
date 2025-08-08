// utils/socketInstance.js
let io;

module.exports = {
  init: (socketIO) => {
    io = socketIO;
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized!");
    }
    return io;
  }
};