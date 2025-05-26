import './App.css'
import Profile from './Pages/Profile'
import  Chat  from "./Pages/Chat";
import Login from './Pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App
