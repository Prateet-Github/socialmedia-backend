import { Server } from "socket.io";

let onlineUsers = new Map();

export const socketHandler = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    },
  });

  io.on("connection",(socket)=>{
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User joined:", userId);
    });

    socket.on("message:send", ({ senderId, receiverId, text }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("message:new", {
          senderId,
          text,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};