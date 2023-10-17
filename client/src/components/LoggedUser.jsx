import { FaUsers } from "react-icons/fa";

export const LoggedUser = () => {
 return (
  <>
   <div className="w-full">
    <div className="bg-blue-500 flex items-center justify-between rounded-tr h-[50px] w-[200px]">
     <div className="p-3 w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
       <FaUsers className="text-white text-2xl" /> <span className="text-white">|</span>
      </div>
      <p className="text-2xl font-bold text-white">20</p>
     </div>
    </div>
    <div className="p-3">
     <div className="bg-gray-100 rounded h-8 px-4 flex items-center justify-between">
      <p>You</p>
      <div className="flex items-center gap-2">
       <div className="h-2 w-2 bg-green-500 rounded-xl"></div>
       <p className="text-xs">active</p>
      </div>
     </div>
    </div>
   </div>
  </>
 );
};
