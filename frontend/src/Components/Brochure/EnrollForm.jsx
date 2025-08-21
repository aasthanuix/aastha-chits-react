import React, { useState, useEffect } from "react";
import "./EnrollForm.css";

const EnrollForm = ({ isOpen, onClose, selectedPlan, url }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Simple email regex for validation
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Simple phone validation: 10 digits 
  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate fields
  if (!formData.name.trim()) {
    setStatus("Please enter your full name.");
    setStatusType("error");
    return;
  }
  if (!isValidEmail(formData.email)) {
    setStatus("Please enter a valid email address.");
    setStatusType("error");
    return;
  }
  if (!isValidPhone(formData.phone)) {
    setStatus("Please enter a valid 10-digit phone number.");
    setStatusType("error");
    return;
  }

  setStatus("Sending...");
  setStatusType("success");  

  try {
    const res = await fetch(url+"/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        plan: selectedPlan
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Form submitted successfully!");
      setStatusType("success");
      setFormData({ name: "", email: "", phone: "" });
    } else {
      setStatus(`Failed to send: ${data.message || "Try again."}`);
      setStatusType("error");
    }
  } catch (err) {
    console.error(err);
    setStatus("Error sending form.");
    setStatusType("error");
  }
};


  return (
    <div className="enroll-overlay">
      <div className="enroll-modal">
        <button className="enroll-close" onClick={onClose}>×</button>
        <h2 className="enroll-title">Enroll in {selectedPlan}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="enroll-input"
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="enroll-input"
            placeholder="Email"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="enroll-input"
            placeholder="Phone Number"
            required
          />
          <div className="enroll-buttons">
            <button type="submit" className="enroll-submit">Submit</button>
          </div>
        </form>
        {status && (
          <p
            className={`enroll-message ${
              statusType === "success"
                ? "enroll-success"
                : statusType === "error"
                ? "enroll-error"
                : ""
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnrollForm;
