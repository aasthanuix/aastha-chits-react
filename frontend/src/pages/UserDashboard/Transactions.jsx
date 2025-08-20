import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import './Transactions.css'; 

const Transactions = ({url}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(url+'/api/users/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <AiOutlineLoading3Quarters className="spinner" />
        Loading transactions...
      </div>
    );
  }

  if (error) return <div className="error-message">Error: {error}</div>;

  if (!transactions.length) return <div>No transactions found.</div>;

  return (
    <div className="transactions-container">
      <h2>Your Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Chit Plan</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={txn._id}>
              <td>{index + 1}</td>
              <td>{txn.chitPlan?.planName || 'N/A'}</td>
              <td>{txn.amount}</td>
              <td>{new Date(txn.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}</td>
              <td className={txn.status === 'Paid' ? 'paid' : 'pending'}>
                {txn.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
