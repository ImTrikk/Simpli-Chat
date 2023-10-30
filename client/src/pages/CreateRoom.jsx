import React from "react";
import { Navbar } from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chatbox from "../components/Chatbox";
//mport socket from "../../socket/socket";
import LoadingBar from "react-top-loading-bar";
import { BsArrowRight } from "react-icons/bs";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const socket = io.connect("http://localhost:3001");
const socket = io.connect(
	"https://railway.app/project/0921ef21-dcee-4779-a93d-00bb724c6eeb/service/236ec57f-9a5e-4d23-a9b7-295ac08c5486",
);

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
		} else if (userName === "") {
			toast.error(`Input username`, {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} else if (room === "") {
			toast.error(`Input room name`, {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "light",
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
				<LoadingBar height={7} color="#0043DC" ref={loadingBar} />
				<div className="">
					{chatbox ? (
						""
					) : (
						<div className="flex justify-between">
							<div className="flex items-center justify-center border w-full">
								<div className="pt-14 w-full md:w-[400px] md:h-[400px] h-screen">
									<h1 className="text-blue-500 text-4xl font-black">Create Room</h1>
									<p className="text-lg font-light">
										Create rooms and communicate with people
									</p>
									<div className="pt-5 gap-2 space-y-3">
										<div>
											<label htmlFor="" className="text-xs text-gray-600">
												Username
											</label>
											<input
												type="text"
												placeholder="Your name here"
												onChange={(e) => setUsername(e.target.value)}
												className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
											/>
										</div>
										<div>
											<label htmlFor="" className="text-xs text-gray-600">
												Room Name
											</label>
											<input
												type="text"
												placeholder="Example: Room123, 09288"
												onChange={(e) => setRoom(e.target.value)}
												className=" w-full border border-blue-500 text-xs h-10 px-4 rounded outline-none"
											/>
										</div>
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
							<div className="hidden md:block bg-blue-500 w-full h-screen">
								<div className="flex items-center justify-center h-full">
									<div className="">
										<p className="text-2xl font-bold text-white py-5">
											A simple way to chat with buddies
										</p>
										<img
											src="/images/SimpliChat.png"
											alt=""
											className="w-[500px] h-auto rounded border-spacing-7 border-white"
										/>
									</div>
								</div>
							</div>
						</div>
					)}
					{chatbox ? (
						<div className="md:flex items-center justify-center w-full">
							<Chatbox socket={socketHelper} username={userName} room={room} />
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</>
	);
};

export default CreateRoom;
