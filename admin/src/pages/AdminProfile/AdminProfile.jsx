import React, { useState, useEffect } from 'react';
import './AdminProfile.css';
import defaultAvatar from '../../assets/images/default-admin.png';

const AdminProfile = ({ url }) => {
  const [admin, setAdmin] = useState({
    name: 'Admin User',
    email: 'admin@aasthachits.com',
    role: 'Super Admin',
    avatar: defaultAvatar,
  });

  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    password: '',
    confirmPassword: '',
    avatar: admin.avatar,
    avatarFile: null,
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: preview, avatarFile: file }));
    }
  };

  // Show temporary message
  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    setTimeout(() => setMessage(''), 3000);
  };

  // Fetch Admin Profile
  const fetchAdminProfile = async () => {
    try {
      // Use admin-specific token
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Admin not logged in');

      const res = await fetch(`${url}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setAdmin(data);
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          confirmPassword: '',
          avatar: data.avatar || defaultAvatar,
          avatarFile: null,
        });
      } else {
        showMessage(data.message || 'Failed to fetch profile', false);
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err.message);
      showMessage('Error fetching profile', false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match.', false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Admin not logged in');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (formData.password) formDataToSend.append('password', formData.password);
      if (formData.avatarFile) formDataToSend.append('avatar', formData.avatarFile);

      const res = await fetch(`${url}/api/admin/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setAdmin(data);
        showMessage('Profile updated successfully!', true);
      } else {
        showMessage(data.message || 'Failed to update profile', false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('Error updating profile', false);
    }
  };

  return (
    <div className="admin-profile-container">
      <h2 className="profile-title">Admin Profile</h2>

      {/* Profile Display */}
      <div className="admin-info-card">
        <img src={admin.avatar} alt="Admin Profile" className="admin-avatar" />
        <div className="admin-details">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      </div>

      {/* Profile Update Form */}
      <form className="admin-profile-form" onSubmit={handleSubmit}>
        <h3 className="text-center">Update Profile</h3>

        <div className="avatar-upload">
          <label className="admin-profile">Change Profile</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {formData.avatar && <img src={formData.avatar} alt="Preview" className="avatar-preview" />}
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (optional)"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" className="profile-update-btn">Save Changes</button>
        {message && (
          <p className={isSuccess ? 'success-msg' : 'error-msg'}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminProfile;
