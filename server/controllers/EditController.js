const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const Cloudinary_cloud_name = process.env.CLOUD_NAME;
const Cloudinary_api_key = process.env.API_KEY;
const Cloudinary_api_secret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
  secure: true,
});

const fs = require("fs");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs")

const editName = async (req,res)=>{
    const {newName} = req.body

    if(!newName){
        return res.status(400).json({msg:"New name is required"})
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {name:newName},
            {new:true}
        )
        res.status(200).json({
            msg:"name updated successfully",
            updatedUser
        })
    }catch(error){
        res.status(500).json({message:"failed to update name",error})
    }
     
}

const editEmail = async (req, res) => {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ msg: "New name is required" });
    }

    try {

      const emailExists = await User.findOne({email:newEmail})
      if(emailExists){
        return res.status(400).json({msg:"email already in use"})
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { email:newEmail},
        {new:true}
      )
      res.status(200).json({
        msg: "email updated successfully",
        updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "failed to update email", error });
    }
};

const editPic = async (req, res) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.user:", req.user);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: "No file provided" });
    }

    const result = await cloudinary.uploader.upload(file.path);
    console.log("Cloudinary upload success:");

    // Delete local file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    const updatedPic = await User.findByIdAndUpdate(
      req.user._id,
      { pic: result.secure_url },
      { new: true }
    );

    if (updatedPic) {
      return res.status(200).json({ msg: "Pic updated successfully" });
    } else {
      return res.status(400).json({ msg: "Failed to update user" });
    }
  } catch (error) {
    console.error("❌ Error in editPic:", error);
    return res.status(500).json({ msg: "Backend error", error: error.message });
  }
};

const editPassword = async (req,res) => {
  const {oldPassword, newPassword} = req.body
  try{
  if(!oldPassword || !newPassword){
    return res.json(400).json({msg:"fill all fields"})
  }
  const user = await User.findById(req.user._id)
  const isMatch = await bcrypt.compare(oldPassword,user.password)

  if(!isMatch){
    return res.status(400).json({ msg: "invalid password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword,salt)

  const response = await User.findByIdAndUpdate(
    user,
    {password:hash},
    {new:true}
  )
  if(!response){
    return res.status(400).json({ message: "password updation not successfull" });
  }
  return res.status(200).json({ message: "Password updated successfully" });
}catch(error){
  console.log(error)
  res.status(500).json({ message: "backend error" });
 }

}

module.exports = {editName,editEmail,editPic,editPassword}