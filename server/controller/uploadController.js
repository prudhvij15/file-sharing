const multer = require("multer");
const Aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const Item = require("../model/Item.js");

Aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: "us-east-2",
  forcePathStyle: true,
});
const s3 = new Aws.S3();

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file"); // Handle a single file upload with the key 'file'

const getPresignedUrl = async (req, res) => {
  try {
    const userID = req.user.id;

    // Use multer to handle the file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype;
      const fileName = req.file.originalname;

      // Generate a unique identifier for the file
      const fileId = uuidv4();
      const filename = `${userID}/${fileId}`;

      // Configure parameters for generating presigned URL
      const params = {
        Bucket: "filemanager1",
        Key: `uploads/${filename}`, // Key is the path to the file in the bucket
        Expires: 600, // URL expires in 10 minutes (600 seconds)
        ContentType: fileType,
      };

      // Generate presigned URL
      const url = await s3.getSignedUrlPromise("putObject", params);
      const fileUrl = `https://filemanager1.s3.amazonaws.com/uploads/${filename}`;

      // Store fileId along with file details in your database
      const newItem = new Item({
        file_location: fileUrl,
        file_mimetype: fileType,
        file_name: fileName,
        user: userID,
      });
      await newItem.save();

      res.json({ url, fileUrl });
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getPresignedUrl,
};
