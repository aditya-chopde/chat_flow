// server/index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend
    methods: ["GET", "POST"]
  }
});

// Utility: Generate private room ID
const getRoomId = (email1, email2) =>
  [email1, email2].sort().join("+"); // consistent order

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join-room", ({ userEmail, peerEmail }) => {
    const roomId = getRoomId(userEmail, peerEmail);
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on("send-message", ({ from, to, content }) => {
    const roomId = getRoomId(from, to);
    const message = {
      id: Date.now().toString(),
      senderId: from,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "received",
    };

    // Emit to both users
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on http://localhost:4000");
});
