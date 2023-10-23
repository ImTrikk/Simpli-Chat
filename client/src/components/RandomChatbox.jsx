import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function RandomChatbox() {
  return (
    <div>
      <ScrollToBottom className="scroll-bar">
        <div className="bg-white rounded w-[500px] h-[400px] relative">
          <div className="flex items-center gap-2 absolute bottom-0 right-0 left-0 p-4 ">
            <input
              type="text"
              placeholder="type a message..."
              className="w-full text-gray-500 text-xs h-10 outline-none px-2 border border-blue-500 rounded"
            />
            <button className="bg-blue-500 rounded h-10 px-4 text-sm text-white">send</button>
          </div>
        </div>
      </ScrollToBottom>
    </div>
  );
}

export default RandomChatbox;
