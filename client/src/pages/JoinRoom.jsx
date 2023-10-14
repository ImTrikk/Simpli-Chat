import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import io from "socket.io-client";
import Chatbox from "../components/Chatbox";

const socket = io.connect("http://localhost:3001");

function JoinRoom() {
  const [userName, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatbox, setChatbox] = useState(false);
  const [error, setError] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      // Send a request to join the room
      socket.emit("join_room", room, (roomExist) => {
        if (!roomExist) {
          setError("Room does not exist!");
        } else {
          setError(null);
          setChatbox(true);
        }
      });
    }
  };
  return (
    <>
      <div>
        <Navbar />
        <div className="mx-20">
          <div className="md:flex items-center justify-center">
            {chatbox ? (
              ""
            ) : (
              <div className="pt-20">
                <h1 className="text-blue-500 text-4xl font-black">
                  Join chat room
                </h1>
                <p className="text-lg font-light">
                  Join rooms and chit chat with different people in real time.
                </p>
                <div className="pt-5 gap-2 space-y-3 md:w-[400px]">
                  <input
                    type="text"
                    placeholder="Username: "
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
                  />
                  <input
                    type="text"
                    placeholder="Enter room ID: "
                    onChange={(e) => setRoom(e.target.value)}
                    className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={joinRoom}
                      className="bg-blue-500 h-10 px-2 rounded text-white"
                    >
                      Enter room
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="md:ml-20 pt-10">
              {error && (
                <div className="text-red-500">
                  <p>{error}</p>
                </div>
              )}
              {chatbox ? (
                <Chatbox
                  socket={socket}
                  username={userName}
                  room={room}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinRoom;
