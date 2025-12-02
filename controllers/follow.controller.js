import User from "../models/user.model.js";

// POST /api/users/:username/follow
export const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // already following?
    const isAlreadyFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // add to following/followers
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $addToSet: { followers: currentUserId },
    });

    const updatedTarget = await User.findById(targetUser._id)
      .select("username name avatar followers following");

    res.json({
      message: "Followed successfully",
      user: {
        _id: updatedTarget._id,
        username: updatedTarget.username,
        name: updatedTarget.name,
        avatar: updatedTarget.avatar,
        followersCount: updatedTarget.followers.length,
        followingCount: updatedTarget.following.length,
      },
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/:username/unfollow
export const unfollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: currentUserId },
    });

    const updatedTarget = await User.findById(targetUser._id)
      .select("username name avatar followers following");

    res.json({
      message: "Unfollowed successfully",
      user: {
        _id: updatedTarget._id,
        username: updatedTarget.username,
        name: updatedTarget.name,
        avatar: updatedTarget.avatar,
        followersCount: updatedTarget.followers.length,
        followingCount: updatedTarget.following.length,
      },
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:username/followers
export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate("followers", "name username avatar")
      .select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:username/following
export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate("following", "name username avatar")
      .select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};