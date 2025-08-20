import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserDetails.css';

const UserDetails = ({url}) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${url}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="user-details-container">
      <h2>User Details</h2>

      {/* User Information */}
      <div className="user-info-card">
        <h3>{user.name}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Plan:</strong> {
          user.enrolledChits?.length
            ? user.enrolledChits.map((plan, i) => (
                <span key={plan._id}>
                  {plan.planName}{i < user.enrolledChits.length - 1 ? ', ' : ''}
                </span>
              ))
            : 'Not enrolled in any plan'
        }</p>
      </div>

      {/* Transaction History */}
      <div className="user-transactions">
        <h3>Transaction History</h3>
        {user.transactions?.length ? (
          <table className="user-transactions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Chit Plan</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {user.transactions.map((txn, index) => (
                <tr key={txn._id}>
                  <td>{index + 1}</td>
                  <td>{txn.chitPlan?.planName || 'N/A'}</td>
                  <td>₹{txn.amount}</td>
                  <td>{new Date(txn.date).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}</td>
                  <td className={txn.status === 'Paid' ? 'paid' : 'pending'}>
                    {txn.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
