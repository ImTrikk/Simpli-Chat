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

io.on("connection", (socket) => {
 console.log(`User connected: ${socket.id}`);

 // declare events
 socket.on("create_room", (data) => {
  socket.join(data);
  console.log(`Username: ${socket.id} room: ${data}`);
 });

 // join room
 socket.on("join_room", async (data) => {
  const roomExists = io.sockets.adapter.rooms[data] !== undefined;
  if (!roomExists) {
   socket.emit("room_not_found");
   console.log("Room not found!");
  } else {
   console.log("User joined!")
   socket.join(data);
   console.log(`Username: ${socket.id} room: ${data}`);
  }
 });

 socket.on("create_message", (data) => {
  console.log(data);
  socket.to(data.room).emit("message_received", data);
 });

 socket.on("disconnect", () => {
  console.log("User disconnect");
 });
});

server.listen(3001, () => {
 console.log("Server running on port 3001");
});
