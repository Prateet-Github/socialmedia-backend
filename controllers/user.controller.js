import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import cloudinary from '../configs/cloudinary.js';
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import crypto from "crypto";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;

    name = name.trim();
    username = username.trim();
    email = email.trim().toLowerCase();

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailPattern.test(email)) {
      return res.status(400).json({ message: "Only Gmail addresses allowed" });
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) return res.status(400).json({ message: "Email already exists" });
    if (usernameExists) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({
      name,
      username,
      email,
      password,
      emailVerified: false,
    });

    const plainOtp = crypto.randomInt(100000, 999999).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(plainOtp, salt);

    user.emailOtp = hashedOtp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000; 
    user.lastOtpSentAt = new Date();
    await user.save();

    await sendOtpMail({
      to: user.email,
      otp: plainOtp,
      username: user.username,
    });

    return res.status(201).json({
      message: "OTP sent to Gmail",
      email: user.email,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user + include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // MUST be verified
    if (!user.emailVerified) {
      return res.status(400).json({ message: "Please verify your Gmail first" });
    }

    // compare password
    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // success
    return res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio || "",
      website: user.website || "",
      location: user.location || "",
      followers: user.followers || [],
      following: user.following || [],
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar");
      
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.location !== undefined) user.location = req.body.location;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.website !== undefined) user.website = req.body.website;

    // Handle avatar file upload if exists
    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      user.avatar = uploaded.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      location: updatedUser.location,
      followers: updatedUser.followers,
      following: updatedUser.following,
      website: updatedUser.website,
      createdAt: updatedUser.createdAt,
      token: generateToken(updatedUser._id),
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers", "name username avatar")  // ✅ Add this
      .populate("following", "name username avatar"); // ✅ Add this

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: user._id })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const  query  = req.query.q;
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } }
      ]
    }).select("name username avatar");

    res.json(users);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    const user = await User.findOne({ email }).select("+emailOtp +emailOtpExpires");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      return res.status(400).json({ message: "No OTP generated" });
    }

    if (Date.now() > user.emailOtpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.emailOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // SUCCESS → verify email
    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({ message: "User not found" });

    // If already verified
    if(user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Rate limit – allow every 60 seconds
    if(user.lastOtpSentAt) {
      const diff = Date.now() - new Date(user.lastOtpSentAt).getTime();
      if(diff < 60 * 1000) {
        const seconds = Math.ceil((60 * 1000 - diff)/1000);
        return res.status(429).json({
          message: `Wait ${seconds}s before requesting again`
        });
      }
    }

    // generate OTP
    const plainOtp = (Math.floor(100000 + Math.random() * 900000)).toString();

    // hash
    user.emailOtp = await bcrypt.hash(plainOtp, 10);
    user.emailOtpExpires = Date.now() + 1000*60*10; // 10 min
    user.lastOtpSentAt = new Date();

    await user.save();

    // send
    await sendOtpMail({
      to: user.email,
      otp: plainOtp,
      username: user.username
    });

    return res.json({ message: "OTP resent" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};