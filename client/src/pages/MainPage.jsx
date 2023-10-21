import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      <div>
        <div className="mx-20">
          <div className="flex h-screen items-center justify-center">
            <div>
              <div className="mb-10 text-center">
                <h1 className="text-6xl text-blue-500 font-black">
                  SimpliChat
                </h1>
                <p className="pt-2 font-light text-gray-500 text-lg">
                  A simple synchronous chat application where you can create, join, and even go random chatting
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Link to="/create-room">
                  <button className="border border-blue-500 text-blue-500 px-4 h-10 rounded font-semibold">
                    Create room
                  </button>
                </Link>
                <Link to="/join-room">
                  <button className="border border-blue-500 px-4 h-10 rounded text-blue-500 font-semibold">
                    Join chat room
                  </button>
                </Link>
              </div>
              {/* put linear gradient background here */}
              <div className="text-center pt-5">
                <Link to="/random-chat">
                  <button className="bg-blue-500 px-4 h-10 rounded text-white font-semibold">
                    -Random Chat-
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
