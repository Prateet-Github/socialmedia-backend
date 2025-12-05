// socket/socketHandler.js
import { Server } from "socket.io";

let onlineUsers = new Map();

export const socketHandler = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // 1️ USER ONLINE TRACKING
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("👤 User joined:", userId);
    });

    // 2️ JOIN CHAT ROOM
    socket.on("join-chat", ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined room ${chatId}`);
    });

    // 3️ MESSAGE BROADCAST (NO SAVING IN SOCKET)
    socket.on("message:send", ({ message }) => {
      if (!message || !message.chatId) return;

      console.log("Broadcasting message to room:", message.chatId);

      // Send message to everyone in the chat room
      io.to(message.chatId).emit("message:new", message);
    });

    // 4️ DISCONNECT HANDLER
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log("Removed user:", userId);
        }
      }
    });
  });

  return io;
};