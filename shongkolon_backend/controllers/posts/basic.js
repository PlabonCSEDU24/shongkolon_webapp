const { Post } = require("../../models/posts");
const fs = require("fs-extra");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};
const inf = Number.MAX_SAFE_INTEGER;

// this will require authorize and filesave middleware first
const createNewPost = async (req, res) => {
  const postInfo = { ...req.body };
  const userId = req.user._id;
  if (postInfo.contactInfo) {
    postInfo.contactInfo = JSON.parse(postInfo.contactInfo);
  }
  try {
    const post = new Post({
      ...postInfo,
      userId: userId,
    });
    // console.log(req.files);
    if (req.files?.length) {
      const photos = [];
      for (file of req.files) {
        photos.push({
          fileName: file.filename,
          path: file.path,
        });
      }
      post.photos = photos;
    }
    if (!post.contactInfo.phone) post.contactInfo.phone = req.user.contact_no;

    const ret = await post.save();
    return res.status(201).send(ret);
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const handleGetPosts = async (req, res) => {
  try {
    const bookName = req.query.bookName;
    const category = req.query.category;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || inf;
    const queryType = req.query.queryType || "loose"; // ['loose', 'strict']
    const orderBy = req.query.orderBy || "time"; // ['time', 'relevance']

    let result = null;
    // query with only bookName
    const getSortParams = () => {
      if (queryType === "loose") {
        if (orderBy === "time") {
          return {
            createdAt: -1,
            score: { $meta: "textScore" },
          };
        } else {
          return {
            score: { $meta: "textScore" },
            createdAt: -1,
          };
        }
      } else {
        if (orderBy === "time") {
          return {
            createdAt: -1,
          };
        } else {
          return {};
        }
      }
    };

    const sortParams = getSortParams();
    if (bookName) {
      if (queryType === "loose") {
        result = await Post.find(
          { $text: { $search: bookName, $diacriticSensitive: true } },
          { score: { $meta: "textScore" } }
        )
          .sort(sortParams)
          .skip(skip)
          .limit(limit);
      } else {
        result = await Post.find({ bookName: bookName })
          .sort(sortParams)
          .skip(skip)
          .limit(limit);
      }
      // query with only category
    } else if (category) {
      if (queryType === "strict") {
        result = await Post.find({ category: category })
          .sort(sortParams)
          .skip(skip)
          .limit(limit);
      } else {
        result = await Post.find(
          {
            $text: { $search: category, $diacriticSensitive: true },
          },
          { score: { $meta: "textScore" } }
        )
          .sort(sortParams)
          .skip(skip)
          .limit(limit);
      }
    } else {
      if (orderBy === "time") {
        result = await Post.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      } else {
        result = await Post.find().skip(skip).limit(limit);
      }
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(defaultErrorMsg(err));
  }
};

/**
 * req.params = { postId } needed
 */
const getPostById = async (req, res) => {
  try {
    const data = await Post.findById(req.params.postId);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

/**
 * req.params = { postId }
 * req.body = { ...updatedValue }
 */
const updatePostById = async (req, res) => {
  try {
    if (req.body.comments)
      throw new Error(
        "comment editing not allowed through this route, use posts/comments[/:commentId] for editing comments"
      );

    const postInfo = { ...req.body };
    if (postInfo.contactInfo)
      postInfo.contactInfo = JSON.parse(postInfo.contactInfo);
    if (req.files?.length) {
      const originalPost = await Post.findById(req.params.postId);
      const delPicsPaths = originalPost.photos;
      // console.log(delPicsPaths);
      for ({ path } of delPicsPaths) {
        // console.log(path);
        await fs.unlink(path);
      }
      const photos = [];
      for (file of req.files) {
        photos.push({
          fileName: file.filename,
          path: file.path,
        });
      }
      postInfo.photos = photos;
      // console.log(photos);
    }

    const data = await Post.findByIdAndUpdate(req.params.postId, postInfo, {
      new: true,
    });
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const deletePostById = async (req, res) => {
  try {
    const data = await Post.findByIdAndDelete(req.params.postId);
    // console.log(data);
    if (data) return res.status(200).send(data);
    else throw new Error("This post doesn't exists");
  } catch (error) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

module.exports = {
  createNewPost,
  handleGetPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
