import React, { useEffect, useState } from "react";

function Chatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");
 const [userMessage, setUserMessage] = useState("");
 const [user, setUser] = useState("");
 const [loggedUser, setLoggedUser] = useState("");

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
  }
 };

 useEffect(() => {
  socket.on("message_received", (data) => {
   setUserMessage(data.message);
   setUser(data.username);
  });
  socket.on("logged_users", (data) => {
   setLoggedUser(data.username);
  });
 }, [socket]);

 return (
  <div>
   <div className="p-2 border rounded my-10">
    <div className="p-3">
     <h1>
      Your are connected to the room: <span className="font-bold">{room}</span>
     </h1>
     <p>
      Logged as: <span className="font-bold">{username}</span>
     </p>
    </div>
    <div className="pt-5">
     <div className="w-full lg:w-[400px] p-5">
      <div>
       <div className="w-[200px]">
        <div className="h-8 px-4 border border-gray-300 rounded flex items-center">
         {user + ":"} {userMessage}
        </div>
       </div>
       <div className="flex justify-end">You: {message}</div>
      </div>
      <div className="flex justify-end gap-2 pt-5">
       <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="message..."
        className="outline-none text-xs px-2 h-8 border border-gray-200 rounded"
       />
       <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-2 rounded h-8"
       >
        send
       </button>
      </div>
      <div className="pt-4">
       <div>
        <h1>joined Users: </h1>
        <div>{loggedUser}</div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}

export default Chatbox;
