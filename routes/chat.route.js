import express from "express";
import { createChat } from "../controllers/chat.controller.js";
import protect from "../middlewares/user.middleware.js";
import { getMyChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/start", protect, createChat);
router.get("/", protect, getMyChats);


export default router;