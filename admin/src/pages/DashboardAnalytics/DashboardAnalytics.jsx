import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaUsers, FaExchangeAlt, FaLayerGroup, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import './DashboardAnalytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DashboardAnalytics = ({url}) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalChits: 0,
    monthlyTransactions: [],
    monthlyUsers: [],
    recentActivity: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(url+'/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchStats();
  }, []);

  const getMonthName = (month, year) => {
    return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const barData = {
    labels: stats.monthlyTransactions.map(m => getMonthName(m._id.month, m._id.year)),
    datasets: [
      {
        label: 'Monthly Transactions (₹)',
        data: stats.monthlyTransactions.map((m) => m.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const lineData = {
    labels: stats.monthlyUsers.map(m => getMonthName(m._id.month, m._id.year)),
    datasets: [
      {
        label: 'User Growth',
        data: stats.monthlyUsers.map((m) => m.count),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true }
    },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="analytics-page">
      <h2 className="analytics-title">📊 Dashboard Analytics</h2>
     
      <div className="analytics-cards">
        <div className="analytics-card" style={{ borderLeftColor: '#4e73df' }}>
          <FaUsers className="analytics-icon" style={{ color: '#4e73df' }} />
          <div>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="analytics-card" style={{ borderLeftColor: '#1cc88a' }}>
          <FaExchangeAlt className="analytics-icon" style={{ color: '#1cc88a' }} />
          <div>
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
        </div>
        <div className="analytics-card" style={{ borderLeftColor: '#f6c23e' }}>
          <FaLayerGroup className="analytics-icon" style={{ color: '#f6c23e' }} />
          <div>
            <h3>Total Chit Plans</h3>
            <p>{stats.totalChits}</p>
          </div>
        </div>
      </div>
    
      <div className="analytics-graphs">
        <motion.div
          className="graph-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Bar
            data={barData}
            options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins, title: { display: true, text: '📈 Monthly Transactions' } }
            }}
          />
        </motion.div>
        <motion.div
          className="graph-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Line
            data={lineData}
            options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins, title: { display: true, text: '👥 User Growth' } }
            }}
          />
        </motion.div>
      </div>

      
<div className="recent-activity">
  <h4>📰 Recent Activity</h4>
  <ul className="activity-scroll">
    {stats.recentActivity.length > 0 ? (
      stats.recentActivity.map((activity, index) => {
        let StatusIcon;
        let statusClass;

        switch (activity.status.toLowerCase()) {
          case "paid":
            StatusIcon = FaCheckCircle;
            statusClass = "status-paid";
            break;
          case "pending":
            StatusIcon = FaHourglassHalf;
            statusClass = "status-pending";
            break;
          default:
            StatusIcon = FaTimesCircle;
            statusClass = "status-overdue";
            break;
        }

        return (
          <li key={index} className="activity-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <FaClock className="activity-icon" />
            <span>
              <strong>{activity.userName}</strong> paid <b>₹{activity.amount}</b> on{" "}
              {new Date(activity.date).toLocaleDateString()}{" "}
              <span className={`status-badge ${statusClass}`}>
                <StatusIcon /> {activity.status}
              </span>
            </span>
          </li>
        );
      })
    ) : (
      <li className="activity-item">No recent activity</li>
    )}
  </ul>
</div>
</div>
  );
};

export default DashboardAnalytics;
