exports.getFile = async (req, res) => {
  try {
    res.status(200).json({ message: "File retrieved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve file", error: error.message });
  }
};
