import React, { useState, useContext } from "react";
import "../styles/login.css";
import API_URL from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.warn("Fill all fields");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const msg = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(msg.error || "Login failed");
        return;
      }
  if (!msg.user) { 
        toast.error("User data missing from response");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(msg.user));

      dispatch({ type: "LOGIN", payload: msg.user });

      toast.success("Login successful!");
      navigate("/");
    } catch (e) {
      console.error("Error:", e);
      toast.error("Invalid credentials or server error");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p onClick={() => navigate("/signup")}>New User</p>
    </div>
  );
};

export default Login;
