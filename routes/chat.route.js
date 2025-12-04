import express from "express";
import { createChat } from "../controllers/chat.controller.js";
import protect from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/start", protect, createChat);

export default router;