import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChitPlans, updateChitPlan } from '../../api';
// import './AddPlan.css';

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await getChitPlans();
        const plan = data.find((p) => p._id === id);
        if (plan) setFormData(plan);
      } catch (error) {
        console.error('Error fetching plan', error);
      }
    };
    fetchPlan();
  }, [id]);

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
      await updateChitPlan(id, data);
      navigate('/admin/chit-plans');
    } catch (error) {
      console.error('Error updating chit plan', error);
    }
  };

  return (
    <div className="add-plan-page">
      <h2 className="page-title">Edit Chit Plan</h2>
      <form className="add-plan-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="planName" value={formData.planName || ''} onChange={handleChange} required />
        <input type="number" name="monthlySubscription" value={formData.monthlySubscription || ''} onChange={handleChange} required />
        <input type="number" name="minBidding" value={formData.minBidding || ''} onChange={handleChange} required />
        <input type="number" name="maxBidding" value={formData.maxBidding || ''} onChange={handleChange} required />
        <input type="number" name="duration" value={formData.duration || ''} onChange={handleChange} required />
        <input type="number" name="totalAmount" value={formData.totalAmount || ''} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} required/>
        <button type="submit" className="btn-primary">Update Plan</button>
      </form>
    </div>
  );
};

export default EditPlan;
