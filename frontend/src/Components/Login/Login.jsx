import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({url}) => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, password } = formData;

    try {
      const res = await fetch(url+'/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Login failed');
        setMessageType('error');
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage('Login successful!');
      setMessageType('success');

      navigate('/user/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong');
      setMessageType('error');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container login-container">
        <div className="row">
          <div className="col-lg-6 d-flex align-items-center">
            <div className="login-box w-100">
              <h2 className="app-title">User Login</h2>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userId">User ID</label>
                  <input
                    type="text"
                    id="userId"
                    placeholder="Enter your User ID"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-login">Sign In</button>
              </form>
              {message && (
                <p className={`response-message ${messageType}`}>{message}</p>
              )}
              <div className="helper-links">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className="login-image-wrapper"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
