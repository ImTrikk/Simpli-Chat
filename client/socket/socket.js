// socket.js
import io from "socket.io-client";

const socket = io.connect("https://simpli-chat-server.vercel.app/");

export default socket;
