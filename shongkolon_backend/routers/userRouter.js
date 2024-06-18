const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const userController = require("../controllers/users/user");
const userPhotoController = require("../controllers/users/profilePhoto");
const { profilePhotoUpload } = require("../middlewares/fileSaver");

router
  .route("/")
  .get(authorize, userController.getCurrentUser)
  .put([authorize, profilePhotoUpload], userController.updateUser)
  .delete([authorize], userController.deleteUser)
  .post((req, res) => {
    return res
      .status(400)
      .send({ msg: `Use /signup or /login for authentication!` });
  });

router
  .route("/signup")
  .post(profilePhotoUpload, userController.createNewUser)
  .get((r, s) => s.send({ msg: "You need to POST! not GET" }));
router
  .route("/login")
  .post(userController.authUser)
  .get((r, s) => s.send({ msg: "You need to POST! not GET" }));

router.route("/login/:token").get(userController.tokenValidation);

router
  .route("/profilePhoto")
  .get(authorize, userPhotoController.getProfilePhoto)
  .put([authorize, profilePhotoUpload], userPhotoController.updateProfilePhoto)
  .delete([authorize], userPhotoController.deleteProfilePhoto);

router.route("/:userId").get(userController.getUserInfo);

module.exports = router;
