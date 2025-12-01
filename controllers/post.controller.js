import Post from '../models/post.model.js';
import cloudinary from '../configs/cloudinary.js';

export const createPost = async (req, res) => {
  try {
    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {

        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        mediaUrls.push(uploaded.secure_url);
      }
    }

    const post = await Post.create({
      user: req.user._id,
      content: req.body.content || "",
      media: mediaUrls
    });

    await post.populate("user", "name username avatar");

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ user: userId })
      .populate("user", "username name avatar")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 }); // newest first

    res.json(posts);
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};