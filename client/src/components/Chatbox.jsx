import React, { useEffect, useState } from "react";

function Chatbox({ socket, username, room }) {
 const [message, setMessage] = useState("");

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
   console.log(data);
  });
 }, [socket]);

 return (
  <div>
   <div className="p-2 border my-10">
    <div className="my-5 border px-2">
     <h1>
      Your are connected to the room: <span className="font-bold">{room}</span>
     </h1>
     <p>
      Logged as: <span className="font-bold">{username}</span>
     </p>
    </div>
    <div>
     <input
      type="text"
      onChange={(e) => setMessage(e.target.value)}
      placeholder="message..."
     />
     <button onClick={sendMessage}>send</button>
    </div>
   </div>
  </div>
 );
}

export default Chatbox;
