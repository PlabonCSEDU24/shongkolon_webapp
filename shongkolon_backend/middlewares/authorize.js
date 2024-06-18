const jwt = require("jsonwebtoken");
const config = require("config");
const JWT_SECRET = config.get("JWT_SECRET");
const { User } = require("../models/users");
const _ = require("lodash");

module.exports = async function authorize(req, res, next) {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({ msg: "Access denied! No token found" });

  try {
    const decoded = jwt.verify(
      token.split(" ")[1].trim(),
      process.env.JWT_SECRET || JWT_SECRET
    );
    const user = await User.findById(decoded._id);
    if (user) {
      req.user = _.pick(user, [
        "name",
        "email",
        "password",
        "contact_no",
        "_id",
        "profilePhoto",
      ]);
      next();
    } else throw new Error("This user does not exist!");
  } catch (err) {
    return res.status(400).send({ msg: "Some problem with token" });
  }
};
