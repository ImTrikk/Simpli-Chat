const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
 cors: {
  origin: "*",
  methods: ["GET", "POST"],
 },
});

// stores all existing rooms
const existingRooms = new Set();

io.on("connection", (socket) => {
 // listener for creating chat rooms
 socket.on("create_room", (data) => {
  socket.join(data);
  console.log(`UserID: ${socket.id} room: ${data}`);
  existingRooms.add(data);
  console.log("Room after creatin a room: ", existingRooms);
 });

 socket.on("join_room", (room, callback) => {
  if (existingRooms.has(room)) {
   socket.join(room);
   callback(true);
   socket.on("logged_user", (data) => {
    socket.to(data.room).emit("User in room", data);
   });
   console.log(`User joined room: ${room}`);
  } else {
   callback(false);
   // Handle the case when the room doesn't exist
   console.log(`Room not found: ${room}`);
  }
 });

 socket.on("user_joined", (data) => {
  socket.to(data.room).emit("user_joined", data);
 });

 socket.on("create_message", (data) => {
  console.log("message data: ", data);
  socket.to(data.room).emit("message_received", data);
 });

 // listen when the client disconnects from the socket
 socket.on("disconnect", (data) => {
  console.log("User disconnect");
  existingRooms.clear();
  console.log("Rooms cleared....");
 });
});

server.listen(3001, () => {
 console.log("Server running on port 3001");
});
