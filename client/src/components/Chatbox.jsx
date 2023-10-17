import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoggedUser } from "./LoggedUser";
import { UserSidebar } from "./UserSidebar";

function Chatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");
 const [userMessage, setUserMessage] = useState("");
 const [userMessageList, setUserMessageList] = useState([]);
 const [joinedUserMessage, setJoinedUserMessage] = useState("");

 // modify the user messages id to get the different names
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

 const navHome = useNavigate();

 const handleDisconnect = () => {
  toast.info("Disconnected from the room", {
   position: "top-right",
   autoClose: 1000,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "light",
  });
  // socket.emit("disconnect");
  setTimeout(() => {
   navHome("/");
  }, 3000);
 };

 useEffect(() => {
  const sendMessage = (data) => {
   setUserMessageList((list) => [...list, data]);
  };
  socket.on("message_received", sendMessage);
  return () => {
   socket.off("message_received", sendMessage);
  };
 }, [socket]);

 useEffect(() => {
  // Listen for the "user_joined" event
  socket.on("user_joined", (user) => {
   toast.info(`${user.username} joined the chat`, {
    position: "top-right",
    autoClose: 2000, // Adjust the time the toast message is displayed
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
   });
  }, [socket]);

  // Cleanup by removing the event listener when the component unmounts
  return () => {
   socket.off("user_joined");
  };
 }, [socket]);

 return (
  <div>
   <ToastContainer autoClose={2000} />
   <div className="lg:flex items-start pt-10">
    <div className="rounded-l h-[500px]">
     <UserSidebar socket={socket} username={username} />
    </div>
    <div className="bg-gray-100 border-t border-b md:w-[500px] h-[500px] relative">
     <div className="p-4 border-b border-gray-300 h-[50px] flex items-center">
      <h1 className="text-gray-500 text-sm font-medium">
       <span className="font-bold">#{room}</span>
      </h1>
      {/* <p className="text-white text-xs">
       Logged as: <span className="font-bold">{username}</span>
      </p> */}
     </div>
     <div className="w-full bg-gray-100 p-3 h-auto">
      <ScrollToBottom className="scroll-bar h-[380px]">
       <div className="text-center text-gray-400 text-xs">
        ---room created---
       </div>
       <div className="text-center text-gray-400 text-xs">
        {joinedUserMessage}
       </div>
       {userMessageList.map((message) => (
        <div
         className={` ${
          username === message.username ? "flex justify-end pr-2" : "flex"
         }`}
         id={username}
         key={message.time.seconds}
        >
         <div className="p-2 mt-2">
          <div
           className={`${
            username === message.username
             ? "bg-blue-500 text-white p-3 rounded-t-lg rounded-bl-xl max-w-[300px]"
             : "bg-gray-200 text-gray-500 p-3  rounded-t-xl rounded-br-xl max-w-[300px]"
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
     <LoggedUser socket={socket} />
    </div>
   </div>
  </div>
 );
}

export default Chatbox;
