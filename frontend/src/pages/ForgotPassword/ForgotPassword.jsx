import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import './AuthPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:4000/api/users/forgot-password',
        { email }
      );

      setMessage(res.data.message || 'If an account exists, we have sent a reset link.');
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-illustration">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
            alt="Reset Password"
          />
        </div>
        <div className="forgot-form">
          <h2>Forgot Password?</h2>
          <p>Enter your registered email and we’ll send you a reset link.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {message && (
            <p className={`message ${messageType}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
