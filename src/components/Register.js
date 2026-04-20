import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

/**
 * Register Component
 * Handles user sign-up including text inputs and profile image upload.
 * Utilizes FormData to properly transmit multipart/form-data to the backend.
 */
function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // FormData must be used instead of a standard JSON object to safely transmit binary file data
    const submissionData = new FormData();
    submissionData.append('username', formData.username);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    
    if (photo) {
      submissionData.append('profile_image', photo);
    }

    try {
      // Execute the POST request to the authentication API endpoint
      const response = await axios.post('http://localhost:8000/register', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Explicitly set content type to support file payloads
        }
      });
      
      setStatus({ type: 'success', message: 'Registration successful! You can now log in.' });
      
      setFormData({ username: '', email: '', password: '' });
      setPhoto(null);
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message 
        || 'An error occurred during registration. Please try again.';
        
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <p className="register-subtitle">Join us and set up your profile.</p>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              placeholder="your@email.com"
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

          <div className="form-group file-input-group">
            <span className="file-label-text">Profile Photo</span>
            <label htmlFor="photo" className="file-upload-box">
              <span className="upload-icon">📸</span>
              {photo ? photo.name : 'Click to select profile photo'}
            </label>
            <input 
              type="file" 
              id="photo" 
              name="photo" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              className="hidden-file-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
