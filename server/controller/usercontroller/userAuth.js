const User = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      }
    );
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userCreate = async (req, res) => {
  const { email, password } = req.body;
  // console.log(username, email, password);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashPass, // Save the hashed password
    });

    await newUser.save();

    const sanitizedUser = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    return res.status(200).json({
      message: "User registered successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  user,
  userCreate,
};
