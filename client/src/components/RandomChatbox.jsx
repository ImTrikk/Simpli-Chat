import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "../../socket/socket.js";
import { BsPersonCircle } from "react-icons/bs";

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

   console.log("Message to be sent: ", messageData);

   await socket.emit("random_message", messageData);
   setMessageList((list) => [...list, messageData]);
   setMessage("");
  } else {
  }
 };

 useEffect(() => {
  socket.on("random_message", (messageData) => {
   setMessageList((list) => [...list, messageData]);
  });

  return () => {
   socket.off("random_message", handleSendMessage);
  };
 }, [socket]);

 return (
  <div>
   <div className="bg-white rounded w-[500px] h-[500px] relative ">
    <div className="bg-gray-700 p-2 rounded">
     <h1 className="text-white">Chatting as {username}</h1>
    </div>
    <ScrollToBottom className="scroll-bar pt-5">
     {messageList.map((message, index) => (
      <div
       className={` ${
        username === message.username ? "flex justify-end" : "flex"
       }`}
       id={username}
       key={index}
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
            ? "bg-blue-500 text-white px-3 py-2 rounded-t-lg rounded-bl-xl max-w-[300px]"
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
