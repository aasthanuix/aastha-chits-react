import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiHome,
  FiFileText,
  FiKey,
  FiUser,
} from 'react-icons/fi';

import {FaExchangeAlt, FaBullhorn } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo">Aastha Chits Admin</Link>
      <nav className="sidebar-nav">
        <Link to="/admin/analytics">
          <FiHome /> Dashboard
        </Link>
        <Link to="/admin/chit-plans">
          <FiFileText /> Chit Plans
        </Link>
        <Link to="/admin/users">
          <FiUsers /> Users
        </Link>
        <Link to="/admin/auctions">
          <FaBullhorn  /> Auctions
        </Link>
        <Link to="/admin/transactions">
          <FaExchangeAlt /> Transactions
        </Link>
        <Link to="/admin/credentials">
          <FiKey /> Generate Credentials
        </Link>
        <Link to="/admin/profile">
          <FiUser /> Profile
        </Link>        
      </nav>
    </div>
  );
};

export default Sidebar;
