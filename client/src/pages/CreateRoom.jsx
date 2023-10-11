import React from "react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import io from "socket.io-client";
import Chatbox from "../components/Chatbox";

// const socket = io.connect("https://simpli-chat-server.vercel.app");
const socket = io.connect("http://localhost:3001");

const CreateRoom = () => {
 const [userName, setUsername] = useState("");
 const [room, setRoom] = useState("");
 const [chatbox, renderChatbox] = useState(false);

 const createRoom = ({ data }) => {
  if (userName !== "" && room !== "") {
   socket.emit("create_room", room);
   renderChatbox(true);
  }
 };

 return (
  <>
   <div>
    <Navbar />
    <div className="mx-5 md:mx-10 lg:mx-20">
     <div className="md:flex items-center">
      <div className="pt-14">
       <h1 className="text-blue-500 text-4xl font-black">Create Room</h1>
       <p
        className="text-lg font-light
        "
       >
        Create rooms and communicate with people
       </p>
       <div className="pt-5 gap-2 space-y-3 lg:w-[400px]">
        <input
         type="text"
         placeholder="Username: "
         onChange={(e) => setUsername(e.target.value)}
         className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
        />
        <input
         type="text"
         placeholder="Enter room ID: "
         onChange={(e) => setRoom(e.target.value)}
         className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
        />
        <button
         onClick={createRoom}
         className=" w-full bg-blue-500 text-sm font-semibold h-10 px-2 rounded text-white"
        >
         Create
        </button>
       </div>
      </div>
      <div>
       <div className="lg:ml-20">
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
};

export default CreateRoom;
