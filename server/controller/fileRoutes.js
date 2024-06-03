const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController.js");
const fileController = require("./fileController.js");
const fileDeletion = require("./fileDeletion.js");
const authenticateUser = require("../middleware/authMiddleware.js");
const userAuth = require("../controller/usercontroller/userAuth.js");
const { profileImage, profilePicture, getProfile } = require("./profile.js");
const path = require("path");
const fs = require("fs");

// Add this line to import the generatePdfThumbnail function
const { generatePdfThumbnail } = require("./uploadController.js");

router.get("/files", authenticateUser, fileController.getFile);
router.delete("/files/:id", authenticateUser, fileDeletion.deleteFile);

router.post("/login", userAuth.user);
router.post("/signup", userAuth.userCreate);
router.post(
  "/get-presigned-url",
  authenticateUser,
  uploadController.getPresignedUrl
);
router.post("/upload-profile-picture", authenticateUser, profileImage);
router.get("/profile", authenticateUser, getProfile);

module.exports = router;
