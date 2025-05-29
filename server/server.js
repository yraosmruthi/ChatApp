const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userAuth = require("./Routes/userAuth");
const connectDb = require("./utils/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const chat = require("./Routes/Chat");
const message = require("./Routes/Message");
const fetchUsers = require("./Routes/fetchUsers");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const server = createServer(app);

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userAuth);
app.use("/api/chat", chat);
app.use("/api/message", message);
app.use("/api/fetch", fetchUsers);

app.get("/", (req, res) => {
  res.send("hey");
});

// Fixed Socket.IO configuration
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both URLs
    credentials: true,
    methods: ["GET", "POST"],
  },
  allowEIO3: true, // Backward compatibility
  transports: ["websocket", "polling"],
});

// Store user data for cleanup
const connectedUsers = new Map();

// Add connection debugging
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
    // Store user data for this socket
    connectedUsers.set(socket.id, userData);
    socket.join(userData._id);
    socket.emit("connected");
    console.log("User setup:", userData._id);
  });

  socket.on("join room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
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

  // Fixed disconnect handler
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

const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
  });
});
