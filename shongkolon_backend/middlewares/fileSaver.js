const multer = require("multer");
const uuid = require("uuidv1");
const path = require("path");
const fs = require("fs-extra");
const {
  MIME_TYPE_MAP,
  MIME_TYPE_MAP_for_profile_pic,
} = require("../constants/mimeTypes");

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dest = `public/images/`;
    try {
      await fs.ensureDir(dest);
      cb(null, dest);
    } catch (e) {
      cb("Could not save", null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}.${MIME_TYPE_MAP[file.mimetype]}`);
  },
});

module.exports.postPhotosUpload = (req, res, next) => {
  multer({
    storage: imageStorage,
    limits: { fileSize: 1024 * 1024 * 3 },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP_for_profile_pic[file.mimetype];
      if (isValid) cb(null, true);
      else cb("Filetype not supported", false);
    },
  }).array("photos")(req, res, (err) => {
    if (err) next(err);
    else next();
  });
};

module.exports.profilePhotoUpload = (req, res, next) => {
  multer({
    storage: imageStorage,
    limits: { fileSize: 1024 * 1024 * 3 },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP_for_profile_pic[file.mimetype];
      if (isValid) cb(null, true);
      else {
        cb(Error("Filetype not supported"));
      }
    },
  }).single("profilePhoto")(req, res, (err) => {
    if (err) next(err);
    else next();
  });
};
