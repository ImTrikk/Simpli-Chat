import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils/StringAvatar";

export const LoggedUser = ({ socket, room, username }) => {
	const [listUser, setListUser] = useState([username]);

	useEffect(() => {
		const handleUserJoined = (user) => {
			setListUser((users) => [...users, user]);
		};

		const handleUserLeft = (leftUser) => {
			setListUser((users) => users.filter((user) => user !== leftUser));
		};

		const handleCurrentUsers = (users) => {
			setListUser(users);
		};

		socket.emit("all_usernames", room);

		socket.on("user_joined", handleUserJoined);
		socket.on("user_left", handleUserLeft);
		socket.on("all_usernames", handleCurrentUsers);
		// return () => {
		//   socket.off("user_joined", handleUserJoined);
		//   socket.off("user_left", handleUserLeft);
		//   socket.off("current_users", handleCurrentUsers);
		//   socket.off("all_usernames", handleCurrentUsers);
		// };
	}, [socket]);
	return (
		<>
			<div className="">
				<div className="bg-blue-500 flex items-center justify-between rounded-tr h-[50px] w-[250px]">
					<div className="p-3 flex justify-between w-full">
						<div className="flex items-center justify-between gap-2">
							<FaUsers className="text-white text-2xl" />{" "}
							<p className="text-sm text-white">| Users in room</p>
						</div>
						<p className="text-2xl font-bold text-white">{listUser.length}</p>
					</div>
				</div>
				<div className="p-2 space-y-2">
					{listUser.map((user, index) => (
						<div className="flex items-center gap-2" key={index}>
							<Avatar {...stringAvatar(user)} />
							<div className="bg-gray-100 rounded h-8 px-4 flex items-center">
								<div
									className="flex items-center gap-3 justify-between w-full text-gray-500 text-xs"
									key={index}
								>
									<div className="w-[100px]">{user}</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 bg-green-500 rounded-xl"></div>
										<p className="text-xs">active</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
