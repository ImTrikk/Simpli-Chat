import React, { useEffect, useState } from "react";

function Chatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");
 const [userMessage, setUserMessage] = useState("");
 const [user, setUser] = useState("")

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
   setUser(data.username)
   console.log(data);
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
      <div>{username}: {userMessage}</div>
      
      <input
       type="text"
       onChange={(e) => setMessage(e.target.value)}
       placeholder="message..."
       className="outline-none text-xs px-2 h-8"
      />
      <button onClick={sendMessage}>send</button>
     </div>
    </div>
   </div>
  </div>
 );
}

export default Chatbox;
