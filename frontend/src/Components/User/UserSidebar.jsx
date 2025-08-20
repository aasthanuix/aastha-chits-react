import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaClipboardList, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './UserSidebar.css';

const UserSidebar = () => {
  return (
    <div className="user-sidebar">
      <h2 className="sidebar-logo">Aastha Chits</h2>
      <nav className="sidebar-nav">
        <NavLink to="/user/dashboard" className="sidebar-link">
          <FaTachometerAlt className="icon" />
          Dashboard
        </NavLink>
        <NavLink to="/user/transactions" className="sidebar-link">
          <FaExchangeAlt className="icon" />
          Transactions
        </NavLink>
        <NavLink to="/user/chit-plan" className="sidebar-link">
          <FaClipboardList className="icon" />
          Chit Plan
        </NavLink>
        <NavLink to="/user/profile" className="sidebar-link">
          <FaUser className="icon" />
          Profile
        </NavLink>
        <NavLink to="/login" className="sidebar-link">
          <FaSignOutAlt className="icon" />
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default UserSidebar;
