import React from "react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import io from "socket.io-client";
import Chatbox from "../components/Chatbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// const socket = io.connect("https://simpli-chat-server.vercel.app");
const socket = io.connect("http://localhost:3001");

const CreateRoom = () => {
 const [userName, setUsername] = useState("");
 const [room, setRoom] = useState("");
 const [chatbox, renderChatbox] = useState(false);
 const [disconnect, setDisconnect] = useState(false)

 const createRoom = ({ data }) => {
  if (userName !== "" && room !== "") {
   socket.emit("create_room", room, userName);
   toast.success(`Room created: ${room}`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
   });
   renderChatbox(true);
  }
 };

 return (
  <>
   <div>
    <Navbar />
    <ToastContainer autoClose={1000} />
    <div className="mx-10 md:mx-20">
     <div className="flex items-center justify-center">
      {chatbox ? (
       ""
      ) : (
       <div className="pt-14 md:w-[400px] md:h-[400px]">
        <h1 className="text-blue-500 text-4xl font-black">Create Room</h1>
        <p className="text-lg font-light">
         Create rooms and communicate with people
        </p>
        <div className="pt-5 gap-2 space-y-3">
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
         <div className="flex justify-end">
          <button
           onClick={createRoom}
           className=" bg-blue-500 text-sm font-semibold h-10 px-2 rounded text-white"
          >
           Create room
          </button>
         </div>
        </div>
       </div>
      )}
      {chatbox ? (
       <Chatbox socket={socket} username={userName} room={room} />
      ) : (
       ""
      )}
     </div>
    </div>
   </div>
  </>
 );
};

export default CreateRoom;
