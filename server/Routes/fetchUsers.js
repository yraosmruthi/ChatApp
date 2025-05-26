const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); 
const protect  = require("../middlewares/protect");

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/search", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "User search failed" });
  }
});

module.exports = router;
