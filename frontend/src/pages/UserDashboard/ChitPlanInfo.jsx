import React, { useEffect, useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import './ChitPlanInfo.css';

const ChitPlanInfo = ({url}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(url+'/api/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
       
        setPlans(data.enrolledChits || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledPlans();
  }, []);

  if (loading) return <p>Loading enrolled plans...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="chitplan-container" aria-label="Enrolled Chit Plans">
      <h2 className="chitplan-title">
        <FaClipboardList className="chitplan-icon" aria-hidden="true" /> Enrolled Chit Plans
      </h2>

      {plans.length > 0 ? (
        <ul className="chitplan-list">
          {plans.map(({ _id, planName, monthlySubscription, totalAmount, duration }) => (
            <li key={_id} className="chitplan-card">
              <h3 className="chitplan-name">{planName}</h3>
              <dl className="chitplan-details">
                <div>
                  <dt>Monthly Subscription:</dt>
                  <dd>₹{monthlySubscription}</dd>
                </div>
                <div>
                  <dt>Total Amount:</dt>
                  <dd>₹{totalAmount}</dd>
                </div>
                <div>
                  <dt>Duration:</dt>
                  <dd>{duration} months</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : (
        <p className="chitplan-empty-message">You have not enrolled in any chit plans yet.</p>
      )}
    </section>
  );
};

export default ChitPlanInfo;
