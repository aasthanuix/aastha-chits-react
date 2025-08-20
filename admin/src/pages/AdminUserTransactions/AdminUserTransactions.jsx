import React, { useEffect, useState } from 'react';

const AdminUserTransactions = ({url}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch(url+'/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setUsers(data);
  };

  // Fetch transactions of selected user
  const fetchTransactions = async (userId) => {
    const res = await fetch(`${url}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setTransactions(data.transactions || []);
  };

  // Add transaction for selected user
  const addTransaction = async (e) => {
    e.preventDefault();
    const res = await fetch(`${url}/api/users/${selectedUser}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (res.ok) {
      setTransactions(data.transactions);
      setMessage('Transaction added successfully!');
      setAmount('');
    } else {
      setMessage(data.message || 'Failed to add transaction');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Admin: Manage User Transactions</h2>

      {/* Select User */}
      <select onChange={(e) => {
        setSelectedUser(e.target.value);
        fetchTransactions(e.target.value);
      }}>
        <option value="">Select a User</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.userId})
          </option>
        ))}
      </select>

      {/* Add Transaction */}
      {selectedUser && (
        <form onSubmit={addTransaction}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit">Add Transaction</button>
        </form>
      )}

      {message && <p>{message}</p>}

      {/* Display Transactions */}
      {transactions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.amount}</td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserTransactions;
