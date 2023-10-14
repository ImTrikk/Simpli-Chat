import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import RandomChat from "./pages/RandomChat";

function App() {
 return (
  <>
   <Router>
    <Routes>
     <Route path="/" element={<MainPage />} />
     <Route path="/join-room" element={<JoinRoom />} />
     <Route path="/create-room" element={<CreateRoom />} />
     <Route path="/random-chat" element={<RandomChat />} />
    </Routes>
   </Router>
  </>
 );
}

export default App;
