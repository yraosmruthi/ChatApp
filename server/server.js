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

const PORT = process.env.PORT||3000
connectDb().then(()=>{
    app.listen(PORT, () => {
    console.log(`server connected on port ${PORT}`);
    });
})
