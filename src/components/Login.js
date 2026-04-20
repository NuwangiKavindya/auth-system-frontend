import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

/**
 * Login Component
 * Handles user authentication by sending credentials to the backend.
 * Displays appropriate success or error alerts (e.g. "Invalid Credentials").
 */
function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // For many backends (including FastAPI OAuth2), login expects x-www-form-urlencoded
    const submissionData = new URLSearchParams();
    submissionData.append('username', formData.username);
    submissionData.append('password', formData.password);

    try {
      // Execute the POST request to the token/login endpoint
      // Ensure the URL matches your backend URL.
      const response = await axios.post('http://localhost:8000/token', submissionData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Store the JWT token after successful login
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }

      setStatus({ type: 'success', message: 'Login successful! Welcome back.' });
      
    } catch (error) {
      // Alert handling to dynamically display "Invalid Credentials" based on server response
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        'Invalid Credentials. Please check your username and password.';
        
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please sign in to continue.</p>

        {/* This block renders the error or success alerts automatically */}
        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleInputChange} 
              required 
              placeholder="user name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
