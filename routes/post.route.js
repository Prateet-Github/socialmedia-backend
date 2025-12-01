import express from 'express';
import protect from '../middlewares/user.middleware.js';
import {createPost} from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';
import {getFeedPosts} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', protect, upload.array('images', 10), createPost);
router.get("/feed", protect, getFeedPosts);

export default router;
