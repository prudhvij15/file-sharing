const multer = require("multer");
const Item = require("../model/Item.js");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../server/uploadedFiles"); // Set the destination folder where files will be saved
  },
  filename(req, file, cb) {
    cb(null, `${new Date().getTime()}__${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadFileHandler = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Multer error", error: err });
      } else if (err) {
        return res.status(500).json({ message: "Error", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newItem = new Item({
        file_name: req.file.originalname,
        file_location: req.file.destination,
        file_mimetype: req.file.mimetype,
        file_key: req.file.filename,
      });

      await newItem.save();

      res
        .status(201)
        .json({ message: "File uploaded successfully", item: newItem });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to upload file", error: error.message });
    }
  });
};

module.exports = {
  uploadFileHandler,
};
