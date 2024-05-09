const Item = require("../model/Item.js");

const getFile = async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is stored in req.user

  try {
    // Query the database for files associated with the logged-in user
    const files = await Item.find({ user: userId });

    // Return the files as a response
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getFile,
};
