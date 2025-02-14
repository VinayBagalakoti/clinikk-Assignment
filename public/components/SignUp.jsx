import { useState } from "react";
import "../styles/signUp.css";
import { toast } from "react-toastify";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerButtonDisable, setRegisterButtonDisable] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handles form submission for user signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedUserName = userName.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedUserName) {
      toast.warn("Fill all fields");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      toast.warn("Enter a valid email address");
      return;
    }
    const data = {
      email: trimmedEmail,
      username: trimmedUserName,
      password: trimmedPassword,
    };

    try {
      setRegisterButtonDisable(true);
      // Send signup request to backend
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.error || "Signup failed");
        setRegisterButtonDisable(false);
        return;
      }

      toast.success("Signup successful!");
      setUserName("");
      setEmail("");
      setPassword("");
      setRegisterButtonDisable(false);
      navigate("/login");
    } catch (e) {
      console.log("Error ->", e);
      toast.error("Something went wrong. Try again!");
      setRegisterButtonDisable(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
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
        <button type="submit" disabled={registerButtonDisable}>
          {registerButtonDisable ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p onClick={() => navigate("/login")}>Account already exists</p>
    </div>
  );
};

export default SignUp;
