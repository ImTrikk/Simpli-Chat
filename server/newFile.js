const { io, existingRooms, existingUsers } = require(".");

io.on("connection", (socket) => {
  // !fix bug multiple room
  socket.on("create_room", (data, username) => {
    if (existingRooms.has(data)) {
      console.log("Room already exist");
      socket.emit("create_room", data);
    } else {
      socket.join(data);
      existingRooms.set(data, 1);
      existingUsers.set(username, 1);
      socket.to(data).emit("user_joined", username);
    }
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
    // console.log("message messageData: ", messageData);
    socket.to(messageData.room).emit("message_received", messageData);
  });

  socket.on("user_left", (data) => {
    const { room, username } = data;
    socket.leave(room);
    socket.to(room).emit("user_left", username, room);
    existingUsers.delete(username);
    let userCount = existingUsers.size;
    console.log("User count: ", userCount);
    if (userCount > 0) {
      existingRooms.set(room, userCount - 1); // Decrement user count
    }
    if (userCount === 0) {
      existingRooms.delete(room); // Remove the room from the Map
      console.log("Room after deletion: ", existingRooms);
    }
  });

  // listen when the client disconnects from the socket
  socket.on("disconnect", (room) => {
    console.log("User disconnect from socket");
    // const count = existingUsers.size;
    // if (count === 0) {
    //  existingUsers.clear();
    //  existingRooms.clear();
    //  console.log("Deleted users and room");
    // }
    // // socket.off();
  });

  socket.on("delete_room", (data) => {
    existingRooms.clear(data);
    console.log("Deleted rooms");
  });
});
