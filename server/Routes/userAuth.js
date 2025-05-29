const express = require("express");
const router = express.Router();
const AuthController=require('../controllers/AuthController')
const upload = require("../middlewares/multer")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const protect = require("../middlewares/protect")

router.route("/login").post(AuthController.userLogin);
router.route("/register").post(upload.single("pic"), AuthController.userRegister);
router.route("/logout").post(AuthController.userLogout)
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user)
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.delete("/delete", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    res.clearCookie("token"); // or however you store JWTs
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
