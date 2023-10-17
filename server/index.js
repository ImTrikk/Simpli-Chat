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
  socket.to(room).emit("user_joined", data.username);
  console.log("Room after creatin a room: ", existingRooms);
 });

 socket.on("join_room", (room, user, callback) => {
  if (existingRooms.has(room)) {
   socket.join(room);
   socket.to(room).emit("user_joined", user);
   console.log("user_joined: ", user);
   console.log(`User joined room: ${room}`);
   callback(true);
  } else {
   if (typeof callback === "function") {
    callback(false);
   }
  }
 });

 socket.on("create_message", (data) => {
  console.log("message data: ", data);
  socket.to(data.room).emit("message_received", data);
 });

 // listen when the client disconnects from the socket
 socket.on("disconnect", (data) => {
  console.log("User disconnect");
  // existingRooms.clear();
 });

 socket.on("delete_room", (data) => {
  existingRooms.clear(data);
  console.log("Deleted rooms");
 });
});

server.listen(3001, () => {
 console.log("Server running on port 3001");
});
