import express from "express";
import { createComment, getCommentsByPost } from "../controllers/comment.controller.js";
import protect from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:postId", protect, getCommentsByPost);

export default router;