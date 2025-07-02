const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// CORS setup
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true,
}));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 👇 Track connected users by userId
const userSocketMap = new Map(); // userId => socketId

// Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`🧾 Registered user: ${userId} with socket ID: ${socket.id}`);
  });

  // Send message
  socket.on("send_message", ({ to, from, content }) => {
    const targetSocketId = userSocketMap.get(to);
    if (targetSocketId) {
      console.log(`📤 ${from} ➡️ ${to}: ${content}`);
      io.to(targetSocketId).emit("receive_message", {
        from,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      });
    } else {
      console.log(`⚠️ User ${to} is not connected.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    // Remove disconnected socket from map
    for (let [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`🗑️ Removed user ${userId} from active users.`);
        break;
      }
    }
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
