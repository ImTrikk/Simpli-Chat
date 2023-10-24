import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "../../socket/socket.js";
import { BsPersonCircle } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function RandomChatbox({ username, room }) {
 const [message, setMessage] = useState("");
 const [messageList, setMessageList] = useState([]);
 const [error, setError] = useState("");
 const [errorShow, setErrorShow] = useState(null);

 const handleSendMessage = async () => {
  if (message !== "") {
   const messageData = {
    room: room,
    message: message,
    username: username,
    time:
     new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
   };
   await socket.emit("random_message", messageData);
   setMessageList((list) => [...list, messageData]);
   setMessage("");
  } else {
   toast.error("Message field empty, enter a message", {
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
  const handleReceivedMessage = (messageData) => {
   setMessageList((list) => [...list, messageData]);
  };

  socket.on("random_message", handleReceivedMessage);

  return () => {
   socket.off("random_message", handleReceivedMessage);
  };
 }, []);

 const navigate = useNavigate();

 const handleDisconnect = () => {
  console.log("room: ", room);
  socket.emit("random_user_disconnect", { room, username });
  setTimeout(() => {
   navigate("/");
  }, 3000);
 };

 socket.on(
  "random_user_disconnect",
  (username) => {
   toast.info(`${username} has left, ending room in 3 seconds`, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
   });

   return () => {
    socket.off("random_user_disconnect", username);
   };
  },
  [socket],
 );

 return (
  <div>
   <ToastContainer autoClose={2000} />
   <div className="bg-white rounded w-[500px] h-[550px] relative ">
    <div
     className="bg-gray-700 p-4 rounded flex items-center justify-between
    "
    >
     <h1 className="text-white">Chatting as {username}</h1>
     <button
      onClick={handleDisconnect}
      className="bg-red-500 text-white rounded px-2 h-10"
     >
      Disconnect
     </button>
    </div>
    <ScrollToBottom className="scroll-bar pt-5 h-[420px]">
     {messageList.map((message, index) => (
      <div
       className={` ${
        username === message.username ? "flex justify-end" : "flex"
       }`}
       id={username}
       key={message.timestamp}
      >
       <div className="p-2">
        <div className="flex gap-2">
         <div
          className={` ${username === message.username ? "hidden" : "mt-auto"}`}
         >
          <BsPersonCircle className="text-blue-500" />
         </div>
         <div
          className={`${
           username === message.username
            ? "bg-blue-500  text-white px-3 py-2 rounded-t-lg rounded-bl-xl max-w-[300px]"
            : "bg-gray-200 text-gray-500 px-3 py-2  rounded-t-xl rounded-br-xl max-w-[300px]"
          }`}
         >
          <div className="flex items-center gap-2">
           <p
            className={`${
             username === message.username
              ? " text-white rounded text-xs"
              : " text-gray-500 rounded text-xs font-light"
            }`}
           >
            {username === message.username ? "You" : message.username}
           </p>
          </div>
          <div className="flex text-sm" id="time">
           <p>{message.message}</p>
          </div>
         </div>
         <div
          className={` ${username === message.username ? "mt-auto" : "hidden"}`}
         >
          <BsPersonCircle className="text-blue-500" />
         </div>
        </div>
        <div className="flex justify-end pr-1 pt-1">
         <p className="text-xs text-gray-400" id="time">
          {"sent at " + message.time}
         </p>
        </div>
       </div>
      </div>
     ))}
    </ScrollToBottom>
    <div className="flex items-center gap-2 absolute bottom-0 right-0 left-0 p-4 ">
     <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(event) => {
       event.key === "Enter" && handleSendMessage();
      }}
      placeholder="type a message..."
      className="w-full text-gray-500 text-xs h-10 outline-none px-2 border border-blue-500 rounded"
     />
     <button
      onClick={handleSendMessage}
      className="bg-blue-500 rounded h-10 px-4 text-sm text-white"
     >
      send
     </button>
    </div>
   </div>
  </div>
 );
}

export default RandomChatbox;
