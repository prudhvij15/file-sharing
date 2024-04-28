const multer = require("multer");
const Item = require("../model/Item.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports.uploadFile = async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
    });

    await newItem.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", item: newItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload filewwww", error: error.message });
  }
};
