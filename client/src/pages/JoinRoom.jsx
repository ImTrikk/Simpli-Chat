import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import io from "socket.io-client";
import Chatbox from "../components/Chatbox";

const socket = io.connect("simpli-chat-server.vercel.app");

function JoinRoom() {
 const [userName, setUsername] = useState("");
 const [room, setRoom] = useState("");
 const [chatbox, renderChatbox] = useState(false);

 const joinRoom = ({ data }) => {
  if (userName !== "" && room !== "") {
   socket.emit("join_room", room);
   renderChatbox(true);
  }
 };

 return (
  <>
   <div>
    <Navbar />
    <div className="mx-20">
     <div className="flex items-center justify-center">
      <div className="pt-20">
       <h1 className="text-blue-500 text-4xl font-black">Join Chat Room</h1>
       <p
        className="text-lg font-light
      "
       >
        Join rooms and communicate with people in real time.
       </p>
       <div className="pt-10 flex gap-2">
        <input
         type="text"
         placeholder="Username: "
         onChange={(e) => setUsername(e.target.value)}
         className="border border-blue-500 text-xs h-10 px-4 rounded outline-none"
        />
        <input
         type="text"
         placeholder="Enter room ID: "
         onChange={(e) => setRoom(e.target.value)}
         className="border border-blue-500 text-xs h-10 px-4 rounded outline-none"
        />
        <button
         onClick={joinRoom}
         className="
             bg-blue-500 h-10 px-2 rounded text-white"
        >
         Enter room
        </button>
       </div>
      </div>
      <div>
       <div className="ml-20">
        {chatbox ? (
         <Chatbox socket={socket} username={userName} room={room} />
        ) : (
         ""
        )}
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 );
}

export default JoinRoom;
