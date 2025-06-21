const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const userAuth = require("./Routes/userAuth");
const connectDb = require("./utils/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const chat = require("./Routes/Chat");
const message = require("./Routes/Message");
const fetchUsers = require("./Routes/fetchUsers");
const EditProfile = require("./Routes/EditProfile");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const server = createServer(app);

app.use(
  cors({
    origin: "https://chatapp-1-td4o.onrender.com/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userAuth);
app.use("/api/chat", chat);
app.use("/api/message", message);
app.use("/api/fetch", fetchUsers);
app.use("/api/edit", EditProfile);

app.get("/", (req, res) => {
  res.send("hey");
});

const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://chatapp-1-td4o.onrender.com",
      "https://chatapp-67ws.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
  },
  allowEIO3: true,
  transports: ["websocket", "polling"],
});

const connectedUsers = new Map();

io.engine.on("connection_error", (err) => {
  console.log("Connection error:", err.req);
  console.log("Error code:", err.code);
  console.log("Error message:", err.message);
  console.log("Error context:", err.context);
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io:", socket.id);
  console.log("Client address:", socket.handshake.address);

  socket.on("setup", (userData) => {
    connectedUsers.set(socket.id, userData);
    socket.join(userData._id);
    socket.emit("connected");
    console.log("User setup:", userData._id);
  });

  socket.on("join room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) {
      console.log("Invalid chat - no users");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      console.log("User disconnected:", userData._id);
      socket.leave(userData._id);
      connectedUsers.delete(socket.id);
    } else {
      console.log("User disconnected:", socket.id);
    }
  });
});

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
  });
});
