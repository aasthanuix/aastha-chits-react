import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardHome from './pages/DashboardHome/DashboardHome';
import AllUsers from './pages/AllUsers/AllUsers';
import CredentialGenerator from './pages/CredentialGenerator/CredentialGenerator';
import AllTransactions from './pages/AllTransactions/AllTransactions';
import UserDetails from './pages/UserDetails/UserDetails';
import AdminProfile from './pages/AdminProfile/AdminProfile';
import ChitPlans from './pages/ChitPlans/ChitPlans';
import DashboardAnalytics from './pages/DashboardAnalytics/DashboardAnalytics';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import Login from './pages/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import AddPlan from './pages/AddPlans/AddPlan';
import EditPlan from './pages/EditPlan/EditPlan';
import AddUser from './pages/AddUser/AddUser';
import EditUser from './pages/EditUser/EditUser';
import Auctions from './pages/Auctions/Auctions';

const App = () => {

  const url = "https://api.universalsexports.com";
  
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Public route */}
      <Route path="login" element={<Login url={url}/>} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome url={url}/>} />
        <Route path="dashboard" element={<DashboardHome url={url}/>} />
        <Route path="users" element={<AllUsers url={url}/>} />
        <Route path="/admin/user/:userId" element={<UserDetails url={url}/>} />
        <Route path="/admin/edit-user/:userId" element={<EditUser url={url}/>} />
        <Route path="/admin/add-user" element={<AddUser url={url}/>} />
        <Route path="credentials" element={<CredentialGenerator url={url}/>} />
        <Route path="transactions" element={<AllTransactions url={url}/>} />        
        <Route path="profile" element={<AdminProfile url={url}/>} />
        <Route path="chit-plans" element={<ChitPlans url={url}/>} />
        <Route path="/admin/chit-plans/add" element={<AddPlan url={url}/>} />
        <Route path="/admin/chit-plans/edit/:id" element={<EditPlan url={url}/>} />
        <Route path="analytics" element={<DashboardAnalytics url={url}/>} />        
        <Route path="auctions" element={<Auctions url={url}/>} />
      </Route>
    </Routes>
  );
};

export default App;
