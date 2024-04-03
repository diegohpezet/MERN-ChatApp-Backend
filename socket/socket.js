const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

// Creates socket server on top of application
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Stores connected users and their sockets
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Sends connected users id list

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Sends connected users id list
  });
});


module.exports = { app, io, server, getReceiverSocketId };