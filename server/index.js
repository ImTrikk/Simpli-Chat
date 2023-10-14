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
 // check user login
 console.log(`User connected: ${socket.id}`);
 // declare event listeners
 socket.on("create_room", (data) => {
  socket.join(data);
  console.log(`Username: ${socket.id} room: ${data}`);
  existingRooms.add(data);
 });

 // check if room exist
 // ? when user joins, add their id and username also to pass it back to the  front end
 socket.on("join_room", (room, callback) => {
  if (existingRooms.has(room)) {
   socket.join(room);
   callback(true);
   // add loggd user for rendering in the front end
   socket.emit("")
   console.log(`User joined room: ${room}`);
  } else {
   callback(false);
   // Handle the case when the room doesn't exist
   console.log(`Room not found: ${room}`);
  }
 });

 // create message listener
 // ? when user joins, add their id and username also to pass it back to the  front end
 socket.on("create_message", (data) => {
  console.log(data);
  socket.to(data.room).emit("message_received", data);
 });

 socket.on("disconnect", () => {
  console.log("User disconnect");
 });
});

// create socket for random chatting
// 2 users can wait and then connect directly


server.listen(3001, () => {
 console.log("Server running on port 3001");
});
