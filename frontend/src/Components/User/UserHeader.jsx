// src/components/User/UserHeader.jsx
import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './UserHeader.css';

const UserHeader = () => {
  const handleLogout = () => {
    // clear token and redirect to login
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  return (
    <header className="user-header">
      <div className="user-header-left">
        <h3>Welcome to Aastha Chits</h3>
      </div>
      <div className="user-header-right">
        <FaUserCircle className="header-icon profile-icon" title="Profile" />
        <FaSignOutAlt className="header-icon logout-icon" title="Logout" onClick={handleLogout} />
      </div>
    </header>
  );
};

export default UserHeader;
