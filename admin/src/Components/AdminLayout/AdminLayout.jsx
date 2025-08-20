import React from 'react';
import Header from '../Header/Header'
import './AdminLayout.css';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header/>
        <div className="admin-content">
          <Outlet />      
          
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
