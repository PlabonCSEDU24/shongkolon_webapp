const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const JWT_SECRET = config.get("JWT_SECRET");
const fs = require("fs-extra");

const defaultErrorMsg = (err) => {
  return {
    msg: err.message || "Something went wrong!",
  };
};

/**
 * { userId } = req.params
 */
const getUserInfo = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await User.findById(userId);
    const user = _.pick(result, [
      "_id",
      "email",
      "name",
      "contact_no",
      "profilePhoto",
    ]);
    if (result) return res.status(200).send(user);
    else throw Error("User doesn't exist");
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const result = await User.findById(req.user._id, { password: 0 });
    if (result) return res.status(200).send(result);
    else throw Error("This user doesn't exist anymore");
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const createNewUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ msg: "User already exists" });

    user = new User(
      _.pick(req.body, ["email", "password", "name", "contact_no"]),
    );

    if (req.file) {
      const imagefile = req.file;
      const profilePhoto = {
        path: imagefile.path,
        fileName: imagefile.filename,
      };
      user.profilePhoto = profilePhoto;
    } else {
      user.profilePhoto = {
        path: null,
        fileName: null,
      };
    }
    console.log(user);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const token = user.getJWT();
    const result = await user.save();

    res.status(200).send({
      token: token,
      user: _.pick(result, [
        "_id",
        "email",
        "name",
        "contact_no",
        "profilePhoto",
      ]),
    });
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const authUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email)
      return res.status(400).send({ msg: "No email found in request body" });
    if (!password)
      return res.status(400).send({ msg: "No password found in request body" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send({ msg: "Email doesn't exist" });

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.status(400).send({ msg: "Password is wrong!" });

    const token = user.getJWT();
    return res.status(200).send({
      token: token,
      user: _.pick(user, [
        "_id",
        "email",
        "name",
        "contact_no",
        "profilePhoto",
      ]),
    });
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const tokenValidation = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    const user = await User.findById(decoded._id);
    const ret = _.pick(user, [
      "_id",
      "name",
      "email",
      "contact_no",
      "profilePhoto",
    ]);
    return res.status(200).send(ret);
  } catch (err) {
    return res.status(400).send({ msg: "Not a valid token!" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.body._id) {
      throw new Error("_id field cannot be updated!");
    }
    if (req.body.email) {
      throw new Error("email field cannot be updated!");
    }
    if (!req.body.currentPassword) {
      throw new Error("Without password we will not change any info!");
    }

    const userId = req.user._id;
    const newValues = { ...req.body };
    const passTest = await bcrypt.compare(
      newValues.currentPassword,
      req.user.password,
    );
    if (!passTest) throw Error("Wrong password given!");

    // handle profile picture
    if (req.file) {
      if (req.user.profilePhoto.path)
        await fs.unlink(req.user.profilePhoto.path);
      const imagefile = req.file;
      const profilePhoto = {
        path: imagefile.path,
        fileName: imagefile.filename,
      };
      newValues.profilePhoto = profilePhoto;
    }

    if (newValues.newPassword) {
      const salt = await bcrypt.genSalt(10);
      newValues.password = await bcrypt.hash(newValues.newPassword, salt);
    }

    const update = _.pick(newValues, [
      "name",
      "password",
      "contact_no",
      "profilePhoto",
    ]);

    const updatedInfo = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });
    const token = updatedInfo.getJWT();
    const ret = _.pick(updatedInfo, [
      "_id",
      "email",
      "name",
      "contact_no",
      "profilePhoto",
    ]);
    return res.status(200).send({ token: token, user: ret });
  } catch (err) {
    return res.status(400).send(defaultErrorMsg(err));
  }
};

const deleteUser = async (req, res) => {
  try {
    const proPic = req.user.profilePhoto.path;
    if (proPic) await fs.unlink(proPic);
    const result = await User.findByIdAndDelete(req.user._id);
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(defaultErrorMsg(err));
  }
};

module.exports = {
  tokenValidation,
  authUser,
  createNewUser,
  getUserInfo,
  getCurrentUser,
  updateUser,
  deleteUser,
};
