import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <>
      <div className="topbar">
        <h3 className="topbar-title">Admin Dashboard</h3>
        <div className="topbar-actions">
          <FiUser
            className="topbar-icon"
            title="Admin Profile"
            onClick={toggleProfile}
            style={{ cursor: 'pointer' }}
          />
          <FiLogOut
            className="topbar-icon"
            title="Logout"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className={`profile-panel ${showProfile ? 'open' : ''}`}>
        <div className="profile-header">
          <h4>Admin Profile</h4>
          <button className="close-btn" onClick={toggleProfile}>×</button>
        </div>
        <div className="profile-content">
          <p><strong>Name:</strong> Admin</p>
          <p><strong>Email:</strong> admin@aasthachits.com</p>
          <p><strong>Role:</strong> Super Admin</p>
        </div>
      </div>
    </>
  );
};

export default Header;
