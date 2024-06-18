const { Post } = require("../../models/posts");
const fs = require("fs-extra");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};

const unlinkFiles = async (paths) => {
  paths.forEach(async (path) => {
    await fs.unlink(path);
  });
};

/**
 * { postId } = req.params
 */
const getPhotos = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId, { photos: 1, _id: 0 });
    if (post) return res.status(200).send(post.photos);
    else throw Error("Post does not exist");
  } catch (err) {
    return res.status(200).send(defaultErrorMsg(err));
  }
};

/**
 * { postId } = req.params
 * { photos } = req.body (form-data)
 * multer middleware required
 */
const saveManyPhotos = async (req, res) => {
  const postId = req.params.postId;
  const newPhotos = [];
  try {
    for (file of req.files) {
      newPhotos.push({
        fileName: file.filename,
        path: file.path,
      });
    }
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { photos: { $each: newPhotos } },
    });
    console.log(post);
    return res.status(200).send({ msg: "Successfully saved photos" });
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

/**
 * { postId } = req.params
 * { fileNames } = req.body
 *
 */
const deleteManyPhotos = async (req, res) => {
  const postId = req.params.postId;
  const fileNames = req.body.fileNames;
  const paths = [];

  try {
    const result = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { photos: { fileName: { $in: fileNames } } },
      },
      { new: true }
    );
    for (fileName of fileNames) {
      paths.push(`public/images/${fileName}`);
    }
    unlinkFiles(paths);
    return res.status(200).send(result.photos);
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

module.exports = {
  deleteManyPhotos,
  saveManyPhotos,
  getPhotos,
};
