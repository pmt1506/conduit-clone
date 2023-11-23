import "./App.css";
import Header from "./layout/Header";
// import Footer from "./layout/Footer";
import Home from './components/home/Home';
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Settings from "./components/profile/Settings";
import Profile from "./components/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/:username" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
