const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" },],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    GroupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timeStamps: true }
);

const Chat = mongoose.model( "Chat", chatSchema);

module.exports =Chat