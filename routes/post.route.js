import express from 'express';
import protect from '../middlewares/user.middleware.js';
import {createPost} from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';
import {getFeedPosts} from '../controllers/post.controller.js';
import {getPostsByUser} from '../controllers/post.controller.js';
import {likePost} from '../controllers/post.controller.js';
import {unlikePost} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 10), createPost);
router.get("/user/:id", getPostsByUser);
router.get("/feed", protect, getFeedPosts);
router.post("/:postId/like", protect, likePost);
router.post("/:postId/unlike", protect, unlikePost);

export default router;
