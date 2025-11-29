import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // user to notify
    type: { type: String, enum: ["like","comment","follow","mention"], required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who did the action
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // optional
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // optional
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;