import express from 'express';
import protect from '../middlewares/user.middleware.js';
import {createPost} from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/create', protect, upload.array('images', 10), createPost);

export default router;
