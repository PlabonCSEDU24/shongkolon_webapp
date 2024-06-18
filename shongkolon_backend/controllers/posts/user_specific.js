const { Post } = require("../../models/posts");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};
const inf = Number.MAX_SAFE_INTEGER;

/**
 * { userId } = req.params
 * [ { limit, skip } = req.query ]
 *
 */
const getUserSpecificPosts = async (req, res) => {
  const limit = req.query.limit || inf;
  const skip = req.query.skip || 0;
  try {
    const userId = req.params.userId;
    const data = await Post.find({ userId: userId }).skip(skip).limit(limit);
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(defaultErrorMsg(error));
  }
};

module.exports = {
  getUserSpecificPosts,
};
