const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const accessChat = async(req,res)=>{
    const {userId}=req.body

    if(!userId){
        console.log("user id param not sent with request")
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate("users","-password")
      .populate("latestMessage")

    isChat = await User.populate(isChat,{
    path:"latestMessage.sender",
    select:"name pic email"
    })

    if(isChat.length >0){
        res.send(isChat[0])
    }else{
        var chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }
        try{
            const createdChat=await Chat.create(chatData)
            const FullChat = await Chat.findOne({_id:createdChat._id}).populate(
                "users",
                "-password"
            )
            res.status(200).json(FullChat)
        }catch(error){
            res.status(400).send(error)
            console.log(error)
        }
    }
}

const fetchChats = async (req,res)=>{
     try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
         .populate("users","-password")
         .populate("GroupAdmin","-password")
         .populate("latestMessage")
         .sort({updatedAt:-1})
         .then(async (results)=>{
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email pic"
            })
            res.status(200).send(results)
         })

     }catch(error){
         res.status(400)
         console.log(error)
     }

}

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("Fill all fields");
  }

  const users = req.body.users; // ← no JSON.parse

  if (users.length < 2) {
    return res.status(400).send("More than 2 users required for group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      GroupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("GroupAdmin", "-password");

    res.status(200).json(fullChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error while creating group" });
  }
};

const renameGroup = async (req,res)=>{
    const {chatId,chatName}= req.body

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName,
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("GroupAdmin","-password")

    if(!updatedChat){
        res.status(404).json({msg:"chat not found"})
    }else{
        res.status(200).json(updatedChat)
    }
}

const addToGroup = async (req,res)=>{
    const {chatId,userId} = req.body
    const add = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("GroupAdmin","-password")

    if(!add){
        res.status(404).json({msg:"Chat not found"})
    }else{
        res.status(200).json(add)
    }
}

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("GroupAdmin", "-password");

  if (!remove) {
    res.status(404).json({ msg: "Chat not found" });
  } else {
    res.status(200).json(remove);
  }
};



module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}