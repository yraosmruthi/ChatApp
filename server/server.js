const express=require('express')
const app = express()
const dotenv=require('dotenv')
const userAuth = require("./Routes/userAuth");
const connectDb=require("./utils/db")
const cookieParser = require("cookie-parser");
const cors = require('cors')
const chat = require("./Routes/Chat")
const message = require("./Routes/Message")
const fetchUsers = require("./Routes/fetchUsers")
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);

dotenv.config()

app.use(
  cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    credentials: true, // if you're using cookies or sessions
  })
);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userAuth);
app.use("/api/chat",chat)
app.use("/api/message",message)
app.use("/api/fetch",fetchUsers)



app.get("/",(req,res)=>{
    res.send("hey")
})


const io = new Server(httpServer, {
 pingTimeout:60000,
 cors:{
  origin:"http://localhost:5173",
  credentials:true
 }
});

io.on("connection",(socket)=>{
  console.log("connected to socket io")

  socket.on("setup",(userData)=>{
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join room",(room)=>{
    socket.join(room)
    console.log("user joined room"+room)
  })

  socket.on("typing",(room)=> socket.in(room).emit("typing"))
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message",(newMessageRecieved)=>{
    let chat = newMessageRecieved.chat
    if(!chat.users) return console.log("invalid chat ")
    chat.users.forEach((user)=>{
       if(user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved",newMessageRecieved)
   })
  })
  
  socket.off("setup",()=>{
    console.log("user disconnected")
    socket.leave(userData._id)
  })

})


const PORT = process.env.PORT||3000
connectDb().then(()=>{
    httpServer.listen(PORT, () => {
    console.log(`server connected on port ${PORT}`);
    });
})
