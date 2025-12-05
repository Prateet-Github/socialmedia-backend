import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protect from "../middlewares/user.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { uploadMessageImage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);
router.post('/upload-image', protect, upload.single('image'), uploadMessageImage);

export default router;