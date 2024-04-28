// controllers/deleteController.js

const Item = require("../model/Item");

// Controller function for deleting files
exports.deleteFile = async (req, res) => {
  try {
    // Find the file in the database by ID
    const file = await Item.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file from the database
    await file.remove();

    // Respond with a success message
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    res
      .status(500)
      .json({ message: "Failed to delete file", error: error.message });
  }
};
