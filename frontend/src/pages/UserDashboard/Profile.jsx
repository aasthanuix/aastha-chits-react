import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';

const Profile = ({url}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(url+'/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUser(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error fetching user');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPG or PNG images are allowed');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url+'/api/users/profile-pic', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');

      await fetchUser(); 
      setError('');
    } catch (err) {
      setError(err.message || 'Error uploading profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-pic-section">
        <img src={user.profilePic
            ? `${url}/${user.profilePic}`
            : '/default-user.png'
            }
          alt={`${user.name} profile`}
          className="profile-pic"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          ref={fileInputRef}
        />
        {uploading && <p>Uploading...</p>}
      </div>

      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
    </div>
  );
};

export default Profile;
