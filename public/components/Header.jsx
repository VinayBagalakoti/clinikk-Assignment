import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "../styles/header.css"; 

const Header = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  //  Handle Logout Function
  const handleLogout = async () => {
    await signOut(auth);
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  // Handle Navigation for Protected Routes
  const handleProtectedRoute = (path) => {
    if (!user) {
      toast.error("Please log in first!");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Clinikk TV</Link>
      </div>
      <nav>
       
        <button className="nav-btn" onClick={() => handleProtectedRoute("/upload")}>Upload</button>
        <button className="nav-btn" onClick={() => handleProtectedRoute("/profile")}>Profile</button>

        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
