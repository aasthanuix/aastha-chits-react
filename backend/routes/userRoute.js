import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './CredentialGenerator.css';

const CredentialGenerator = ({ url }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    chitPlan: [],
  });

  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch chit plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${url}/api/chit-plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, [url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      chitPlan: prev.chitPlan.includes(id)
        ? prev.chitPlan.filter(p => p !== id)
        : [...prev.chitPlan, id],
    }));
  };

  // Validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.name.trim()) return 'Name is required';
    if (!emailRegex.test(formData.email)) return 'Enter a valid email address';
    if (formData.phone && !phoneRegex.test(formData.phone))
      return 'Enter a valid 10-digit phone number';
    if (!formData.chitPlan.length) return 'Select at least one chit plan';

    return null;
  };

  // Send credentials via EmailJS
  const sendCredentialsEmail = async ({ name, to_email, userId, password, loginUrl }) => {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      to_email,
      name,
      userId,
      password,
      loginUrl,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};

  // Generate credentials
  const handleGenerate = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) return showMessage(validationError, false);

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        enrolledChits: formData.chitPlan,
      };

      const res = await fetch(`${url}/api/users/generate-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || 'Failed to generate credentials', false);
        setLoading(false);
        return;
      }

      // Send email
      await sendCredentialsEmail({
  name: payload.name,
  to_email: payload.email,  
  userId: data.userId,
  password: data.password,
  loginUrl: 'https://universalsexports.com/login', 
});

      showMessage('Credentials generated and emailed successfully', true);

      setGeneratedCredentials({
        userId: data.userId,
        password: data.password,
      });

      setFormData({ name: '', email: '', phone: '', chitPlan: [] });

    } catch (error) {
      console.error(error);
      showMessage('Something went wrong. Try again.', false);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="credential-generator-card">
      <h2 className="cg-title">Generate User Credentials</h2>

      <form className="credential-form" onSubmit={handleGenerate}>
        <div className="input-group">
          <input name="name" value={formData.name} onChange={handleChange} required />
          <label>Name</label>
        </div>

        <div className="input-group">
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input name="phone" value={formData.phone} onChange={handleChange} />
          <label>Phone</label>
        </div>

        <div className="chit-plan-group">
          <label>Select Chit Plans</label>
          <div className="plan-options">
            {plans.map(plan => (
              <div key={plan._id} className="plan-option">
                <input
                  type="checkbox"
                  id={plan._id}
                  checked={formData.chitPlan.includes(plan._id)}
                  onChange={() => handlePlanToggle(plan._id)}
                />
                <label htmlFor={plan._id}>
                  {plan.planName} – ₹{plan.monthlySubscription}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="generate-btn" disabled={loading}>
          {loading ? 'Generating…' : 'Generate & Send'}
        </button>
      </form>

      {message && (
        <p className={isSuccess ? 'success-msg' : 'error-msg'}>
          {message}
        </p>
      )}

      {generatedCredentials && (
        <div className="generated-credentials">
          <h3>Generated Credentials</h3>
          <p><strong>User ID:</strong> {generatedCredentials.userId}</p>
          <p><strong>Password:</strong> {generatedCredentials.password}</p>
        </div>
      )}
    </div>
  );
};

export default CredentialGenerator;
