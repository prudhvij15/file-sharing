// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController.js");
const fileController = require("./fileController.js");
const fileDeletion = require("./fileDeletion.js");

router.post("/upload", uploadController.uploadFile);

router.get("/files/:id", fileController.getFile);

router.delete("/files/:id", fileDeletion.deleteFile);

module.exports = router;
