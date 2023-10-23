import { useState } from "react";
import { Navbar } from "../components/Navbar";
import RandomChatbox from "../components/RandomChatbox";
import Chatbox from "../components/Chatbox";
import { BsHandIndex } from "react-icons/bs";
import socket from "../../socket/socket.js";

function RandomChat() {
  const [chatbox, setChatbox] = useState(false);
  const [userName, setUserName] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const handleRandomChat = async () => {
    console.log(userName);
    if (userName !== "") {
      setShowError(false);
      socket.emit("join_random", userName);
      socket.on("match_found", () => {});

      setChatbox(true);
      return () => {
        socket.off("join_random");
      };
    } else {
      setError("No users available");
      setShowError(true);
    }
  };

  return (
    <>
      <div className="bg-blue-500">
        <div className="mx-20">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="font-black text-white text-5xl">Random Chat</h1>
              <p className="text-lg font-light text-white">
                Enter random chat with a person
              </p>
              {showError ? (
                <div className="text-red-600 text-2xl font-bold">{error}</div>
              ) : (
                ""
              )}
              {chatbox ? (
                <RandomChatbox />
              ) : (
                <div>
                  <div className="flex gap-2 items-center text-center pt-5">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="username..."
                      className="font-medium text-gray-400 h-10 bg-white rounded px-2 text-xs outline-none"
                    />
                    <button
                      onClick={handleRandomChat}
                      className="border border-white text-xs text-white rounded h-10 px-2"
                    >
                      Find Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RandomChat;
