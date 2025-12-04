// socket/socketHandler.js
import { Server } from "socket.io";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Stores online users (userId → socketId)
let onlineUsers = new Map();

export const socketHandler = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // -----------------------------
    // 1️⃣ USER ONLINE STATUS TRACKING
    // -----------------------------
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("👤 User joined:", userId);
    });

    // -----------------------------
    // 2️⃣ USER JOINS CHAT ROOM
    // -----------------------------
    socket.on("join-chat", ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`💬 User ${userId} joined chat room ${chatId}`);
    });

    // -----------------------------
    // 3️⃣ SEND MESSAGE → SAVE + BROADCAST
    // -----------------------------
    socket.on(
      "message:send",
      async ({ chatId, senderId, receiverId, text, media }) => {
        try {
          // Save message in DB
          const message = await Message.create({
            chatId,
            sender: senderId,
            text: text || "",
            media: media || [],
          });

          // Update chat.lastMessage
          await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
          });

          // Populate sender for frontend UI
          const fullMessage = await message.populate(
            "sender",
            "name username avatar"
          );

          // 3.1 Broadcast to everyone in the chat room
          io.to(chatId).emit("message:new", fullMessage);

          // 3.2 Send ack to sender
          socket.emit("message:sent", fullMessage);

          console.log("📩 Message delivered in chat:", chatId);
        } catch (err) {
          console.error("❌ message:send error", err);
          socket.emit("message:error", { message: err.message });
        }
      }
    );

    // -----------------------------
    // 4️⃣ HANDLE DISCONNECT
    // -----------------------------
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);

      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log("⚠️ Removed user from online list:", userId);
          break;
        }
      }
    });
  });

  return io;
};