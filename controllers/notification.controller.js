import Notification from "../models/notification.model.js";

// Create notification
export const createNotification = async ({ userId, fromUserId, type, postId, commentId }) => {
  try {
    // don't notify yourself
    if (userId.toString() === fromUserId.toString()) return;

    await Notification.create({
      user: userId,
      fromUser: fromUserId,
      type,
      post: postId,
      comment: commentId,
    });
  } catch (err) {
    console.log("notification create error:", err.message);
  }
};

// Get logged-in user's notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("fromUser", "name username avatar")
      .populate("post", "_id")
      .populate("comment", "_id")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};


// Mark all read
export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};