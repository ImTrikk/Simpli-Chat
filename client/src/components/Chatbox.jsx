import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoggedUser } from "./LoggedUser";
import { UserSidebar } from "./UserSidebar";

function Chatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");
 const [userMessageList, setUserMessageList] = useState([]);
 const [joinedUserMessages, setJoinedUserMessage] = useState("");

 const sendMessage = async () => {
  if (message !== "") {
   const messageData = {
    time:
     new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    message: message,
    username: username,
    room: room,
   };
   await socket.emit("create_message", messageData);
   setUserMessageList((list) => [...list, messageData]);
   setMessage("");
  }
 };

 useEffect(() => {
  const sendMessage = (data) => {
   setUserMessageList((list) => [...list, data]);
  };

  socket.on("message_received", sendMessage);

  socket.on("user_joined", (user) => {
   setJoinedUserMessage(`---${user} joined the chat---`);
   toast.info(`${user} has joined the chat room`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
   });

   setTimeout(() => {
    setJoinedUserMessage("");
   }, 3000);
  });

  return () => {
   socket.off("message_received", sendMessage);
   socket.off("user_joined");
   //  socket.off("user_left");
  };
 }, [socket]);

 return (
  <div>
   <ToastContainer autoClose={2000} />
   <div className="lg:flex items-start pt-10">
    <div className="rounded-l h-[500px]">
     <UserSidebar socket={socket} username={username} room={room} />
    </div>
    <div className="bg-gray-100 border-t border-b md:w-[500px] h-[500px] relative">
     <div className="p-4 border-b border-gray-300 h-[50px] flex items-center">
      <h1 className="text-gray-500 text-sm font-medium">
       <span className="font-bold">#{room}</span>
      </h1>
      <div className="ml-32 text-xs text-gray-500">{joinedUserMessages}</div>
     </div>
     <div className="w-full bg-gray-100 p-3 h-auto">
      <ScrollToBottom className="scroll-bar h-[380px]">
       {userMessageList.map((message, index) => (
        <div
         className={` ${
          username === message.username ? "flex justify-end pr-2" : "flex"
         }`}
         id={username}
         key={`userMessage-${index}`}
        >
         <div className="p-2">
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
          <p className="text-xs text-gray-400" id="time">
           {"sent at " + message.time}
          </p>
         </div>
        </div>
       ))}
      </ScrollToBottom>
      <div className="flex justify-end gap-2 p-3 absolute bottom-0 left-0 right-0">
       <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(event) => {
         event.key === "Enter" && sendMessage();
        }}
        placeholder="message..."
        className="w-full outline-blue-200 text-xs px-2 h-8 border border-gray-300 rounded"
       />
       <div className="flex items-center gap-2">
        <button
         onClick={sendMessage}
         className="bg-blue-500 text-xs text-white px-5 rounded h-8"
        >
         send
        </button>
       </div>
      </div>
     </div>
    </div>
    <div className="border-l border-r border-b rounded-r h-[500px]">
     <LoggedUser socket={socket} room={room} username={username} />
    </div>
   </div>
  </div>
 );
}

export default Chatbox;
