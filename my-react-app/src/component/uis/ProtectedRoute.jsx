import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../../api';
import Spinner from '../uis/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      setIsAuthorized(false);
      return;
    }

    try {
      const response = await api.post('/token/refresh/', { refresh });
      if (response.status === 200 && response.data.access) {
        localStorage.setItem("access", response.data.access);
        setIsAuthorized(true);
      } else {
        clearTokens();
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearTokens();
      setIsAuthorized(false);
    }
  }

  function clearTokens() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  async function auth() {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiryDate = decoded.exp;
      const currentTime = Date.now() / 1000;

      if (expiryDate < currentTime) {
        await refreshToken();
      } else {
        setIsAuthorized(true); // ✅ correct usage
      }
    } catch (error) {
      console.error("Invalid token:", error);
      clearTokens();
      setIsAuthorized(false);
    }
  }

  if (isAuthorized === null) {
    return <Spinner loading={true} />;
  }

  return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
