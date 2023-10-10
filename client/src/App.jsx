import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";

function App() {
 return (
  <>
   <Router>
    <Routes>
     <Route path="/" element={<MainPage />} />
     <Route path="/join-room" element={<JoinRoom />} />
     <Route path="/create-room" element={<CreateRoom />} />
    </Routes>
   </Router>
  </>
 );
}

export default App;
