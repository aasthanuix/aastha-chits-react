import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChitPlans, deleteChitPlan } from '../../api';
import ConfirmModal from '../../Components/ConfirmModel/ConfirmModel';
import './ChitPlans.css';

const ChitPlans = ({url}) => {
  const [plans, setPlans] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await getChitPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedPlan(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteChitPlan(selectedPlan);
      setShowConfirm(false);
      fetchPlans();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Unauthorized! Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Error deleting plan', error);
      }
    }
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">Manage Chit Plans</h2>
      <div className="chitplans-actions">
        <button className="btn-primary" onClick={() => navigate('/admin/chit-plans/add')}>
          Add New Plan
        </button>
      </div>

      <table className="chitplans-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Plan Name</th>
            <th>Monthly Subscription</th>
            <th>Min Bidding</th>
            <th>Max Bidding</th>
            <th>Duration</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan._id}>
              <td>
                {plan.image && <img src={`${url}/uploads/${plan.image}`} alt={plan.planName} className="plan-img" />}
              </td>
              <td>{plan.planName}</td>
              <td>₹{plan.monthlySubscription}</td>
              <td>{plan.minBidding}</td>
              <td>{plan.maxBidding}</td>
              <td>{plan.duration} Months</td>
              <td>₹{plan.totalAmount}</td>
              <td>
                <button className="btn-edit" onClick={() => navigate(`/admin/chit-plans/edit/${plan._id}`)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteClick(plan._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reusable Confirmation Modal */}
      <ConfirmModal
        show={showConfirm}
        title="Delete Chit Plan"
        message="Are you sure you want to delete this chit plan? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ChitPlans;
