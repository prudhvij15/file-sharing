const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  fileUrl: String, // Store the URL or path to the uploaded file
});

module.exports = mongoose.model("Item", itemSchema);
