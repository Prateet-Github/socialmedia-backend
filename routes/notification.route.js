import express from "express";
import protect from "../middlewares/user.middleware.js";
import {
  getNotifications,
  markNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read", protect, markNotificationsRead);

export default router;