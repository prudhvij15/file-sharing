const express = require("express");
const cors = require("cors");
const multer = require("multer");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./db/connection");
const router = require("./controller/fileRoutes");

require("dotenv").config();
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_ACCESS_KEY_SECRET);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();
app.use("/api", router);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
