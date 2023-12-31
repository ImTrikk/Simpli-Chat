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
const RandomUsers = new Map();

// client establishes a connection
io.on("connection", (socket) => {
	
	// event for creating a room
	socket.on("create_room", (room, username, callback) => {
		try {
			if (existingRooms.has(room)) {
				callback(true);
			} else {
				callback(false);
				if (!usersInRoom.has(username)) {
					socket.join(room);
					existingRooms.set(room, 1);
					usersInRoom.set(room, [username]);
					socket.to(room).emit("user_joined", username);
				}
			}
		} catch (err) {
			console.log(err);
		}
	});

	// event handling for users joining a room
	socket.on("join_room", (room, user, callback) => {
		try {
			if (!existingRooms.has(room)) {
				if (typeof callback === "function") {
					callback(false, "Room does not exist");
				}
			} else {
				if (!usersInRoom.get(room).includes(user)) {
					socket.join(room);
					socket.to(room).emit("user_joined", user);
					usersInRoom.get(room).push(user);
					if (typeof callback === "function") {
						callback(true, "Room join");
					}
				} else {
					if (typeof callback === "function") {
						callback(false, "User already exists in the room");
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	});

	// event for getting all the users in a specific room
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

	// event for handling user leaving the room
	socket.on("user_left", (data) => {
		try {
			const { room, username } = data;
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
	
	// event for creating and forwarding message data to clients
	socket.on("create_message", (messageData) => {
		try {
			socket.to(messageData.room).emit("create_message", messageData);
		} catch (err) {
			console.error(err);
		}
	});


	//start the random chat here

	
	// function for creating a random room
	function generateUniqueRoomName() {
		return Math.random().toString(36).substring(2, 10);
	}


	// event for connecting random chatting users
	socket.on("random_connect", (username) => {
		RandomUsers.set(socket.id, 1);

		if (RandomUsers.size === 2) {
			// Two users are available, create a chat room name
			const roomName = generateUniqueRoomName();

			// Get the keys (socket IDs) from the map
			const socketIds = [...RandomUsers.keys()];

			//  Get the socket instances using the socket IDs
			const userSocket1 = io.sockets.sockets.get(socketIds[0]);
			const userSocket2 = io.sockets.sockets.get(socketIds[1]);

			userSocket1.join(roomName);
			userSocket2.join(roomName);

			userSocket1
				.to(roomName)
				.emit("random_user_joined", roomName, username, (callback) => {
					if (typeof callback == "function") {
						callback(true);
					}
				});
			
			userSocket2
				.to(roomName)
				.emit("random_user_joined", roomName, username, (callback) => {
					if (typeof callback == "function") {
						callback(true);
					}
				});
			
			// Reset the RandomUsers array for other users to be paired
			RandomUsers.clear();
		}
	});

	//removes the socket.id from randomUsers if the person decides to cancel
	socket.on("handle-cancel-search", () => {
		RandomUsers.clear(socket.id);
	});

	// event for creating and recieving a message for the random chatting option
	socket.on("random_message", (messageData) => {
		socket.to(messageData.room).emit("random_message", messageData);
	});

	// socket disconnection of random user
	socket.on("random_user_disconnect", (data) => {
		socket.to(data.room).emit("random_user_disconnect", data.username);
	});

	socket.on("disconnect", () => {});
});

server.listen(3001, () => {
	console.log("Server running on port 3001");
});
