import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

chatSchema.index({ users: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;