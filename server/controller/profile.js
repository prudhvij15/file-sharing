const express = require("express");
const multer = require("multer");
const Aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const User = require("../model/user.js");

const router = express.Router();

Aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: "us-east-2",
  forcePathStyle: true,
});
const s3 = new Aws.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const profileImage = async (req, res) => {
  try {
    const userID = req.user.id;

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype;
      const fileName = `profile-pictures/${userID}/${uuidv4()}`;

      const params = {
        Bucket: "filemanager1",
        Key: fileName,
        Body: req.file.buffer,
        ContentType: fileType,
      };

      const data = await s3.upload(params).promise();
      console.log(data);
      const profilePictureUrl = data.Location;

      await User.findByIdAndUpdate(userID, {
        profilePicture: profilePictureUrl,
      });

      res.json({ profilePictureUrl });
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get user profile
const getProfile = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  profileImage,
  getProfile,
};
