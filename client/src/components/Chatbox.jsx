import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chatbox({ socket, username, room }) {
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [userMessageList, setUserMessageList] = useState([]);
  const [user, setUser] = useState("");
  const [loggedUser, setLoggedUser] = useState("");

  // modify the user messages id to get the different names
  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
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
    return () => {
      socket.off("message_received", sendMessage);
    };
  }, [socket]);

  return (
    <div>
      <div className="border rounded my-10">
        <div className="bg-blue-500 p-4 rounded-t">
          <h1 className="text-white text-xl font-semibold">
            Connected to room: <span className="font-bold">{room}</span>
          </h1>
          <p className="text-white text-xs">
            Logged as: <span className="font-bold">{username}</span>
          </p>
        </div>
        <div className="pt-5">
          <div className="w-full lg:w-[400px] p-3">
            <div className="w-full">
              <ScrollToBottom className=" h-[300px]">
                {userMessageList.map((message) => (
                  <div
                    className={` ${
                      username === message.username
                        ? "flex justify-end pr-2"
                        : "flex"
                    }`}
                    key={message.time}
                  >
                    <div className=" p-2 mt-4">
                      <div className="bg-gray-100 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400" id="username">
                            {username === message.username
                              ? "You"
                              : message.username}
                            :
                          </p>
                        </div>
                        <div className="flex text-sm">
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
            </div>
            <div className="flex justify-end gap-2 pt-5">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
