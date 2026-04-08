const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://chat-flow-bay.vercel.app",
  "http://52.66.107.189:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 👇 Track connected users by userId
const userSocketMap = new Map(); // userId => socketId

// Socket.IO events
io.on("connection", (socket) => {
  // Register user
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
  });

  // Send message
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
      console.log(`⚠️ User ${to} is not connected.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (let [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello from Socket.IO server!");
});

// ✅ Fix: Use environment variable for port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
