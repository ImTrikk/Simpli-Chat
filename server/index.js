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
const usersInRoom = new Map();

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
      if (existingRooms.has(room) && !usersInRoom.get(room).includes(user)) {
        socket.join(room);
        socket.to(room).emit("user_joined", user);
        usersInRoom.get(room).push(user);
        // existingRooms.set(room, existingRooms.get(room) + 1);
        callback(true);
      } else {
        console.log("Existing user!!!");
        if (typeof callback === "function") {
          callback(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // modify the code here, it should only return all the usernames if it connects with the existing room
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
      if (messageData.image instanceof Buffer) {
        // Convert the binary image data to a base64 data URL
        const imageBase64 = `data:image/jpeg;base64,${messageData.image.toString(
          "base64",
        )}`;
        messageData.image = imageBase64; // Replace binary data with data URL
      }
      // console.log("message messageData: ", messageData);
      socket.to(messageData.room).emit("create_message", messageData);
    } catch (err) {
      console.log("Image error: ", err);
    }
  });

  socket.on("user_left", (data) => {
    try {
      const { room, username } = data;
      socket.leave(room);
      socket.to(room).emit("user_left", username, room);
      // remove the user from the map
      if (usersInRoom.has(room)) {
        const usersInThisRoom = usersInRoom.get(room);
        for (let i = 0; i < usersInThisRoom.length; i++) {
          if (usersInThisRoom[i] == username) {
            usersInThisRoom.splice(i, 1);
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnect from socket");
    console.log("Existing rooms: ", existingRooms);
    console.log("Existing users: ", usersInRoom);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
