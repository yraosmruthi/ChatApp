const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

const Cloudinary_cloud_name = process.env.CLOUD_NAME;
const Cloudinary_api_key=process.env.API_KEY;
const Cloudinary_api_secret=process.env.API_SECRET;

cloudinary.config({
  cloud_name : Cloudinary_cloud_name,
  api_key : Cloudinary_api_key,
  api_secret : Cloudinary_api_secret,
  secure : true
}
);

console.log("Cloudinary config set to:", cloudinary.config());

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let userExist = await User.findOne({ email });

    if (!userExist && email.startsWith("guest")) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password,salt)
      userExist = await User.create({
        name: "Guest User",
        email,
        password:hash
      });
      const token = generateToken(userExist);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ must be true for cross-site cookie on HTTPS
        sameSite: "None", // ✅ must be "None" for cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json({
        msg: "user logged in successfully",
        token,
        userId: userExist._id.toString(),
      });
    }
    else if (!userExist) {
      return res.status(400).json("user doesnt exist");
    }
    else{
    const result = await bcrypt.compare(password, userExist.password);
    if (result) {
      const token = generateToken(userExist);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ must be true for cross-site cookie on HTTPS
        sameSite: "None", // ✅ must be "None" for cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json({
        msg: "user logged in successfully",
        token,
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(401).json({ msg: "user credentials wrong" });
    }
  }
 } catch (error) {
    return res.status(401).json({ msg: "internal server error" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json("user already exist");
    }
    let uploadImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      uploadImageUrl = result.secure_url;

      console.log("upload suceess"+result)

      fs.unlink(file.path, (err) => {
        if (err) console.log("Failed to delete local file:", err);
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const createUser = await User.create({
      name,
      email,
      password: hash,
      pic: uploadImageUrl,
    });
    console.log(createUser)
    return res
      .status(200)
      .json({ msg: "user created successfully", createUser });
  } catch (error) {
    console.log(error);
    return res.status(401).json({msg:"error"});
  }
};

const userLogout = async(req,res)=>{
  try{
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    
   res.status(200).json({msg:"logged out successfully"})
  }catch(error){
    console.log(error);
    res.status(200).json({msg:"error"})
  }
}

module.exports = { userLogin,userRegister,userLogout }