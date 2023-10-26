import "./App.css";
import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import RandomChat from "./pages/RandomChat";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";

function App() {
 const [progress, setProgress] = useState(0);
 return (
  <>
   <Router>
    <LoadingBar
     color="#0043DC"
     height={4}
     progress={progress}
     onLoaderFinished={() => setProgress(0)}
    />
    <Routes>
     <Route path="/" element={<MainPage />} />
     <Route
      path="/join-room"
      element={<JoinRoom setProgress={setProgress} />}
     />
     <Route
      path="/create-room"
      element={<CreateRoom setProgress={setProgress} />}
     />
     <Route
      path="/random-chat"
      element={<RandomChat setProgress={setProgress} />}
     />
    </Routes>
   </Router>
  </>
 );
}

export default App;
