import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

const MainPage = () => {
 return (
  <>
   <div>
    <Navbar />
    <div className="mx-20">
     <div className="flex h-screen items-center justify-center">
      <div>
       <div className="mb-10 text-center">
        <h1 className="text-6xl text-blue-500 font-black">SimpliChat</h1>
        <p className="pt-2 font-light text-lg">
         A simple synchronous chat application
        </p>
       </div>
       <div className="flex items-center justify-center gap-2">
        <Link to="/create-room">
         <button className="border border-blue-500 text-blue-500 px-4 h-10 rounded font-semibold">
          Create room
         </button>
        </Link>
        <Link to="/join-room">
         <button className="bg-blue-500 px-4 h-10 rounded text-white font-semibold">
          Join chat room
         </button>
        </Link>
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 );
};

export default MainPage;
