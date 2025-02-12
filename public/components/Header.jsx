import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/header.css"; 

const Header = ({ user }) => {
 

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Clinikk TV</Link>
      </div>
      <nav>
       
          <>
            <Link to="/upload">Upload</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/signUp">login</Link>
            
          </>
      
      
      </nav>
    </header>
  );
};

export default Header;
