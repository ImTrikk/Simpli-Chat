import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import io from "socket.io-client";
import Chatbox from "../components/Chatbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../socket/socket";

// const socket = io.connect("https://simpli-chat-server.vercel.app/");
// const socket = io.connect("http://localhost:3001");
const socketHelper = socket;

function JoinRoom() {
 const [userName, setUsername] = useState("");
 const [room, setRoom] = useState("");
 const [chatbox, setChatbox] = useState(false);
 const [error, setError] = useState(false);

 const joinRoom = async () => {
  if (userName !== "" && room !== "") {
   // Send a request to join the room
   socketHelper.emit("join_room", room, userName, (roomExist) => {
    if (!roomExist) {
     setError("Room does not exist!");
     toast.error(`Room: ${room} does not exist`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     });
    } else {
     setError(null);
     socketHelper.emit("all_usernames");
     toast.success(`Joined the room: ${room}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     });
     setChatbox(true);
    }
   });
  }
 };
 return (
  <>
   <div>
    <Navbar />
    <ToastContainer autoClose={1000} />
    <div className="mx-10 md:mx-20">
     <div className="md:flex items-center justify-center">
      {chatbox ? (
       ""
      ) : (
       <div className="pt-20">
        <h1 className="text-blue-500 text-4xl font-black">Join chat room</h1>
        <p className="text-lg font-light">
         Join rooms and chit chat with different people in real time.
        </p>
        <div className="pt-5 gap-2 space-y-3 md:w-[400px]">
         <input
          type="text"
          placeholder="Username: "
          onChange={(e) => setUsername(e.target.value)}
          className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
         />
         <input
          type="text"
          placeholder="Enter room ID: "
          onChange={(e) => setRoom(e.target.value)}
          className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
         />
         <div className="flex justify-end">
          <button
           onClick={joinRoom}
           className="bg-blue-500 h-10 px-2 rounded text-white"
          >
           Enter room
          </button>
         </div>
        </div>
       </div>
      )}
      <div>
       {chatbox ? (
        <Chatbox socket={socket} username={userName} room={room} />
       ) : (
        ""
       )}
      </div>
     </div>
     <div className="flex justify-center pt-10">
      {error && (
       <div className="text-red-500">
        <p>{error}</p>
       </div>
      )}
     </div>
    </div>
   </div>
  </>
 );
}

export default JoinRoom;
