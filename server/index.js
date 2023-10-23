const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { callbackify } = require("util");

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
const usersInRoom = new Map();
const RandomUsers = new Map();
const RandomUserUser = new Map();

io.on("connection", (socket) => {
 console.log("user connected ");

 socket.on("create_room", (data, username, callback) => {
  try {
   if (existingRooms.has(data)) {
    console.log("Room already exist");
    callback(true);
   } else {
    callback(false);
    if (!usersInRoom.has(username)) {
     socket.join(data);
     existingRooms.set(data, 1);
     usersInRoom.set(data, [username]);
     console.log("Room created!");
     socket.to(data).emit("user_joined", username);
    }
   }
  } catch (err) {
   console.log(err);
  }
 });

 socket.on("join_room", (room, user, callback) => {
  try {
   if (existingRooms.has(room)) {
    if (!usersInRoom.has(user)) {
     socket.join(room);
     socket.to(room).emit("user_joined", user);
     usersInRoom.get(room).push(user);
     // existingRooms.set(room, existingRooms.get(room) + 1);
     if (typeof callback === "function") {
      callback(true);
     }
    } else {
     if (typeof callback === "function") {
      callback(false, "User already exist");
     }
    }
   } else {
    console.log("Existing user!!!");
    if (typeof callback === "function") {
     callback(false, "User already exist");
    }
   }
  } catch (err) {
   console.log(err);
  }
 });

 socket.on("all_usernames", (room) => {
  try {
   if (usersInRoom.has(room)) {
    const usernames = usersInRoom.get(room);
    socket.emit("all_usernames", usernames);
   }
  } catch (err) {
   console.log(err);
  }
 });

 socket.on("create_message", (messageData) => {
  try {
   // Emit the message data to the room
   socket.to(messageData.room).emit("create_message", messageData);
  } catch (err) {
   console.error("Image error:", err);
  }
 });

 socket.on("user_left", (data) => {
  try {
   const { room, username } = data;
   // remove the user from the map
   if (usersInRoom.has(room)) {
    const usersInThisRoom = usersInRoom.get(room);
    for (let i = 0; i < usersInThisRoom.length; i++) {
     if (usersInThisRoom[i] == username) {
      usersInThisRoom.splice(i, 1);
      socket.leave(room);
      if (usersInRoom.get(room).length === 0) {
       existingRooms.delete(room);
      }
      socket.to(room).emit("user_left", username);
      break;
     }
    }
   }
  } catch (err) {
   console.log(err);
  }
 });

 //start the random chat here

 function generateUniqueRoomName() {
  return Math.random().toString(36).substring(2, 10);
 }

 socket.on("random_connect", (username) => {
  RandomUsers.set(socket.id, 1);
  console.log("Random users: ", RandomUsers);
  console.log("test length: ", RandomUsers.size);

  if (RandomUsers.size === 2) {
   // Two users are available, create a chat room name
   const roomName = generateUniqueRoomName();
   console.log("Room name generated: ", roomName);

   // Get the keys (socket IDs) from the map
   const socketIds = [...RandomUsers.keys()];

   //  Get the socket instances using the socket IDs
   const userSocket1 = io.sockets.sockets.get(socketIds[0]);
   const userSocket2 = io.sockets.sockets.get(socketIds[1]);

   console.log(userSocket1);
   console.log(userSocket2);

   userSocket1.join(roomName);
   userSocket2.join(roomName);

   userSocket1
    .to(roomName)
    .emit("random_user_joined", username, roomName, (callback) => {
     if (typeof callback == "function") {
      callback(true);
     }
    });
   userSocket2
    .to(roomName)
    .emit("random_user_joined", username, roomName, (callback) => {
     if (typeof callback == "function") {
      callback(true);
     }
    });

   console.log("success join room");

   // Reset the RandomUsers array for the next round of matching
   RandomUsers.length = 0;
  }
 });

 socket.on("random_message", (messageData) => {
  socket.to(messageData.room).emit("create_message", messageData);
 });

 socket.on("disconnect", () => {
  console.log("Disconnected");
 });
});

server.listen(3001, () => {
 console.log("Server running on port 3001");
});
