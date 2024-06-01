// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const connectDB = require("./db/connection");
// const router = require("./controller/fileRoutes");

// require("dotenv").config();

// const app = express();
// const AWS = require("aws-sdk");

// exports.handler = async () => {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });

//   const bucketName = "filemanager1";
//   const key = "download.jpeg";
//   const thumbnailKey = `${key}-thumbnail`;

//   try {
//     const params = {
//       Bucket: bucketName,
//       Key: key,
//     };

//     // Retrieve the image data from S3
//     const data = await s3.getObject(params).promise();

//     // Check if the image data is valid
//     if (!data || !data.Body) {
//       throw new Error("No image data found or empty body.");
//     }

//     // Convert the image data to a Buffer
//     const imageBuffer = Buffer.from(data.Body, "binary");

//     // Resize the image using GraphicsMagick
//     const gm = require("gm").subClass({ imageMagick: true });
//     const thumbnailBuffer = await new Promise((resolve, reject) => {
//       gm(imageBuffer)
//         .resize(200, 200)
//         .toBuffer((err, buffer) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(buffer);
//           }
//         });
//     });

//     // Upload the resized thumbnail back to S3
//     const putParams = {
//       Bucket: bucketName,
//       Key: thumbnailKey,
//       Body: thumbnailBuffer,
//     };
//     await s3.putObject(putParams).promise();

//     console.log(`Thumbnail uploaded successfully to ${thumbnailKey}`);
//     return { statusCode: 200, body: "Thumbnail generation successful!" };
//   } catch (error) {
//     console.error("Error generating thumbnail:", error);
//     return { statusCode: 500, body: "Thumbnail generation failed." };
//   }
// };

// // For local testing
// if (require.main === module) {
//   exports.handler().then(console.log).catch(console.error);
// }

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// console.log(process.env.AWS_ACCESS_KEY_ID);
// console.log(process.env.AWS_SECRET_ACCESS_KEY);
// connectDB();
// app.use("/api", router);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const gm = require("gm").subClass({ imageMagick: true });

const connectDB = require("./db/connection");
const router = require("./controller/fileRoutes");

const app = express();
const bucketName = "filemanager1";
const key = "download.jpeg";
const thumbnailKey = `${key}-thumbnail`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
connectDB();
app.use("/api", router);

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const sharp = require("sharp");

// const generateThumbnail = async () => {
//   try {
//     const params = {
//       Bucket: bucketName,
//       Key: key,
//     };

//     // Retrieve the image data from S3
//     const data = await s3.getObject(params).promise();
//     console.log("S3 object retrieved successfully:", data);

//     // Check if the image data is valid
//     if (!data || !data.Body) {
//       throw new Error("No image data found or empty body.");
//     }

//     // Resize the image using Sharp
//     const thumbnailBuffer = await sharp(data.Body).resize(200, 200).toBuffer();

//     // Upload the resized thumbnail back to S3
//     const putParams = {
//       Bucket: bucketName,
//       Key: thumbnailKey,
//       Body: thumbnailBuffer,
//       ContentType: "image/jpeg",
//     };
//     await s3.putObject(putParams).promise();

//     console.log(`Thumbnail uploaded successfully to ${thumbnailKey}`);
//     return { statusCode: 200, body: "Thumbnail generation successful!" };
//   } catch (error) {
//     console.error("Error generating thumbnail:", error.message);
//     console.error(error.stack);
//     return { statusCode: 500, body: "Thumbnail generation failed." };
//   }
// };

// // Run the thumbnail generation test
// generateThumbnail().then(console.log).catch(console.error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
