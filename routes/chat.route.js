import express from "express";
import protect from "../middlewares/user.middleware.js";
import {
  createChat,
  getMyChats
} from "../controllers/chat.controller.js";

const router = express.Router();

// Create or get existing 1-1 chat
router.post("/start", protect, createChat);

// Get all chats for logged-in user
router.get("/", protect, getMyChats);

export default router;