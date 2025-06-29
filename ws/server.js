// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust as needed for production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`✅ User joined room: ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message }) => {
    console.log(`📨 Message to room ${roomId}:`, message);
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});