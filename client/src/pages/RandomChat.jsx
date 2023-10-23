import { useState } from "react";
import { Navbar } from "../components/Navbar";
import RandomChatbox from "../components/RandomChatbox";
import Chatbox from "../components/Chatbox";
import { BsHandIndex } from "react-icons/bs";
import socket from "../../socket/socket";

function RandomChat() {
  const [chatbox, setChatbox] = useState(false);

  const handleRandomChat = async () => {
    socket.on("join_random");

    return () => {
      socket.off("join_random");
    };
  };

  return (
    <>
      <div className="bg-blue-500">
        <div className="mx-20">
          <div className="flex items-center justify-center h-screen">
            <div className="">
              <h1 className="font-black text-white text-2xl">
                Random Chat from the Socket
              </h1>
              <div className="flex">
                <input
                  type="text"
                  placeholder="username..."
                  className="font-medium text-gray-400 h-10 bg-white rounded px-2 text-xs"
                />
                <button
                  onClick={handleRandomChat}
                  className="border border-white text-xs text-white rounded px-2"
                >
                  Find Chat
                </button>
              </div>
              {chatbox ? <RandomChatbox /> : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RandomChat;
