const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzqsmgj6r",
  api_key: "655415841471648",
  api_secret: "A3PcjdSWokzJuXgSM14bTnlU7y0",
});

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json("user doesnt exist");
    }
    const result = await bcrypt.compare(password, userExist.password);
    if (result) {
      const token = generateToken(userExist);
      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax", // Controls when cookies are sent (important for cross-origin)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (optional)
      });
      return res.status(200).json({
        msg: "user logged in successfully",
        token,
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(401).json({ msg: "user credentials wrong" });
    }
  } catch (error) {
    return res.status(401).json({ msg: "internal server error" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    const file = req.file;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json("user already exist");
    }
    let uploadImageUrl=""
    if(file){
      const result = await cloudinary.uploader.upload(file.path);
      uploadImageUrl = result.secure_url;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const createUser = await User.create({
      name,
      email,
      password: hash,
      pic: uploadImageUrl,
    });
    return res
      .status(200)
      .json({ msg: "user created successfully", createUser });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ msg: "error" });
  }
};

const userLogout = async (req,res) =>  {
  res.clearCookie("token")
  res.status(200).json({msg:"logged out successfully"})
}

module.exports = { userLogin, userRegister, userLogout };
