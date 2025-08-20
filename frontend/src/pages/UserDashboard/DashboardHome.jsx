import React, { useEffect, useState, useRef } from 'react';
import { FaClipboardList, FaMoneyCheckAlt, FaUserCircle, FaBullhorn } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { io } from 'socket.io-client';
import './DashboardHome.css';

const DashboardHome = ({ url }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [auctions, setAuctions] = useState([]);
  const [auctionsLoading, setAuctionsLoading] = useState(true);
  const [auctionsError, setAuctionsError] = useState(null);

  const socketRef = useRef(null);

  // Fetch dashboard user data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const res = await fetch(`${url}/api/users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard data');

      setUserData({
        ...data,
        enrolledPlans: Array.isArray(data.enrolledChits) ? data.enrolledChits : [],
        transactions: Array.isArray(data.transactions) ? data.transactions : [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent auctions for user's plans
  const fetchAuctionsData = async () => {
    try {
      setAuctionsLoading(true);

      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${url}/api/auctions/recent`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch auctions');

      setAuctions(Array.isArray(data) ? data : []);
    } catch (err) {
      setAuctionsError(err.message);
    } finally {
      setAuctionsLoading(false);
    }
  };

  // Setup socket listeners
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io(url, {
      auth: { token },
    });

    const socket = socketRef.current;

    if (userData) {
      socket.on('auctionUpdated', (update) => {
        if (userData.enrolledPlans.some((plan) => plan._id === update.chitPlan)) {
          setAuctions((prev) => {
            const exists = prev.some((a) => a._id === update._id);
            return exists
              ? prev.map((a) =>
                  a._id === update._id ? { ...a, ...update } : a
                )
              : [update, ...prev];
          });
        }
      });

      socket.on('newAuction', (auction) => {
        if (userData.enrolledPlans.some((plan) => plan._id === auction.chitPlan)) {
          setAuctions((prev) => [auction, ...prev]);
        }
      });

      socket.on('auctionEnded', (closedAuction) => {
        if (userData.enrolledPlans.some((plan) => plan._id === closedAuction.chitPlan)) {
          setAuctions((prev) =>
            prev.map((a) =>
              a._id === closedAuction._id ? { ...a, status: 'ended' } : a
            )
          );
        }
      });
    }

    return () => {
      socket.off('auctionUpdated');
      socket.off('newAuction');
      socket.off('auctionEnded');
      socket.disconnect();
    };
  }, [userData, url]);

  useEffect(() => {
    fetchDashboardData();
    fetchAuctionsData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <AiOutlineLoading3Quarters className="spinner" /> Loading dashboard...
      </div>
    );
  }

  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!userData) return <div className="dashboard-error">No user data available.</div>;

  return (
    <div className="dashboard-home-container">
      <header className="dashboard-header">
  {userData.profilePic ? (
    <img
      src={userData.profilePic.startsWith('http') ? userData.profilePic : `${url}/${userData.profilePic}`}
      alt={userData.name}
      className="dashboard-user-icon"
    />
  ) : (
    <FaUserCircle className="dashboard-user-icon" />
  )}
  <h1 className="dashboard-welcome">
    Welcome back, <span className="dashboard-user">{userData.name}</span>!
  </h1>
  <p className="dashboard-email">{userData.email}</p>
</header>

      <section className="dashboard-grid">
        {/* Enrolled Plans */}
        <article className="dashboard-card enrolled-plans-card animate-fadeInUp">
          <h2 className="card-title">
            <FaClipboardList className="card-icon" /> Enrolled Chit Plans
          </h2>
          {userData.enrolledPlans.length > 0 ? (
            <ul className="dashboard-list">
              {userData.enrolledPlans.map((plan) => (
                <li key={plan._id} className="dashboard-list-item animate-slideUp">
                  <span className="plan-name">{plan.planName}</span>
                  <span className="plan-amount">
                    ₹{plan.monthlySubscription ?? plan.amount ?? 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No chit plans enrolled yet.</p>
          )}
        </article>

        {/* Transactions */}
        <article className="dashboard-card transactions-card animate-fadeInUp delay-1">
          <h2 className="card-title">
            <FaMoneyCheckAlt className="card-icon" /> Recent Transactions
          </h2>
          {userData.transactions.length > 0 ? (
            <ul className="dashboard-list transactions-list">
              {userData.transactions.map((txn) => (
                <li key={txn._id} className="dashboard-list-item transaction-item animate-slideUp">
                  <span className="txn-plan">{txn.chitPlan?.planName || 'N/A'}</span>
                  <span className="txn-amount">₹{txn.amount ?? 'N/A'}</span>
                  <span className="txn-date">
                    {txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className={`txn-status status-${txn.status?.toLowerCase() || 'unknown'}`}>
                    {txn.status || 'Unknown'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No transactions available.</p>
          )}
        </article>

        {/* Auctions */}
        <article className="dashboard-card auctions-card animate-fadeInUp delay-2">
          <h2 className="card-title">
            <FaBullhorn className="card-icon" /> Recent Auctions
          </h2>
          {auctionsLoading ? (
            <div className="dashboard-loading-small">
              <AiOutlineLoading3Quarters className="spinner" /> Loading auctions...
            </div>
          ) : auctionsError ? (
            <p className="dashboard-error">Error: {auctionsError}</p>
          ) : auctions.length > 0 ? (
            <ul className="dashboard-list auctions-list">
              {auctions.map((auction) => (
                <li key={auction._id} className="dashboard-list-item auction-item animate-slideUp">
                  <span className="auction-plan-name">
                    {auction.chitPlan?.planName || auction.chitPlanName || 'N/A'}
                  </span>
                  <span className={`auction-status status-${auction.status?.toLowerCase() || 'unknown'}`}>
                    {auction.status || 'Unknown'}
                  </span>
                  {auction.status === 'live' && <span className="live-badge">LIVE</span>}
                  <span className="auction-current-bid">₹{auction.currentAmount ?? 'N/A'}</span>
                  <span className="auction-highest-bidder">
                    {auction.highestBidderName || 'N/A'}
                  </span>
                  <span className="auction-date">
                    {auction.auctionDate ? new Date(auction.auctionDate).toLocaleString() : 'No date'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No auctions found.</p>
          )}
        </article>
      </section>
    </div>
  );
};

export default DashboardHome;
