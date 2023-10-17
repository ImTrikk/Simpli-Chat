import { BsFillPersonFill } from "react-icons/bs";

export const UserSidebar = ({ socket, username }) => {
 return (
  <>
   <div className="w-full bg-blue-500 rounded-l h-full relative">
    <div className=" flex items-center justify-between rounded-l w-[150px]">
     <div className="p-3 w-full flex items-center">
      <h1 className="text-2xl font-black text-white">SimpliChat</h1>
     </div>
    </div>
    <div className="pt-5 p-3 text-white text-sm flex items-center gap-2">
     <div className="p-2 bg-white rounded w-10 h-10 flex items-center justify-center">
      <BsFillPersonFill className="text-blue-500 text-xl" />
     </div>
     <div>
      <p className="text-xl font-bold">{username}</p>
      <p className="text-xs">creator</p>
     </div>
    </div>
    <div className="p-3 text-center absolute bottom-0 left-0 right-0">
     <button
      // onClick={handleDisconnect}
      className="bg-red-600 text-white text-xs px-4 w-[100px] h-8 rounded"
     >
      Delete room
     </button>
    </div>
   </div>
  </>
 );
};
