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
const existingRooms = new Map();

// !render usernames only on the same socket
const existingUsers = new Map();

io.on("connection", (socket) => {
 // listener for creating chat rooms
 socket.on("create_room", (data, username) => {
  socket.join(data);
  existingRooms.set(data, 1);
  existingUsers.set(username, 1);
  socket.to(data).emit("user_joined", username);
 });

 socket.on("join_room", (room, user, callback) => {
  if (existingRooms.has(room) && !existingUsers.has(user)) {
   socket.join(room);
   socket.to(room).emit("user_joined", user);
   existingUsers.set(user, 1);
   existingRooms.set(room, existingRooms.get(room) + 1);
   callback(true);
  } else {
   console.log("Existing user!!!");
   if (typeof callback === "function") {
    callback(false);
   }
  }
 });

 socket.on("all_usernames", () => {
  const usernames = Array.from(existingUsers.keys());
  socket.emit("all_usernames", usernames);
 });

 socket.on("create_message", (messageData) => {
  if (messageData.image instanceof Buffer) {
   // Convert the binary image data to a base64 data URL
   const imageBase64 = `data:image/jpeg;base64,${messageData.image.toString(
    "base64",
   )}`;
   messageData.image = imageBase64; // Replace binary data with data URL
  }
  console.log("message messageData: ", messageData);
  socket.to(messageData.room).emit("message_received", messageData);
 });

 socket.on("user_left", (data) => {
  const { room, username } = data;
  socket.leave(room);
  socket.to(room).emit("user_left", username);
  existingUsers.delete(username);
  let userCount = existingUsers.size;
  console.log("User count: ", userCount);
  if (userCount > 0) {
   existingRooms.set(room, userCount - 1); // Decrement user count
  }
  if (userCount == 0) {
   existingRooms.delete(room); // Remove the room from the Map
   console.log("Room after deletion: ", existingRooms);
  }
 });

 // listen when the client disconnects from the socket
 socket.on("disconnect", (room) => {
  console.log("User disconnect");
  const count = existingUsers.size;
  if (count == 0) {
   existingUsers.clear();
   existingRooms.clear(room);
   console.log("Deleted users on disconnections", existingUsers);
  }
 });

 socket.on("delete_room", (data) => {
  existingRooms.clear(data);
  console.log("Deleted rooms");
 });
});

server.listen(3001, () => {
 console.log("Server running on port 3001");
});
