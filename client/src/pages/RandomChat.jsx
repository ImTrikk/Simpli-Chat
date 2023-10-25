import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import RandomChatbox from "../components/RandomChatbox";
import Chatbox from "../components/Chatbox";
import { BsHandIndex } from "react-icons/bs";
//import socket from "../../socket/socket.js";
import { BsArrowRight } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import io from "socket.io-client";

const socket = io.connect("https://simpli-chat-server.vercel.app");

function RandomChat() {
 const [chatbox, setChatbox] = useState(false);
 const [username, setUsername] = useState("");
 const [showError, setShowError] = useState(false);
 const [error, setError] = useState("");
 const [room, setRoom] = useState("");

 const handleRandomChat = async () => {
  if (username !== "") {
   socket.emit("random_connect", username);
  }
 };

 useEffect(() => {
  socket.on("random_user_joined", (roomName, callback) => {
   if (callback) {
    toast.success("Found a match!", {
     position: "top-center",
     autoClose: 2000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "light",
    });
    setRoom(roomName);
    setChatbox(true);
   }
  });

  return () => {
   socket.off("random_user_joined");
  };
 });

 const navMenu = useNavigate();
 const handleNavMenu = () => {
  setTimeout(() => {
   navMenu("/");
  }, 2000);
 };

 return (
  <>
   <div className="bg-blue-500">
    <ToastContainer autoClose={2000} />
    <div className="mx-20">
     <div className="flex items-center justify-center h-screen">
      <div className="text-center">
       <h1 className="font-black text-white text-5xl">Random Chat</h1>
       <p className="text-lg font-light text-white">
        Enter random chat with a person
       </p>
       {showError ? (
        <div className="text-red-600 text-2xl font-bold">{error}</div>
       ) : (
        ""
       )}
       {chatbox ? (
        <RandomChatbox username={username} room={room} />
       ) : (
        <div>
         <div className="flex gap-2 items-center text-center pt-5">
          <input
           type="text"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           placeholder="username..."
           className="font-medium text-gray-400 h-10 bg-white rounded px-2 text-xs outline-none"
          />
          <button
           onClick={handleRandomChat}
           className="border border-white text-xs text-white rounded h-10 px-2"
          >
           Find Chat
          </button>
         </div>
         <div className="text-center">
          <button
           onClick={handleNavMenu}
           className="text-xs text-center text-white flex items-center gap-1 hover:text-gray-500"
          >
           Main menu
           <BsArrowRight />
          </button>
         </div>
        </div>
       )}
      </div>
     </div>
    </div>
   </div>
  </>
 );
}

export default RandomChat;
