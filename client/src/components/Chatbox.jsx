import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoggedUser } from "./LoggedUser";
import { UserSidebar } from "./UserSidebar";
import { MdAddAPhoto } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

function Chatbox({ socket, username, room }) {
  const [message, setMessage] = useState("");
  const [userMessageList, setUserMessageList] = useState([]);
  const [joinedUserMessages, setJoinedUserMessage] = useState("");
  const [image, setImage] = useState("");
  const [selectedImg, setSelelectedImg] = useState("");

  const sendMessage = async () => {
    try {
      if (message !== "" || image !== "") {
        const messageData = {
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
          message: message,
          username: username,
          room: room,
          image: image,
        };
        await socket.emit("create_message", messageData);
        setUserMessageList((list) => [...list, messageData]);
        setMessage("");
        setImage("");
        setSelelectedImg("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // convert the selected file into a data URL and set
  //it as the value of the image state variable.This allows you to display
  // the selected image in your component, and potentially, to send it to the
  // server or perform other operations with it.

  const handleImageChange = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setSelelectedImg(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result); // Set the image as a data URL
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFile = () => {
    setImage("");
    setSelelectedImg("");
  };

  useEffect(() => {
    try {
      const sendMessage = (data) => {
        setUserMessageList((list) => [...list, data]);
      };
      socket.on("create_message", sendMessage);
      socket.on("user_joined", (user) => {
        setJoinedUserMessage(`---${user} joined the chat---`);
        toast.info(`${user} has joined the chat room`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setJoinedUserMessage("");
        }, 3000);
      });

      return () => {
        socket.off("create_message", sendMessage);
        socket.off("user_joined");
        //  socket.off("user_left");
      };
    } catch (err) {
      console.log(err);
    }
  }, [socket]);
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <div className="lg:flex items-start pt-20">
        <div className="rounded-l h-[500px]">
          <UserSidebar socket={socket} username={username} room={room} />
        </div>
        <div className="bg-gray-100 border-t border-b md:w-[500px] h-[500px] relative">
          <div className="p-4 border-b border-gray-300 h-[50px] flex items-center">
            <div className="p-2 bg-blue-400 rounded flex items-center justify-center">
              <h1 className="text-white text-sm font-medium">
                <span className="font-bold">#{room}</span>
              </h1>
            </div>
            <div className="ml-32 text-xs text-gray-500">
              {joinedUserMessages}
            </div>
          </div>
          <div className="w-full bg-gray-100 p-3 h-auto">
            <ScrollToBottom className="scroll-bar h-[380px]">
              {userMessageList.map((message, index) => (
                <div
                  className={` ${
                    username === message.username ? "flex justify-end" : "flex"
                  }`}
                  id={username}
                  key={`userMessage-${index}`}
                >
                  <div className="p-2">
                    <div className="flex gap-2">
                      <div
                        className={` ${
                          username === message.username ? "hidden" : "mt-auto"
                        }`}
                      >
                        <BsPersonCircle className="text-blue-500" />
                      </div>
                      <div
                        className={`${
                          username === message.username
                            ? "bg-blue-500 text-white px-3 py-2 rounded-t-lg rounded-bl-xl max-w-[300px]"
                            : "bg-gray-200 text-gray-500 px-3 py-2  rounded-t-xl rounded-br-xl max-w-[300px]"
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
                            {username === message.username
                              ? "You"
                              : message.username}
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
                              className="w-[300px] h-[200px] rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className={` ${
                          username === message.username ? "mt-auto" : "hidden"
                        }`}
                      >
                        <BsPersonCircle className="text-blue-500" />
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
                  <button
                    onClick={handleRemoveFile}
                    className="text-xs text-red-400"
                  >
                    <MdCancel size={22} />
                  </button>
                </div>
              )}
            </div>
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
          <LoggedUser socket={socket} room={room} username={username} />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
