import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // your Axios instance (make sure it handles baseURL)
import './RegisterPage.css'; // Import your CSS styles

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    state: '',
    city: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post('create_user/', formData);

      console.log("Registration successful:", response.data);

      // Optional: Check if token is returned (auto-login)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // protected route
      } else {
        // Redirect to login if no token returned
        navigate('/login');
      }

    } catch (err) {
      console.error("Registration error:", err.response || err);
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className='register-container my-5'>
      <h1>Register</h1>
      <p>Please fill in the details below to create an account.</p>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="username">Username</label>
          <input type="text" value={formData.username} id="username" name="username" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input type="email" value={formData.email} id="email" name="email" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input type="password" value={formData.password} id="password" name="password" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" value={formData.confirmPassword} id="confirmPassword" name="confirmPassword" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="phone">Phone</label>
          <input type="tel" value={formData.phone} id="phone" name="phone" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="address">Address</label>
          <input type="text" value={formData.address} id="address" name="address" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="state">State</label>
          <input type="text" value={formData.state} id="state" name="state" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="city">City</label>
          <input type="text" value={formData.city} id="city" name="city" required onChange={handleChange} />
        </div>
        <div className='form-group'>
          <button type="submit" className='btn btn-primary'>Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
