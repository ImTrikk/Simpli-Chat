import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";

export const LoggedUser = ({ socket, room, username }) => {
 const [listUser, setListUser] = useState([]);

 useEffect(() => {
  const handleUserJoined = (user) => {
   setListUser((users) => [...users, user]);
  };

  const handleUserLeft = (leftUser) => {
   setListUser((users) => users.filter((user) => user !== leftUser));
  };

  socket.on("user_joined", handleUserJoined);
  socket.on("user_left", handleUserLeft);

  return () => {
   socket.off("user_joined", handleUserJoined);
   socket.off("user_left", handleUserLeft);
  };
 }, [socket]);
 return (
  <>
   <div className="w-full">
    <div className="bg-blue-500 flex items-center justify-between rounded-tr h-[50px] w-[250px]">
     <div className="p-3 w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
       <FaUsers className="text-white text-2xl" />{" "}
       <span className="text-white">|</span>
      </div>
      <p className="text-2xl font-bold text-white">{listUser.length}</p>
     </div>
    </div>
    <div className="p-2 space-y-2">
     {listUser.map((user, index) => (
      <div className="flex items-center" key={index}>
       <div className="border border-blue-500 rounded w-8 h-8 flex items-center justify-center">
        <BsFillPersonFill className="text-blue-500" />
       </div>
       <div className="bg-gray-100 rounded h-8 px-4 flex items-center">
        <div
         className="flex items-center gap-5 justify-between w-full text-gray-500 text-xs"
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
