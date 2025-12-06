import express from 'express';
import { registerUser, loginUser, getUserProfile, updateProfile } from '../controllers/user.controller.js';
import  protect  from '../middlewares/user.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { getPublicUserProfile } from '../controllers/user.controller.js';
import { searchUsers } from '../controllers/user.controller.js';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follow.controller.js';
import { verifyEmail } from '../controllers/user.controller.js';
import { resendOtp } from '../controllers/user.controller.js';
import { requestPasswordReset } from '../controllers/user.controller.js';
import { verifyResetOtp } from '../controllers/user.controller.js';
import { resetPassword } from '../controllers/user.controller.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router.put('/update-profile', protect,upload.single('avatar'), updateProfile);
router.get("/public/:username", getPublicUserProfile);
router.get("/search", protect, searchUsers);

router.post("/:username/follow", protect, followUser);
router.post("/:username/unfollow", protect, unfollowUser);

router.get("/:username/followers", getFollowers);
router.get("/:username/following", getFollowing);

router.post("/email-verification", verifyEmail);
router.post("/resend-otp", resendOtp);

router.post("/reset-password-request", requestPasswordReset);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;