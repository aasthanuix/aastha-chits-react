import React from 'react';
import { Outlet } from 'react-router-dom';
import './UserLayout.css';
import UserSidebar from '../../Components/User/UserSidebar';
import UserHeader from '../../Components/User/UserHeader';

const UserLayout = () => {
  return (
    <div className="user-dashboard">
      <UserSidebar />
      <div className="main-content">
        <UserHeader />
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
