import React, { useState } from 'react';
import './AddTransactions.css';

const AddTransactions = ({ userId, plans, onClose, url }) => {
  const [formData, setFormData] = useState({
    chitPlanId: '',
    amount: '',
    date: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${url}/api/transactions/${userId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await res.json()
        : { message: await res.text() };

      if (res.ok) {
        setMessage('Transaction added successfully');
        setFormData({ chitPlanId: '', amount: '', date: '' });
      } else {
        setMessage(data.message || 'Failed to add transaction');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Transaction</h3>
        {message && (
          <p className={message.includes('success') ? 'success' : 'error'}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <select
            name="chitPlanId"
            value={formData.chitPlanId}
            onChange={handleChange}
            required
          >
            <option value="">Select Chit Plan</option>
            {plans.map(plan => (
              <option key={plan._id} value={plan._id}>
                {plan.planName}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          
          <div className="modal-buttons">
            <button type="submit">Add Transaction</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactions;
