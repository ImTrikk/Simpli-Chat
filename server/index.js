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
  });

  // check if room exist
  // ? when user joins, add their id and username also to pass it back to the  front end
  socket.on("join_room", (room, callback) => {
    if (existingRooms.has(room)) {
      socket.join(room);
      callback(true);
      // add loggd user for rendering in the front end
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

  // create message listener
  // ? when user joins, add their id and username also to pass it back to the  front end
  socket.on("create_message", (data) => {
    console.log("message data: ", data);
    socket.to(data.room).emit("message_received", data);
  });

  // listen when the client disconnects from the socket
  socket.on("disconnect", (data) => {
    console.log("User disconnect");
    socket.rooms.forEach((room) => {
      socket.to(room).emit("user_disconnected", socket.id);
      // If you want to remove the user from the room, you can use socket.leave(room) here
    });
    // Remove the user from the set of existing rooms
    existingRooms.delete(socket.id);
    console.log("User dsconnected for good??");
  });
});

// create socket for random chatting
// 2 users can wait and then connect directly

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
