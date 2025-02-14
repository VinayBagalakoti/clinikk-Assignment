import { createContext, useReducer, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true); // 🔹 New loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "LOGIN", payload: user });
      setLoading(false); // 🔹 Only set loading false when Firebase is ready
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, loading }}>
      {loading ? <p>Loading...</p> : children} {/* 🔹 Wait until loading is false */}
    </AuthContext.Provider>
  );
};

export { AuthContext };
