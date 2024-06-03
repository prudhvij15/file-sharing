const multer = require("multer");
const Aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const Item = require("../model/Item.js");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const PDFImage = require("pdf-image").PDFImage;

// Initialize AWS S3
Aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: "us-east-2",
  forcePathStyle: true,
});
const s3 = new Aws.S3();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

// Function to handle file uploads and generate presigned URLs
const getPresignedUrl = async (req, res) => {
  try {
    const userID = req.user.id;
    const uploadDirectory = "uploadedFiles";

    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload failed:", err);
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype;
      const fileName = req.file.originalname;
      const fileId = uuidv4();
      const filename = `${fileId}`;
      const filePath = path.join(uploadDirectory, filename);

      // Upload the file to S3
      const params = {
        Bucket: "filemanager1",
        Key: filePath,
        Body: req.file.buffer,
        ContentType: fileType,
      };

      await s3.putObject(params).promise();
      const fileUrl = `https://filemanager1.s3.amazonaws.com/${filePath}`;

      // Generate thumbnail for images or PDFs
      let thumbnailUrl = null;
      if (fileType.startsWith("image/")) {
        thumbnailUrl = await generateImageThumbnail(req.file.buffer, filename);
      } else if (fileType === "application/pdf") {
        console.log("PDF buffer length:", req.file.buffer.length); // Debug: Check PDF buffer length
        const pdfFilePath = `${uploadDirectory}/${filename}.pdf`; // Define PDF file path
        await fs.writeFile(pdfFilePath, req.file.buffer); // Write PDF buffer to file
        thumbnailUrl = await generatePdfThumbnail(
          pdfFilePath,
          filename,
          uploadDirectory
        ); // Pass the upload directory
      }

      // Save item details to database
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

const generateImageThumbnail = async (imageBuffer, filename) => {
  try {
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(500, 500, { withoutEnlargement: true }) // Resize without enlarging
      .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } }) // Fill transparent areas with white
      .jpeg({ quality: 90 }) // Adjust JPEG quality (optional)
      .toBuffer();

    const thumbnailPath = `thumbnails/${filename}.jpg`;
    const thumbnailParams = {
      Bucket: "filemanager1",
      Key: thumbnailPath,
      Body: thumbnailBuffer,
      ContentType: "image/jpeg",
    };

    await s3.putObject(thumbnailParams).promise();
    return `https://filemanager1.s3.amazonaws.com/${thumbnailPath}`;
  } catch (error) {
    console.error("Error generating image thumbnail:", error);
    return null;
  }
};

const generatePdfThumbnail = async (pdfFilePath, filename, uploadDirectory) => {
  try {
    // Initialize PDFImage with the PDF file path
    const pdfImage = new PDFImage(pdfFilePath);

    // Convert the first page of the PDF to an image
    const imagePath = await pdfImage.convertPage(0);

    // Read the image buffer
    const imageBuffer = await fs.readFile(imagePath);

    // Upload image buffer to S3
    const thumbnailPath = `thumbnails/${filename}-0.png`;
    const thumbnailParams = {
      Bucket: "filemanager1",
      Key: thumbnailPath,
      Body: imageBuffer,
      ContentType: "image/png",
    };
    await s3.putObject(thumbnailParams).promise();

    // Delete the temporary image file
    await fs.unlink(imagePath);
    await fs.unlink(pdfFilePath); // Delete the PDF file

    return `https://filemanager1.s3.amazonaws.com/${thumbnailPath}`;
  } catch (error) {
    console.error("Error generating PDF thumbnail:", error);
    return null;
  }
};

module.exports = {
  getPresignedUrl,
};
