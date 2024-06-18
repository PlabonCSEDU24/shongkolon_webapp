const { Post } = require("../models/posts");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const result = await Post.findOne(
      {
        "comments._id": new ObjectId(req.params.commentId),
      },
      {
        comments: 1,
        _id: 0,
      }
    );

    if (!result)
      res.status(410).send({ msg: "This comment doesn't exist in database!" });
    else {
      const comment = result.comments.find(
        (val) => val._id == req.params.commentId
      );
      if (userId === comment.userId.toString()) next();
      else
        return res
          .status(401)
          .send({ msg: "Can not edit other people's comment!" });
    }
  } catch (error) {
    return res.status(400).send({ msg: "Something went wrong with database" });
  }
};
