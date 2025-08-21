import React, { useState, useEffect } from 'react';
import './BrochureForm.css';

const BrochureForm = ({ isOpen, onClose, url }) => {
  const [formData, setFormData] = useState({ name: '', email: '', contact: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
   if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
   if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact must be 10 digits.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(url + '/api/send-brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.fileUrl) {
        // Trigger download from signed URL
        const link = document.createElement('a');
        link.href = data.fileUrl;
        link.setAttribute('download', 'Aastha-Brochure.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        setShowSuccess(true);
        setFormData({ name: '', email: '', contact: '' });
        onClose();
      } else {
        alert('Failed to send brochure. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="brochure-overlay">
      <div className="brochure-modal">
        <button className="brochure-close" onClick={onClose}>&times;</button>
        <h2 className="brochure-title">Request Brochure</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            className="brochure-input"
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="brochure-error">{errors.name}</p>}

          <input
            className="brochure-input"
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="brochure-error">{errors.email}</p>}

          <input
            className="brochure-input"
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p className="brochure-error">{errors.contact}</p>}

          <div className="brochure-buttons">
            <button type="submit" className="brochure-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Submit'}
            </button>            
          </div>
        </form>
        {showSuccess && <p className="brochure-success">Brochure sent successfully!</p>}
      </div>
    </div>
  );
};

export default BrochureForm;
