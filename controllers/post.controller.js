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