const Item = require("../model/Item");

exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    await Item.findByIdAndDelete(fileId);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
