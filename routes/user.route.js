import express from 'express';
import { registerUser, loginUser, getUserProfile, updateProfile } from '../controllers/user.controller.js';
import  protect  from '../middlewares/user.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { getPublicUserProfile } from '../controllers/user.controller.js';
import { searchUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/update-profile', protect,upload.single('avatar'), updateProfile);
router.get("/public/:username", getPublicUserProfile);
router.get("/search", protect, searchUsers);

export default router;