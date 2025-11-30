import express from 'express';
import { registerUser, loginUser, getUserProfile, updateProfile } from '../controllers/user.controller.js';
import  protect  from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/update-profile', protect, updateProfile);

export default router;