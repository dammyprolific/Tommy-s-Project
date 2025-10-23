import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('pendingEmail') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/verify_otp_login/', { email, otp });
      if (res.data.access) {
        // Store JWT token after successful login
        localStorage.setItem('access', res.data.access);
        localStorage.removeItem('pendingEmail');
        navigate('/'); // Redirect to homepage or dashboard
      } else if (res.data.message?.includes("Login successful")) {
        localStorage.removeItem('pendingEmail');
        navigate('/');
      } else {
        setError("OTP verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} disabled />
        </div>
        <div>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;