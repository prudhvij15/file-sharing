const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./db/connection");
const router = require("./controller/fileRoutes");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();
app.use("/api", router);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
