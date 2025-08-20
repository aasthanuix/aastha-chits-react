import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmModal from '../../Components/ConfirmModel/ConfirmModel';
import './AllTransactions.css';

const AllTransactions = ({url}) => {
  const [transactions, setTransactions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(url+'/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data || []);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedTransaction(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/api/transactions/${selectedTransaction}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowConfirm(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction', error);
    }
  };

const markAsPaid = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(
      `${url}/transactions/${id}/status`,
      { status: 'Paid' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTransactions();
  } catch (error) {
    console.error('Error marking transaction as paid', error);
  }
};

  return (
    <div className="admin-page">
      <h2 className="page-title">All Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Chit Plan</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{txn.user?.name || 'N/A'}</td>
                <td>{txn.chitPlan?.planName || 'N/A'}</td>
                <td>₹{txn.amount}</td>
                <td>{txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}</td>
                <td>{txn.status || 'Pending'}</td>
                <td>
                  <div className="action-sub-columns">
                   <div className="sub-column">
                     {txn.status === 'Pending' ? (
                     <button className="btn-edit" onClick={() => markAsPaid(txn._id)}>
                      Mark as Paid
                     </button>
                     ) : (
                     <div className="placeholder"></div> 
                    )}
                   </div>
                   <div className="sub-column">
                      <button className="btn-delete" onClick={() => handleDeleteClick(txn._id)}>
                       Delete
                      </button>
                   </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmModal
        show={showConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AllTransactions;
