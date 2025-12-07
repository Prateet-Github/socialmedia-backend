// socket/socketHandler.js
import { Server } from "socket.io";
import User from "../models/user.model.js";

let onlineUsers = new Map(); // userId → socketId

export const socketHandler = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // ─────────────────────────────────────────────
    // 1) USER ONLINE TRACKING
    // ─────────────────────────────────────────────
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("👤 User joined:", userId);
    });

    // ─────────────────────────────────────────────
    // 2) JOIN CHAT ROOM
    // ─────────────────────────────────────────────
    socket.on("join-chat", ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined room ${chatId}`);
    });

    // ─────────────────────────────────────────────
    // 3) CHAT MESSAGE SEND → BROADCAST
    // ─────────────────────────────────────────────
    socket.on("message:send", ({ message }) => {
      if (!message || !message.chatId) return;
      io.to(message.chatId).emit("message:new", message);
      console.log("💬 message sent → room:", message.chatId);
    });

    // ─────────────────────────────────────────────
    // 4) CALL: OFFER (Caller → Callee)
    // ─────────────────────────────────────────────
    socket.on("call:offer", async ({ toUserId, offer, callerId }) => {
      const receiverSocket = onlineUsers.get(toUserId);
      if (!receiverSocket) {
        console.log("❌ Receiver offline");
        return;
      }

      const callerUser = await User.findById(callerId).select("name username avatar");

      io.to(receiverSocket).emit("call:offer", {
        offer,
        callerId,
        callerSocketId: socket.id,       // ← IMPORTANT
        callerName: callerUser?.name || "Unknown",
        callerAvatar: callerUser?.avatar || null,
        callerUsername: callerUser?.username || null,
      });

      console.log(`📞 Offer sent from ${callerId} → user ${toUserId}`);
    });

    // ─────────────────────────────────────────────
    // 5) CALL: ANSWER (Callee → Caller)
    // ─────────────────────────────────────────────
    socket.on("call:answer", ({ toSocketId, answer }) => {
      io.to(toSocketId).emit("call:answer", {
        answer,
        receiverSocketId: socket.id   // ← This is critical (callee ID)
      });

      console.log(`📞 Answer sent → socket ${toSocketId}`);
    });

    // ─────────────────────────────────────────────
    // 6) ICE EXCHANGE
    // ─────────────────────────────────────────────
    socket.on("call:ice-candidate", ({ toSocketId, candidate }) => {
      if (candidate) {
        io.to(toSocketId).emit("call:ice-candidate", candidate);
      }
    });

    // ─────────────────────────────────────────────
    // 7) CALL END (Either side → Other side)
    // ─────────────────────────────────────────────
    socket.on("call:end", ({ toSocketId }) => {
      if (toSocketId) {
        io.to(toSocketId).emit("call:end", {
          fromSocketId: socket.id,   // ✔ IMPORTANT
        });
      }

      console.log("❌ Video call ended by socket:", socket.id);
    });

    //----------------------------------------
    // VOICE CALL SIGNALING
    //----------------------------------------

    // 🔥 FIX: voice:offer - Add caller info
    socket.on("voice:offer", async ({ toUserId, offer, callerId }) => {
      const receiverSocket = onlineUsers.get(toUserId);
      if (!receiverSocket) {
        console.log("❌ Voice call receiver offline:", toUserId);
        return;
      }

      // 🔥 FETCH CALLER INFO (same as video call)
      const callerUser = await User.findById(callerId).select("name username avatar");

      io.to(receiverSocket).emit("voice:offer", {
        offer,
        callerId,
        callerSocketId: socket.id,  // 🔥 CRITICAL
        callerName: callerUser?.name || "Unknown",
        callerAvatar: callerUser?.avatar || null,
      });

      console.log(`🎙️ Voice offer sent from ${callerId} → user ${toUserId}`);
    });

    // 🔥 FIX: voice:answer - Add fromSocketId
    socket.on("voice:answer", ({ toSocketId, answer }) => {
      io.to(toSocketId).emit("voice:answer", {
        answer,
        fromSocketId: socket.id,  // 🔥 CRITICAL - caller needs this
      });

      console.log(`🎙️ Voice answer sent → socket ${toSocketId}`);
    });

    socket.on("voice:ice-candidate", ({ toSocketId, candidate }) => {
      if (candidate) {
        io.to(toSocketId).emit("voice:ice-candidate", candidate);
        console.log(`🧊 Voice ICE candidate sent → ${toSocketId}`);
      }
    });

    socket.on("voice:end", ({ toSocketId }) => {
      if (toSocketId) {
        io.to(toSocketId).emit("voice:end", { fromSocketId: socket.id });
        console.log(`❌ Voice call ended by ${socket.id} → ${toSocketId}`);
      }
    });

    // ─────────────────────────────────────────────
    // 8) DISCONNECT
    // ─────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);

      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log("⚠️ Removed user:", userId);
          break;
        }
      }
    });
  });

  return io;
};