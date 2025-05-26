const chat = require("../models/chatModel")
const Message = require("../models/messageModel")
const User = require("../models/userModel")


const sendMessage = async (req,res)=>{
    const {content,chatId} = req.body

    if(!content || !chatId){
        console.log("invalid data passed into request")
        return res.status(400).json({msg:"invalid data"})
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try{
        let createdMessage = await Message.create(newMessage);

        // Now use findById to properly chain populates
        let message = await Message.findById(createdMessage._id)
          .populate("sender", "name pic")
          .populate({
            path: "chat",
            populate: {
              path: "users",
              select: "name pic email",
            },
          });
      
        
        await chat.findByIdAndUpdate(chatId,{
            latestMessage:message
        })
        res.json({message})
        

    }catch(error){
        console.log(error)
        res.status(500).json({msg:"internal server error"})
    }
}

const allMessages = async (req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")

        res.status(200).json(messages)

    }catch(error){
         console.log(error)
          res.status(400).json("error")
    }
}


module.exports = {sendMessage,allMessages}