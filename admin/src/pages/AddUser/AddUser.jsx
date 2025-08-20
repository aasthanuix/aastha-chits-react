import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';

const AddUser = ({url}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrolledChits: [],
  });

  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url+'/api/chit-plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(url+'/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      navigate('/admin/users');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="add-user-page">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <select
          required
          onChange={(e) =>
            setFormData({ ...formData, enrolledChits: [e.target.value] })
          }
        >
          <option value="">Select Chit Plan</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.planName}
            </option>
          ))}
        </select>

        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
