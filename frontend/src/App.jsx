import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import ChitPlans from './pages/ChitPlans/ChitPlans';
import ChitsBenefits from './pages/ChitsBenefits/ChitsBenefits';
import ContactUs from './pages/ContactUs/ContactUs';
import LoginPage from './pages/LoginPage/LoginPage';

// User
import UserLayout from './layouts/UserLayout/UserLayout';
import DashboardHome from './pages/UserDashboard/DashboardHome';
import Profile from './pages/UserDashboard/Profile';
import Transactions from './pages/UserDashboard/Transactions';
import ChitPlanInfo from './pages/UserDashboard/ChitPlanInfo';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ForgotPassword/ResetPassword';

const App = () => {

  const url = "https://admin.aasthageooads.com";

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home url={url}/>} />
      <Route path="/about" element={<About />} />
      <Route path="/chits-plans" element={<ChitPlans />} />
      <Route path="/chits-benefits" element={<ChitsBenefits />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login" element={<LoginPage url={url}/>} />
      <Route path="/forgot-password" element={<ForgotPassword url={url}/>} />
      <Route path="/reset-password/:token" element={<ResetPassword url={url}/>} />

      {/* User Dashboard */}
      <Route path="/user" element={<UserLayout url={url}/>}>
        <Route index element={<DashboardHome url={url}/>} /> 
        <Route path="dashboard" element={<DashboardHome url={url}/>} />
        <Route path="profile" element={<Profile url={url}/>} />
        <Route path="transactions" element={<Transactions url={url}/>} />
        <Route path="chit-plan" element={<ChitPlanInfo url={url}/>} />
      </Route>
    </Routes>
  );
};

export default App;
