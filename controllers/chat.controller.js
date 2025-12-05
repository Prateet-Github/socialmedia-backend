import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// create a one-on-one chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId is required" });
    }

    // check if chat exists
    let chat = await Chat.findOne({
      users: { $all: [userId, receiverId] }
    }).populate("users", "name username avatar");

    // if not, create it
    if (!chat) {
      chat = await Chat.create({
        users: [userId, receiverId],
      });

      // populate after creation
      chat = await chat.populate("users", "name username avatar");
    }

    return res.status(201).json(chat);

  } catch (error) {
    console.error("createChat error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get all chats for logged-in user
export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "name username avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name username avatar" }
      })
      .sort({ updatedAt: -1 });

    return res.json(chats);

  } catch (error) {
    console.error("getMyChats error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// send a message in a chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ message: "chatId and text are required" });
    }

    // create message
    const message = await Message.create({
      chatId,
      sender: req.user._id,
      text
    });

    // update chat lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    const populated = await message.populate("sender", "name username avatar");

    return res.json(populated);

  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};