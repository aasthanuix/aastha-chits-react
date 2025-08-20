import React, { useEffect, useState } from 'react';
import { FaUsers, FaLayerGroup, FaExchangeAlt, FaUserCheck, FaClipboardCheck, FaClock, FaMoneyCheckAlt, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = ({url}) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalChits: 0,
    completedChits: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
  });

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url+'/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      console.log('Fetched stats:', data);

      if (res.ok) {
        setStats({
          totalUsers: data.totalUsers || 0,
          activeUsers: data.activeUsers || 0,
          totalChits: data.totalChits || 0,
          completedChits: data.completedChits || 0,
          totalTransactions: data.totalTransactions || 0,
          pendingTransactions: data.pendingTransactions || 0,
        });
      } else {
        console.error('Failed to fetch stats:', data.message || res.status);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  fetchStats();
}, []);

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <FaUsers className="icon" />, color: '#4e73df' },
    { title: 'Active Users', value: stats.activeUsers, icon: <FaUserCheck className="icon" />, color: '#1cc88a' },
    { title: 'Ongoing Chits', value: stats.totalChits, icon: <FaLayerGroup className="icon" />, color: '#36b9cc' },
    { title: 'Completed Chits', value: stats.completedChits, icon: <FaClipboardCheck className="icon" />, color: '#f6c23e' },
    { title: 'Total Transactions', value: stats.totalTransactions, icon: <FaExchangeAlt className="icon" />, color: '#e74a3b' },
    { title: 'Pending Transactions', value: stats.pendingTransactions, icon: <FaClock className="icon" />, color: '#858796' },
  ];

  return (
    <div className="dashboard-container">
      <header>
        <h1 className="dashboard-title">Aastha Chits Admin Dashboard</h1>
        <p className="dashboard-desc">Manage users, chits, and transactions with ease.</p>
      </header>

      <section className="stats-grid">
        {cards.map(({ title, value, icon, color }) => (
          <div key={title} className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon" style={{ backgroundColor: color }}>
              {icon}
            </div>
            <div className="stat-info">
              <h3>{title}</h3>
              <p className="stat-value">{value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-info">
      <h2 className="dashboard-info-title">💡 Admin Quick Tips</h2>
      <ul className="dashboard-info-list">
        <li>
          <FaMoneyCheckAlt className="tip-icon pending" />
          <span>Monitor <strong>pending transactions</strong> to keep chit cycles smooth.</span>
        </li>
        <li>
          <FaUsers className="tip-icon active" />
          <span>Use the users section to assist <strong>active users</strong>.</span>
        </li>
        <li>
          <FaCheckCircle className="tip-icon completed" />
          <span>Review completed chit plans to identify success patterns.</span>
        </li>
        <li>
          <FaChartLine className="tip-icon reports" />
          <span>Utilize reports to optimize plans and improve collections.</span>
        </li>
      </ul>
    </section>
    </div>
  );
};

export default Dashboard;
