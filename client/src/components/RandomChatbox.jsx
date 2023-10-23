import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "../../socket/socket.js";

function RandomChatbox({ username }) {
 const [message, setMessage] = useState("");
 const [messageList, setMessageList] = useState([]);
 const [error, setError] = useState("");
 const [errorShow, setErrorShow] = useState(null);

 const handleSendMessage = async () => {
  if (message !== "") {
   const messageData = {
    message: message,
    username: username,
   };

   await socket.emit("random_message", messageData);
   setUserMessageList((list) => [...list, messageData]);
   setMessage("");
  } else {
  }
 };

 useEffect(() => {
  socket.on("random_message", (message) => {
   setMessageList(message);
  });
 }, [socket]);

 return (
  <div>
   <ScrollToBottom className="scroll-bar pt-5">
    <div className="bg-white rounded w-[500px] h-[500px] relative">
     <div className="flex items-center gap-2 absolute bottom-0 right-0 left-0 p-4 ">
      <input
       type="text"
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
   </ScrollToBottom>
  </div>
 );
}

export default RandomChatbox;
