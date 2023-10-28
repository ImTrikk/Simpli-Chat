import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { BsPersonCircle, BsXLg } from "react-icons/bs";
import { MdAddAPhoto } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils/StringAvatar";

function RandomChatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");
 const [messageList, setMessageList] = useState([]);
 const [image, setImage] = useState("");
 const [selectedImg, setSelelectedImg] = useState("");

 const handleSendMessage = async (e) => {
  if (message !== "" || image !== "") {
   const messageData = {
    image: image,
    room: room,
    message: message,
    username: username,
    time:
     new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
   };
   await socket.emit("random_message", messageData);
   setMessageList((list) => [...list, messageData]);
   setMessage("");
   setImage("");
   setSelelectedImg("");
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

 const handleImageChange = (e) => {
  e.preventDefault();
  console.log("checker frontend");
  const file = e.target.files[0];
  if (file) {
   if (file.size > 1048576) {
    //bytes = 1mb
    setImage("");
    setSelelectedImg("");
    toast.error("File is too large select another image, 1mb maximum ", {
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
    const reader = new FileReader();
    console.log(reader);
    reader.readAsDataURL(file);
    setSelelectedImg(file.name);
    reader.onload = (e) => {
     setImage(e.target.result); // Set the image as a data URL
    };
   }
  }
 };

 const handleRemoveFile = () => {
  setImage("");
  setSelelectedImg("");
 };

 useEffect(() => {
  const handleReceivedMessage = (messageData) => {
   setMessageList((list) => [...list, messageData]);
  };

  socket.on("random_message", handleReceivedMessage);

  socket.on("random_user_disconnect", (username) => {
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
   setTimeout(() => {
    navigate("/");
   }, 3000);
  });

  return () => {
   socket.off("random_message", handleReceivedMessage);
   socket.off("random_user_disconnect");
  };
 });

 const navigate = useNavigate();

 const handleDisconnect = () => {
  socket.emit("random_user_disconnect", { room, username });
  toast.info(`leaving random chatting`, {
   position: "top-center",
   autoClose: 3000,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "light",
  });

  setTimeout(() => {
   navigate("/");
  }, 3000);
 };

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
       key={index}
       //  key={message.timestamp}
      >
       <div className="p-3">
        <div className="flex gap-2">
         <div
          className={` ${username === message.username ? "hidden" : "mt-auto"}`}
         >
          <div className="text-xs rounded overflow-hidden">
           <Avatar {...stringAvatar(message.username)} />
          </div>
         </div>
         <div
          className={`${
           username === message.username
            ? "text-justify bg-blue-500  text-white px-3 py-2 rounded-t-lg rounded-bl-xl max-w-[300px]"
            : "text-justify bg-gray-200 text-gray-500 px-3 py-2  rounded-t-xl rounded-br-xl max-w-[300px]"
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
          {message.image && (
           <div className="bg-white p-1 rounded">
            <img
             src={message.image}
             alt="Image"
             className="w-[300px] h-auto rounded"
            />
           </div>
          )}
         </div>
         <div
          className={` ${username === message.username ? "mt-auto" : "hidden"}`}
         >
          <div className="text-xs rounded w-[2] overflow-hidden">
           <Avatar {...stringAvatar(message.username)} />
          </div>
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
    <div className="absolute bottom-10 left-0 right-0 p-3">
     {selectedImg && (
      <div className=" border border-blue-300 rounded flex items-center justify-between p-3">
       <div className="text-xs text-blue-500">
        Attached image: {selectedImg}
       </div>
       <button onClick={handleRemoveFile} className="text-xs text-red-400">
        <MdCancel size={22} />
       </button>
      </div>
     )}
    </div>
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
     <div className="flex items-center gap-2">
      <label htmlFor="fileInput" className="cursor-pointer">
       <div className="border border-blue-500 rounded flex items-center justify-center h-8 p-2">
        <MdAddAPhoto size={22} className="text-blue-500" />
        <input
         type="file"
         accept="image/*"
         onChange={handleImageChange}
         id="fileInput"
         style={{ display: "none" }}
        />
       </div>
      </label>
      <button
       onClick={handleSendMessage}
       className="bg-blue-500 text-xs text-white px-5 rounded h-8"
      >
       send
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}

export default RandomChatbox;
