const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ✅ Allow all origins (simple fix)
app.use(cors());

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // allow all
    methods: ["GET", "POST"],
  },
});

// 👇 Track connected users by userId
const userSocketMap = new Map();

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
  });

  socket.on("send_message", ({ to, from, content }) => {
    const targetSocketId = userSocketMap.get(to);

    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_message", {
        from,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } else {
      console.log(`⚠️ User ${to} not connected`);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Socket.IO server!");
});

// Port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});