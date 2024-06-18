const { Post } = require("../../models/posts");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};
const inf = Number.MAX_SAFE_INTEGER;

/**
 * { postId } = req.params
 * NO SKIP and LIMIT
 */
const getAllCommentFromPost = async (req, res) => {
  try {
    const { comments } = await Post.findById(req.params.postId, {
      comments: 1,
      _id: 0,
    });
    return res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    return res.status(400).send(defaultErrorMsg(err));
  }
};

/**
 * { postId } = req.params
 * { _id } = req.user
 * comment  = req.body
 * [ { skip, limit } = req.query ]
 */
const addCommentToPost = async (req, res) => {
  try {
    const comment = {
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
    };
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    );
    return res.status(201).send(updatedPost);
  } catch (err) {
    // console.log(err);
    return res.status(400).send(defaultErrorMsg(err));
  }
};

/**
 * { postId, commentId } = req.params
 */

const deleteCommentFromPost = async (req, res) => {
  try {
    const delFromPost = await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { comments: { _id: req.params.commentId } },
    });
    console.log(delFromPost);
    return res.status(200).send({ msg: "Successfully Deleted" });
  } catch (error) {
    return res.status(400).send(defaultErrorMsg(error));
  }
};

/**
 * { postId, commentId } = req.params
 * { comment } = req.body
 */
const editCommentFromPost = async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { _id: req.params.postId, "comments._id": req.params.commentId },
      {
        $set: {
          "comments.$.time": new Date(),
          "comments.$.comment": req.body.comment,
        },
      }
    );
    return res.status(200).send({ msg: "Successfully updated!" });
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(error));
  }
};

module.exports = {
  getAllCommentFromPost,
  addCommentToPost,
  deleteCommentFromPost,
  editCommentFromPost,
};
