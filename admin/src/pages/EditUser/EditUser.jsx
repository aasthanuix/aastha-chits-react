import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddTransactions from '../AddTransactions/AddTransactions';
import './EditUser.css';

const EditUser = ({url}) => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrolledChits: [],
  });
  const [plans, setPlans] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch user and plans
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${url}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          enrolledChits: data.enrolledChits?.map((plan) => plan._id) || [],
        });
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      }
    };

    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(url+'/api/chit-plans', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch plans');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      }
    };

    fetchUser();
    fetchPlans();
  }, [userId]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${url}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'User updated successfully' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update user' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const enrolledPlans = plans.filter((plan) => formData.enrolledChits.includes(plan._id));

  return (
    <div className="edit-user-page">
      <h2>Edit User</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdateUser}>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoComplete="off"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          autoComplete="off"
        />
        <input
          name="phone"
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          autoComplete="off"
        />

        <label>Enroll Chit Plans (select multiple):</label>
        <select
          name="enrolledChits"
          multiple
          value={formData.enrolledChits}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
            setFormData({ ...formData, enrolledChits: selected });
          }}
          size={plans.length > 5 ? 5 : plans.length}
        >
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.planName}
            </option>
          ))}
        </select>

        <div className="button-group">
          <button type="submit" className="btn update-btn">
            Update User
          </button>
          <button
            type="button"
            className="btn transaction-btn"
            onClick={() => setShowTransactionForm(true)}
          >
            Initiate Transaction
          </button>
        </div>
      </form>

      {showTransactionForm && (
        <div className="modal-overlay" onClick={() => setShowTransactionForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AddTransactions
              userId={userId}
              plans={enrolledPlans}
              onClose={() => setShowTransactionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
