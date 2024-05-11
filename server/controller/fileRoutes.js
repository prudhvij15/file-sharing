const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController.js");
const fileController = require("./fileController.js");
const fileDeletion = require("./fileDeletion.js");
const authenticateUser = require("../middleware/authMiddleware.js");
const userAuth = require("../controller/usercontroller/userAuth.js");

router.post("/upload", authenticateUser, uploadController.uploadFileHandler);

router.get("/files", authenticateUser, fileController.getFile);
router.delete("/files/:id", authenticateUser, fileDeletion.deleteFile);

router.post("/login", userAuth.user);
router.post("/signup", userAuth.userCreate);

module.exports = router;
