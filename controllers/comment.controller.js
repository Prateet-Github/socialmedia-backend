import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ message: "postId and content required" });
    }

    // verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
    });

    res.status(201).json(comment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 }); // newest first

    res.json(comments);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};