import Chat from "../models/chat.model.js";

export const createChat = async (req, res) => {
  try {
    const userId  = req.user._id;
    const {receiverId} = req.body;

    if(!receiverId){
      return res.status(400).json({message:"ReceiverId is required"});
    }

  let chat = await Chat.findOne({
      users: { $all: [userId, receiverId] }
    }).populate("users", "name username avatar");

    if (!chat) {
      chat = await Chat.create({
        users: [userId, receiverId]
      });
    }

    res.status(201).json(chat);
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    
  }
};