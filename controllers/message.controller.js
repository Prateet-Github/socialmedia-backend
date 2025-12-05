import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text, media } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    const message = await Message.create({
      chatId,
      sender: req.user._id,
      text,
      media: media || []
    });

    // update chat.lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    // populate sender before sending back
    const full = await message.populate("sender", "name username avatar");

    res.status(201).json(full);

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "name username avatar");

    res.json(messages);

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};