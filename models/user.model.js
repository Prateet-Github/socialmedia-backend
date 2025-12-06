import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    emailVerified: {
  type: Boolean,
  default: false,
},

emailOtp: {
  type: String, // hashed OTP
  select: false,
},

emailOtpExpires: {
  type: Date,   // expiry
},

lastOtpSentAt: {
  type: Date, // for rate limiting resend
},
resetOtp: {
  type: String
},
resetOtpExpires: {
  type: Date
},
    avatar: {
      type: String,
      default: "", // Cloudinary URL
    },
    bio: {
      type: String,
      maxlength: 160,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving - NO next() needed in async middleware in new mongoose versions(fuck it)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare otp
userSchema.methods.matchEmailOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.emailOtp);
};

export default mongoose.model("User", userSchema);