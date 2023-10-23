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

// variables for the random chatting
const availableUsers = [];
const randomRoom = new Set();

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

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  // backend code for the random chattings//

  socket.on("join_random", (roomName) => {
    availableUsers.push(socket);
    console.log("random test");
    socket.join(roomName);
    randomRoom.add(roomName);
  });

  socket.on("random_chat", () => {
    if (availableUsers.length >= 0) {
      const user1 = socket.pop();
      const user2 = socket.pop();

      const randomizedRom = generateUniqueRoomName();

      user1.join(room);
      user2.join(room);
      randomRoom.add(randomizedRom);

      user1.emit("match_found", roomName);
      user2.emit("match_found", roomName);
    }
  });

  socket.on("random_maessage", (room, message) => {
    socket.to(room).emit("random_message", message);
  });

  socket.on("disconnect", () => {
    const index = availableUsers.indexOf(socket);
    if (index !== -1) {
      availableUsers.splice(index, 1);
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
