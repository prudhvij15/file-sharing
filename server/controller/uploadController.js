const multer = require("multer");
const Aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const Item = require("../model/Item.js");
const sharp = require("sharp");

Aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: "us-east-2",
  forcePathStyle: true,
});

const s3 = new Aws.S3();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const getPresignedUrl = async (req, res) => {
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
      const fileName = req.file.originalname;
      const fileId = uuidv4();
      const filename = `${userID}/${fileId}`;
      const filePath = `uploads/${filename}`;
      const thumbnailPath = `thumbnails/${filename}`;

      // Upload the original file to S3
      const params = {
        Bucket: "filemanager1",
        Key: filePath,
        Body: req.file.buffer,
        ContentType: fileType,
      };

      await s3.putObject(params).promise();
      const fileUrl = `https://filemanager1.s3.amazonaws.com/${filePath}`;

      // Generate the thumbnail
      const thumbnailBuffer = await sharp(req.file.buffer)
        .resize(200, 200)
        .toBuffer();

      // Upload the thumbnail to S3
      const thumbnailParams = {
        Bucket: "filemanager1",
        Key: thumbnailPath,
        Body: thumbnailBuffer,
        ContentType: fileType,
      };

      await s3.putObject(thumbnailParams).promise();
      const thumbnailUrl = `https://filemanager1.s3.amazonaws.com/${thumbnailPath}`;

      const newItem = new Item({
        file_location: fileUrl,
        thumbnail_location: thumbnailUrl,
        file_mimetype: fileType,
        file_name: fileName,
        user: userID,
      });

      await newItem.save();

      res.json({ fileUrl, thumbnailUrl });
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getPresignedUrl,
};
