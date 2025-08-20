import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setMessage(data.message || 'Password has been reset successfully!');
      setMessageType('success');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.message || 'An error occurred');
      setMessageType('error');
    }
  };

  return (
    <div className="reset-password-wrapper">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
