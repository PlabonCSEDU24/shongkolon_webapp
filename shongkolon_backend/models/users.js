const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const config = require("config");
const JWT_SECRET = config.get("JWT_SECRET");

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 7,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 5,
  },
  name: {
    type: String,
    maxlength: 100,
    minlength: 5,
  },
  contact_no: {
    type: String,
  },
  profilePhoto: {
    path: { type: String },
    fileName: { type: String },
  },
});

userSchema.methods.getJWT = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.JWT_SECRET || JWT_SECRET,
    { expiresIn: "72h" }
  );
};

const validateUser = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(5).max(255).required(),
    name: joi.string(),
    contact_no: joi.string().required(),
  });
  return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validateUser;
