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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
