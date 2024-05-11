const Item = require("../model/Item.js");

const getFile = async (req, res) => {
  const userId = req.user.id;

  try {
    const files = await Item.find({ user: userId });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getFile,
};
