// controllers/deleteController.js

const Item = require("../model/Item");

exports.deleteFile = async (req, res) => {
  try {
    // Find the file in the database by ID
    const file = await Item.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await file.remove();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete file", error: error.message });
  }
};
