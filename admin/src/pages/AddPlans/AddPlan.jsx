import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addChitPlan } from '../../api';
import './AddPlan.css';

const AddPlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    monthlySubscription: '',
    minBidding: '',
    maxBidding: '',
    duration: '',
    totalAmount: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await addChitPlan(data);
      navigate('/admin/chit-plans'); 
    } catch (error) {
      console.error('Error adding chit plan', error);
    }
  };

  return (
    <div className="add-plan-page">
      <h2 className="page-title">Add New Chit Plan</h2>
      <form className="add-plan-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="planName" placeholder="Plan Name" value={formData.planName} onChange={handleChange} required />
        <input type="number" name="monthlySubscription" placeholder="Monthly Subscription" value={formData.monthlySubscription} onChange={handleChange} required />
        <input type="number" name="minBidding" placeholder="Minimum Bidding" value={formData.minBidding} onChange={handleChange} required />
        <input type="number" name="maxBidding" placeholder="Maximum Bidding" value={formData.maxBidding} onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration (Months)" value={formData.duration} onChange={handleChange} required />
        <input type="number" name="totalAmount" placeholder="Total Amount" value={formData.totalAmount} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit" className="btn-primary">Save Plan</button>
      </form>
    </div>
  );
};

export default AddPlan;
