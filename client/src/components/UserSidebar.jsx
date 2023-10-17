import { BsFillPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserSidebar = ({ socket, username }) => {
 const navHome = useNavigate();

 const handleDisconnect = () => {
  toast.info(`Leaving room`, {
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
   navHome("/");
  }, 3000);
 };

 return (
  <>
   <ToastContainer />
   <div className="w-full bg-blue-500 rounded-l h-full relative">
    <div className=" flex items-center justify-between rounded-l w-[150px]">
     <div className="p-3 w-full flex items-center">
      <h1 className="text-2xl font-black text-white">SimpliChat</h1>
     </div>
    </div>
    <div className="pt-5 p-3 text-white text-sm flex items-center gap-2">
     <div className="p-2 bg-white rounded w-9 h-9 flex items-center justify-center">
      <BsFillPersonFill className="text-blue-500 text-xl" />
     </div>
     <div>
      <p className="text-xl font-bold">{username}</p>
      <p className="text-xs">username</p>
     </div>
    </div>
    <div className="p-3 text-center absolute bottom-0 left-0 right-0">
     <button
      onClick={handleDisconnect}
      className="bg-blue-600 text-white text-xs px-4 w-[100px] h-8 rounded"
     >
      Disconnect
     </button>
    </div>
   </div>
  </>
 );
};
