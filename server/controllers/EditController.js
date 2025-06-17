const User = require("../models/userModel");

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

module.exports = {editName,editEmail}