const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const postAuthorize = require("../middlewares/postAuthorize");
const commentAuthorize = require("../middlewares/commentAuthorize");
const { Post } = require("../models/posts");
const postController = require("../controllers/posts/basic");
const commentController = require("../controllers/posts/comments");
const photosController = require("../controllers/posts/photos");
const userSpecificController = require("../controllers/posts/user_specific");
const { postPhotosUpload } = require("../middlewares/fileSaver");

router
  .route("/")
  .get(postController.handleGetPosts)
  .post([authorize, postPhotosUpload], postController.createNewPost);

router.route("/user/:userId").get(userSpecificController.getUserSpecificPosts);

router
  .route("/:postId")
  .get(postController.getPostById)
  .put(
    [authorize, postAuthorize, postPhotosUpload],
    postController.updatePostById
  )
  .delete([authorize, postAuthorize], postController.deletePostById);

router
  .route("/:postId/photos/")
  .get(photosController.getPhotos)
  .post(
    [authorize, postAuthorize, postPhotosUpload],
    photosController.saveManyPhotos
  )
  .put([authorize, postAuthorize], photosController.deleteManyPhotos);

router
  .route("/:postId/comments")
  .get(commentController.getAllCommentFromPost)
  .post(authorize, commentController.addCommentToPost);

router
  .route("/:postId/comments/:commentId")
  .put([authorize, commentAuthorize], commentController.editCommentFromPost)
  .delete(
    [authorize, commentAuthorize],
    commentController.deleteCommentFromPost
  );

module.exports = router;
