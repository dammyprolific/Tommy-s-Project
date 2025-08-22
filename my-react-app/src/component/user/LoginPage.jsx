import React, { useState, useContext } from 'react';
import './LoginPage.css';
import Error from '../uis/Error';
import api from '../../api';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Ensure the path is correct

const LoginPage = () => {
  const { setIsAuthenticated, get_username } = useContext(AuthContext); 
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Remove any expired/invalid tokens before login
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    try {
      const res = await api.post('token/', { username, password });

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      // Clear cart_code so each user gets a fresh cart
      localStorage.removeItem('cart_code');

      setUsername('');
      setPassword('');
      setIsAuthenticated(true); // ✅ Auth state updated
      // Wait for token to be set before making authenticated requests
      setTimeout(() => {
        get_username(); // Fetch username after login
        navigate(location?.state?.from?.pathname || '/', { replace: true });
      }, 100);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Login failed. Please try again.";
      console.error("Login error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container my-5'>
      <div className='login-card shadow'>
        {error && <Error error={error} />}
        <h2 className='login-title'>Welcome Back</h2>
        <p className='login-subtitle'>Please login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="username" className='form-label'>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='form-control'
              id='username'
              placeholder='Enter your username'
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password" className='form-label'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control'
              id='password'
              placeholder='Enter your password'
              required
            />
          </div>

          <button type='submit' className='btn btn-primary w-100' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='login-footer'>
          <p><Link to="/forgot-password">Forgot Password?</Link></p>
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
