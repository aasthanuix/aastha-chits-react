import React from 'react';
import { useState, useEffect } from 'react';
import { FiPhoneCall, FiMail, FiMapPin } from 'react-icons/fi';
import { HiOutlineChatBubbleLeftRight  } from 'react-icons/hi2';
import { FaRegEnvelope } from 'react-icons/fa';

import arrowImg from '../../assets/images/icon/arrow.svg'

const Contact = () => {

 const [formData, setFormData] = useState({
    firstName: "",
    contactNumber: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  // Clear status after 4 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
        setStatusType("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setStatusType("success"); // make sending green

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setStatusType("success");
        setFormData({
          firstName: "",
          contactNumber: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        const data = await res.json();
        setStatus(`Failed to send: ${data.message || "Try again."}`);
        setStatusType("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error sending message.");
      setStatusType("error");
    }
  };

  return (
    <section className="section-area bg-light section-sp1 pt-5">
      <div className="container">
        <div className="row align-items-xl-end">
          <div className="col-lg-6 mb-4">
            <div className="row g-2 pe-xl-3">
              <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="featured-bx5">
                  <div className="featured-content">
                    <h5 className="featured-title">Call us</h5>
                    <p>Call us (except Tuesday)</p>
                  </div>
                  <div className="featured-text-icon">
                     <FiPhoneCall className="text-primary me-2" style={{width:40, height: 28}}/>
                    <p className="text">+91 76769 73099</p>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
                <div className="featured-bx5">
                  <div className="featured-content">
                    <h5 className="featured-title">Chat Us</h5>
                    <p>Chat with our team (except Tuesday)</p>
                  </div>
                  <div className="featured-text-icon">
                    <HiOutlineChatBubbleLeftRight className="text-primary me-2" style={{width:40, height: 28}}/>
                    <p className="text">+91 76769 73099</p>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div className="featured-bx5">
                  <div className="featured-content">
                    <h5 className="featured-title">Supports</h5>
                    <p>We’re here to help</p>
                  </div>
                  <div className="featured-text-icon">
                    <FaRegEnvelope   className="text-primary " style={{width:40, height: 28}}/>
                    <p href="mailto:aasthachits369@gmail.com" className="text">aasthachits369@gmail.com</p>                    
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-delay="0.4s">
                <div className="featured-bx5">
                  <div className="featured-content">
                    <h5 className="featured-title">Visit us</h5>
                    <p>Visit our office </p>
                  </div>
                  <div className="featured-text-icon">
                    <FiMapPin className="text-primary me-2" style={{width:40, height: 28}}/>
                    <p className="text"> Chandra Layout, Bengaluru, Karnataka 560040</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="form-card contact-form-card wow fadeInUp" data-wow-delay="0.5s">
            <form className="ajax-form m-auto" onSubmit={handleSubmit}>
      <div className="heading-bx style1">
        <h2 className="title-head-sm mb-0">Contact our Friendly Team</h2>
        <p className="text-primary" style={{ fontSize: 16 }}>Let us know how we can help.</p>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              placeholder="Your name..."
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              id="contactNumber"
              placeholder="Contact number..."
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email address..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              className="form-control"
              id="subject"
              placeholder="Type here..."
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group advance-input">
            <label htmlFor="message">Message</label>
            <textarea
              rows="4"
              className="form-control"
              id="message"
              placeholder="Leave us a message..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary btn-lg btn-standard">
            Submit Now
            <span className="btn-icon bg-secondary-500">
              <img src={arrowImg} alt="arrow" />
            </span>
          </button>
        </div>
      </div>

      <div className="ajax-message">
        {status && (
          <p className={statusType === "success" ? "message-success" : "message-error"}>
            {status}
          </p>
        )}
      </div>
    </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
