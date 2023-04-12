// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";


//? Import Pages
import Home from "./Pages/Home";
import Create from "./Components/Create";
import Join from "./Components/Signin";
import Chat from "./Components/Chat";
// import Home from "./Pages/Home"

function App() {
  return (
    <BrowserRouter > 
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/create" element={<Create />} />
      <Route exact path="/join" element={<Join />} />
      <Route exact path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter >
  );
}

export default App;
