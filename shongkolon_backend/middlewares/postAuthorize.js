const { Post } = require("../models/posts");

const defaultErrorMsg = (err) => ({
  msg: err.message || "Something went wrong with database!",
});

module.exports = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  try {
    if (postId) {
      const post = await Post.findById(postId);
      if (post) {
        if (post.userId.toString() === userId.toString()) {
          next();
        } else {
          throw new Error("You can only edit your posts!");
        }
      } else {
        throw new Error(
          "This post can not be found in database. Post might already be deleted!"
        );
      }
    } else {
      next();
    }
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};
