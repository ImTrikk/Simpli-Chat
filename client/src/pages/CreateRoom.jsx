import React from "react";
import { Navbar } from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
import Chatbox from "../components/Chatbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
i//mport socket from "../../socket/socket";
import LoadingBar from "react-top-loading-bar";
import { BsArrowRight } from "react-icons/bs";

// const socket = io.connect("http://localhost:3001");
const socket = io.connect("https://simpli-chat-server.vercel.app/");

const CreateRoom = () => {
  const [userName, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatbox, renderChatbox] = useState(false);
  const loadingBar = useRef(null);

  const socketHelper = socket;

  const createRoom = async ({ data }) => {
    if (userName !== "" && room !== "") {
      socketHelper.emit("create_room", room, userName, (callback) => {
        if (!callback) {
          toast.success(`Room created: ${room}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          renderChatbox(true);
        } else {
          toast.error(`Room already exist`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          renderChatbox(false);
        }
      });
    }
    return () => {
      socketHelper.off("create_room");
    };
  };

  const navJoin = useNavigate();

  const joinRoom = () => {
    loadingBar.current.continuousStart(60);
    setTimeout(() => {
      loadingBar.current.complete();
      setTimeout(() => {
        navJoin("/join-room");
      }, 1200);
    }, 1000);
  };
  const navJMenu = useNavigate();

  const mainMenu = () => {
    loadingBar.current.continuousStart(60);
    setTimeout(() => {
      loadingBar.current.complete();
      setTimeout(() => {
        navJoin("/");
      }, 1200);
    }, 1000);
  };

  return (
    <>
      <div>
        <ToastContainer autoClose={1000} />
        <LoadingBar color="#0043DC" ref={loadingBar} />
        <div className={`${chatbox ? `flex items-center justify-center` : ""}`}>
          <div className="">
            {chatbox ? (
              ""
            ) : (
              <div className="flex justify-between">
                <div className="flex items-center justify-center border w-full">
                  <div className="pt-14 md:w-[400px] md:h-[400px] h-screen">
                    <h1 className="text-blue-500 text-4xl font-black">
                      Create Room
                    </h1>
                    <p className="text-lg font-light">
                      Create rooms and communicate with people
                    </p>
                    <div className="pt-5 gap-2 space-y-3">
                      <input
                        type="text"
                        placeholder="Username: "
                        onChange={(e) => setUsername(e.target.value)}
                        className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Enter room ID: "
                        onChange={(e) => setRoom(e.target.value)}
                        className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
                      />
                      <div className="flex justify-between items-center">
                        <button
                          onClick={mainMenu}
                          className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-500"
                        >
                          Main menu
                          <BsArrowRight />
                        </button>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={joinRoom}
                            className="border border-blue-500 rounded px-2 text-blue-500"
                          >
                            Join room
                          </button>
                          <button
                            onClick={createRoom}
                            className=" bg-blue-500 text-sm font-semibold h-10 px-2 rounded text-white"
                          >
                            Create room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500 w-full h-screen">
                  <div className="flex items-center justify-center h-full">
                    <div className="">
                      <p className="text-2xl font-bold text-white py-5">
                        A simple way to chat with buddies
                      </p>
                      <img
                        src="/public/images/simplichat.png"
                        alt=""
                        className="w-[500px] h-auto rounded border-spacing-7 border-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {chatbox ? (
              <Chatbox socket={socketHelper} username={userName} room={room} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
