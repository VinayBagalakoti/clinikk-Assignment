import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../components/Home";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import Upload from "../components/Upload.jsx";
function App() {
  const { user, loading } = useContext(AuthContext); // ✅ Get loading state

  if (loading) return <p>Loading...</p>; // ✅ Wait before rendering routes

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protect Routes but wait for Firebase */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer closeOnClick={true} />
    </>
  );
}

export default App;
