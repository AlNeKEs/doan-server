require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authAdmin");
const verifyLogin = require("../middleware/auth")

const User = require("../models/User");

// @route POST /api/auth/register
// @access public
router.post("/register", verifyToken, async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });

  try {
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "username already taken" });
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user",
      createBy: req.userId,
    });
    await newUser.save();
    return res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
  }
});

//@route POST api/auth/login
// access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect userame or password" });
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect userame or password" });
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET /api/auth
//check login
//access Public
router.get("/", verifyLogin, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
