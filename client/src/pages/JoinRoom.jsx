import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Chatbox from "../components/Chatbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import socket from "../../socket/socket";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { BsArrowRight } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import io from "socket.io-client";

const socket = io.connect("https://simpli-chat-server.vercel.app");
// const socket = io.connect("http://localhost:3001");
//const socketHelper = socket;

function JoinRoom() {
 const [userName, setUsername] = useState("");
 const [room, setRoom] = useState("");
 const [chatbox, setChatbox] = useState(false);
 const [error, setError] = useState(false);
 const loadingBar = useRef(null);

 // !
 const joinRoom = async () => {
  if (userName !== "" && room !== "") {
   // Send a request to join the room
   socketHelper.emit("join_room", room, userName, (roomExist, message) => {
    console.log(roomExist);
    console.log(message);
    if (!roomExist) {
     if (message === "User already exists in the room") {
      toast.error(`User already exists in the room`, {
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
     }
    } else {
     if (message === "User already exists in the room") {
      toast.error(`User aleady exist`, {
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
      setChatbox(true);
      toast.success(`Joined room: ${room}`, {
       position: "top-center",
       autoClose: 2000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       progress: undefined,
       theme: "light",
      });
     }
    }
   });
  }
 };

 const navCreate = useNavigate();

 const createRoom = () => {
  loadingBar.current.continuousStart(60);
  setTimeout(() => {
   loadingBar.current.complete();
   setTimeout(() => {
    navCreate("/create-room");
   }, 1200);
  }, 1000);
 };

 const navMenu = useNavigate();

 const mainMenu = () => {
  loadingBar.current.continuousStart(60);
  setTimeout(() => {
   loadingBar.current.complete();
   setTimeout(() => {
    navCreate("/");
   }, 1200);
  }, 1000);
 };

 return (
  <>
   <div>
    <ToastContainer autoClose={1000} />
    <LoadingBar color="#0043DC" ref={loadingBar} />
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
         <div className="flex items-center justify-between">
          <button
           onClick={mainMenu}
           className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-500"
          >
           Main menu
           <BsArrowRight />
          </button>
          <div className="flex gap-2 justify-end">
           <button
            onClick={createRoom}
            className="border border-blue-500 rounded text-blue-500 px-2"
           >
            Create room
           </button>
           <button
            onClick={joinRoom}
            className="bg-blue-500 h-10 px-2 rounded text-white"
           >
            Enter room
           </button>
          </div>
         </div>
        </div>
       </div>
      )}
      <div>
       {chatbox ? (
        <Chatbox socket={socketHelper} username={userName} room={room} />
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
