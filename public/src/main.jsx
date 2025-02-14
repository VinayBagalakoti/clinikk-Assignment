// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// // import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// )
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "../context/AuthContext.jsx"; // ✅ Import AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* ✅ Wrap App inside AuthProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
