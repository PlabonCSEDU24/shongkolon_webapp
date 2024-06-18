const { Schema, model } = require("mongoose");

const commentSchema = Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  time: { type: Date, default: Date.now() },
});

const postSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: "User",
    },
    bookName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    author: {
      type: String,
      required: false,
      maxlength: 255,
    },
    category: { type: String },
    description: {
      type: String,
      maxlength: 1000,
    },
    contactInfo: {
      address: {
        type: String,
        maxlength: 1000,
      },
      phone: { type: String, maxlength: 20 },
      geoCode: { latitude: { type: String }, longitude: { type: String } },
    },
    price: {
      type: Number,
      max: 1000000000,
    },
    photos: [
      {
        fileName: { type: String },
        path: { type: String },
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);
postSchema.index({
  category: "text",
  bookName: "text",
  description: "text",
});

const Post = model("Post", postSchema);
Post.createIndexes();
module.exports.Post = Post;
