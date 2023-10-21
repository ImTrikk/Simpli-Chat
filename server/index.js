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
        // Determine the MIME type of the image
        const imageMime = "image/jpeg"; // Replace with your default MIME type
        if (messageData.imageType === "png") {
          imageMime = "image/png";
        }

        // Convert the binary image data to a base64 data URL
        const imageBase64 = `data:${imageMime};base64,${messageData.image.toString(
          "base64",
        )}`;
        messageData.image = imageBase64; // Replace binary data with data URL
      }
      // Emit the message data to the room
      socket.to(messageData.room).emit("create_message", messageData);
    } catch (err) {
      console.error("Image error:", err);
      // Handle the error (e.g., send an error message to the sender)
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
    console.log("Disconnected")
  });

  // // Listener for when the user refreshes the page and leaves the chatbox
  // socket.on("user_leaving", (data) => {
  //   const { room, username } = data;
  //   if (usersInRoom.has(room)) {
  //     const usernamesInRoom = usersInRoom.get(room);
  //     if (usernamesInRoom.includes(username)) {
  //       console.log("Data being sent: ", data);
  //       socket.to(room).emit("user_left", username);
  //     }
  //   }
  // });

  // socket.on("disconnect", () => {
  //   // Iterate through the rooms to check if the disconnected user was in any room
  //   usersInRoom.forEach((username, room) => {
  //     const data = { username, room };
  //     console.log("The username disconnected: ", username);
  //     if (username.includes(socket.username)) {
  //       const username = socket.username; // Use the correct identifier for the username
  //       socket.to(room).emit("user_left", data);

  //       console.log("User disconnected from socket: ", socket.username);

  //       // Remove the user from the room
  //       const userIndex = username.indexOf(socket.username);
  //       if (userIndex !== -1) {
  //         username.splice(userIndex, 1);
  //       }
  //     }
  //   });
  //   // ...
  // });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
