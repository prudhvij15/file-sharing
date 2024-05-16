const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // file_key: { type: String, required: true, trim: true },
  file_mimetype: { type: String, required: true, trim: true },
  file_location: { type: String, required: true, trim: true },
  file_name: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

itemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 15 });

module.exports = mongoose.model("Item", itemSchema);
