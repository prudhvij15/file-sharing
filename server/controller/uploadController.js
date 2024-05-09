const multer = require("multer");
const Aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const Item = require("../model/Item.js");
const { generateFilename } = require("./filename.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

const uploadFileHandler = async (req, res) => {
  console.log("req.user:", req.user);

  const userID = req.user.id; // Use req.user.id to access the userId
  console.log("userID:", userID);
  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Multer error", error: err });
      } else if (err) {
        return res.status(500).json({ message: "Error", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const filename = generateFilename(req.file.originalname);
      // Upload file to S3
      const params = {
        apiVersion: "latest",
        Bucket: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
        Key: filename,
        Body: req.file.buffer,
      };

      await s3.upload(params).promise();
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;

      // Create a new item in the database with file details
      const newItem = new Item({
        file_name: req.file.originalname,
        file_location: fileUrl,
        file_mimetype: req.file.mimetype,
        file_key: filename,
        user: userID, // Associate file with user
      });
      await newItem.save();
      res
        .status(201)
        .json({ message: "File uploaded successfully", file_info: newItem });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to upload file", error: error.message });
    }
  });
};

module.exports = {
  uploadFileHandler,
};
