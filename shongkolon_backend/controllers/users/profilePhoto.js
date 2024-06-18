const { User } = require("../../models/users");
const fs = require("fs-extra");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};

const responseObj = (msg) => ({ msg: msg });

const getProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.profilePhoto) res.send(user.profilePhoto);
    else return res.status(400).send(responseObj("No profile photo"));
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    const beforeUser = await User.findById(req.user._id);
    if (beforeUser.profilePhoto.path) {
      const dir = beforeUser.profilePhoto.path;
      await fs.unlink(dir);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePhoto: {
          path: req.file.path,
          fileName: req.file.filename,
        },
      },
      { new: true }
    );
    return res.status(200).send(user.profilePhoto);
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const deleteProfilePhoto = async (req, res) => {
  try {
    const beforeUser = await User.findById(req.user._id);
    if (beforeUser.profilePhoto.path) {
      const dir = beforeUser.profilePhoto.path;
      await fs.unlink(dir);
    }
    await User.findByIdAndUpdate(req.user._id, {
      profilePhoto: {
        path: null,
        fileName: null,
      },
    });
    return res.status(200).send(responseObj("Deletion successful"));
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

module.exports = {
  getProfilePhoto,
  updateProfilePhoto,
  deleteProfilePhoto,
};
