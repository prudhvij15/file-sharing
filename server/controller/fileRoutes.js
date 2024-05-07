// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController.js");
const fileController = require("./fileController.js");
const fileDeletion = require("./fileDeletion.js");
const userAuth = require("../controller/usercontroller/userAuth.js");

router.post("/upload", uploadController.uploadFileHandler);

router.get("/files/:id", fileController.getFile);

router.delete("/files/:id", fileDeletion.deleteFile);

router.post("/login", userAuth.user);

router.post("/signup", userAuth.userCreate);

module.exports = router;
