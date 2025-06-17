import './App.css'
import  Chat  from "./Pages/Chat";
import Login from './Pages/Login';
import EditProfile from "./Pages/EditProfile"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App
