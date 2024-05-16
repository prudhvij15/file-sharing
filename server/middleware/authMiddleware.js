const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    console.log(decoded);
    req.user = { id: decoded.userId }; // Extract the user's ID from the token
    console.log({ id: decoded.userId });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = authenticateUser;
