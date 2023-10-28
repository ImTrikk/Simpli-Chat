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
import BounceLoader from "react-spinners/BounceLoader";

import io from "socket.io-client";

// const socket = io.connect("https://simpli-chat-server.vercel.app");
const socket = io.connect("http://localhost:3001");

function RandomChat() {
 const [chatbox, setChatbox] = useState(false);
 const [username, setUsername] = useState("");
 const [showError, setShowError] = useState(false);
 const [error, setError] = useState("");
 const [room, setRoom] = useState("");
 const [loading, isLoading] = useState(false);

 const handleRandomChat = async () => {
  if (username !== "") {
   isLoading(true);
   socket.emit("random_connect", username);
  } else {
   toast.error("Enter your username first", {
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
 };

 useEffect(() => {
  socket.on("random_user_joined", (roomName, callback) => {
   if (callback) {
    isLoading(false);
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

 const handleCancelSearch = () => {
  isLoading(false);
  socket.emit("handle-cancel-search");
 };

 return (
  <>
   <div className="bg-blue-500">
    <ToastContainer autoClose={2000} />
    <div className="mx-5 lg:mx-20">
     <div className="flex items-center justify-center h-screen">
      <div className="text-center">
       {chatbox ? (
        ""
       ) : (
        <div>
         <h1 className="font-black text-white text-5xl">Random Chat</h1>
         <p className="text-lg font-light text-white">
          Connect and chat with random people
         </p>
        </div>
       )}
       {showError ? (
        <div className="text-red-600 text-2xl font-bold">{error}</div>
       ) : (
        ""
       )}
       {loading ? (
        <div className="[pt-10">
         <div className="flex items-center justify-center text-center pt-14">
          <BounceLoader
           color="#ffff"
           loading={loading}
           size={170}
           aria-label="Loading Spinner"
           data-testid="loader"
          />
         </div>
         <div className="text-center text-white pt-10">
          <h1>Looking for random user, please wait...</h1>
         </div>
         <div className="pt-5">
          <button
           onClick={handleCancelSearch}
           className="bg-red-500 px-2 rounded h-10 text-white text-sm"
          >
           cancel search
          </button>
         </div>
        </div>
       ) : (
        <div>
         {chatbox ? (
          <RandomChatbox socket={socket} username={username} room={room} />
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
           <div className="text-center pt-2">
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
       )}
      </div>
     </div>
    </div>
   </div>
  </>
 );
}

export default RandomChat;
