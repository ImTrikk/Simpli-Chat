import { useState, useRef } from "react";
import Chatbox from "../components/Chatbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { BsArrowRight } from "react-icons/bs";
import { io } from "socket.io-client";
import { buildUrl } from "../../utils/buildUrl";

// const socket = io.connect(
// 	"https://railway.app/project/0921ef21-dcee-4779-a93d-00bb724c6eeb/service/236ec57f-9a5e-4d23-a9b7-295ac08c5486",
// );
// const socket = io.connect("http://localhost:3001");

const socket = async () => {
	await fetch(
		buildUrl(
			"https://railway.app/project/0921ef21-dcee-4779-a93d-00bb724c6eeb/service/236ec57f-9a5e-4d23-a9b7-295ac08c5486",
		),
	);
};
function JoinRoom() {
	const [userName, setUsername] = useState("");
	const [room, setRoom] = useState("");
	const [chatbox, setChatbox] = useState(false);
	const [error, setError] = useState(false);
	const loadingBar = useRef(null);

	// !
	const joinRoom = async () => {
		if (userName !== "" && room !== "") {
			// Send a request to join the room
			socket.emit("join_room", room, userName, (roomExist, message) => {
				console.log(roomExist);
				console.log(message);
				if (!roomExist) {
					if (message === "User already exists in the room") {
						toast.error(`User already exists in the room`, {
							position: "top-center",
							autoClose: 2000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
						});
					} else {
						toast.error(`Room: ${room} does not exist`, {
							position: "top-center",
							autoClose: 2000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
						});
					}
				} else {
					if (message === "User already exists in the room") {
						toast.error(`User aleady exist`, {
							position: "top-center",
							autoClose: 2000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
						});
					} else {
						setChatbox(true);
						toast.success(`Joined room: ${room}`, {
							position: "top-center",
							autoClose: 2000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
						});
					}
				}
			});
		} else if (userName === "") {
			toast.error("Enter your username", {
				position: "top-center",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} else if (room === "") {
			toast.error("Enter valid room name", {
				position: "top-center",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		}
	};

	const navCreate = useNavigate();

	const createRoom = () => {
		loadingBar.current.continuousStart(60);
		setTimeout(() => {
			loadingBar.current.complete();
			setTimeout(() => {
				navCreate("/create-room");
			}, 1200);
		}, 1000);
	};

	const mainMenu = () => {
		loadingBar.current.continuousStart(60);
		setTimeout(() => {
			loadingBar.current.complete();
			setTimeout(() => {
				navCreate("/");
			}, 1200);
		}, 1000);
	};

	return (
		<>
			<div>
				<ToastContainer autoClose={1000} />
				<LoadingBar height={7} color="#0043DC" ref={loadingBar} />
				<div className="">
					<div className="">
						{chatbox ? (
							""
						) : (
							<div className="md:flex items-center justify-between">
								<div className="p-20">
									<h1 className="text-blue-500 text-4xl font-black">Join chat room</h1>
									<p className="text-lg font-light">
										Join rooms and chit chat with different people in real time.
									</p>
									<div className="pt-5 gap-2 space-y-3 md:w-[400px]">
										<div>
											<label htmlFor="" className="text-xs text-gray-600">
												Username
											</label>
											<input
												type="text"
												placeholder="Your name here"
												onChange={(e) => setUsername(e.target.value)}
												className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
											/>
										</div>
										<div>
											<label htmlFor="" className="text-xs text-gray-600">
												Room Name
											</label>
											<input
												type="text"
												placeholder="Enter an existing room name"
												onChange={(e) => setRoom(e.target.value)}
												className="border border-blue-500 text-xs h-10 px-4 rounded outline-none w-full"
											/>
										</div>
										<div className="flex items-center justify-between">
											<button
												onClick={mainMenu}
												className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-500"
											>
												Main menu
												<BsArrowRight />
											</button>
											<div className="flex gap-2 justify-end">
												<button
													onClick={createRoom}
													className="border border-blue-500 rounded text-blue-500 px-2"
												>
													Create room
												</button>
												<button
													onClick={joinRoom}
													className="bg-blue-500 h-10 px-2 rounded text-white"
												>
													Enter room
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className="hidden md:block bg-blue-500 h-screen w-full"></div>
							</div>
						)}
						<div className="md:flex items-center justify-center">
							{chatbox ? (
								<Chatbox socket={socket} username={userName} room={room} />
							) : (
								""
							)}
						</div>
					</div>
					<div className="flex justify-center">
						{error && (
							<div className="text-red-500">
								<p>{error}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default JoinRoom;
