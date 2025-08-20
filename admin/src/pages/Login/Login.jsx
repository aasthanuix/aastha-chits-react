import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({url}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${url}/api/admin/login`, {
      email,
      password,
    });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      navigate("/admin/dashboard");
    } else {
      setError("Login failed: No token received");
    }
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Invalid email or password");
  }
};

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
