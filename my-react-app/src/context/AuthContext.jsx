import { useEffect, createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from '../api';

export const AuthContext = createContext(false);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleAuth = () => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryDate = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (expiryDate > currentTime) {
          setIsAuthenticated(true);
          return true;
        } else {
          localStorage.removeItem("access");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("access");
      }
    }

    setIsAuthenticated(false);
    return false;
  };

  const get_username = () => {
    api.get("/get_username/")
      .then(res => {
        setUsername(res.data.username);
      })
      .catch(err => {
        console.error("Error fetching username:", err);
      });
  };

  useEffect(() => {
    const authStatus = handleAuth();
    if (authStatus) {
      get_username();
    }
  }, []);

  const authValue = {
    isAuthenticated,
    setIsAuthenticated,
    get_username,
    username,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}
