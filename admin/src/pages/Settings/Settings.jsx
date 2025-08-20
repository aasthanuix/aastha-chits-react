import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    companyName: 'Aastha Chits',
    supportEmail: 'support@aasthachits.com',
    phoneNumber: '',
    website: '',
    theme: 'light',
    language: 'English',
    maintenanceMode: false,
    enable2FA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h2>Admin Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <section>
          <h3>General Settings</h3>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
          />
          <input
            type="email"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            placeholder="Support Email"
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website URL"
          />
        </section>

        <section>
          <h3>Admin Preferences</h3>
          <label>
            Theme:
            <select name="theme" value={formData.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label>
            Language:
            <select name="language" value={formData.language} onChange={handleChange}>
              <option>English</option>
              <option>Hindi</option>
              <option>Tamil</option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              name="enable2FA"
              checked={formData.enable2FA}
              onChange={handleChange}
            />
            Enable Two-Factor Authentication
          </label>
        </section>

        <section>
          <h3>System Settings</h3>
          <label>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
            />
            Enable Maintenance Mode
          </label>
        </section>

        <section className="danger-zone">
          <h3>Danger Zone</h3>
          <button type="button" className="danger-btn" onClick={() => alert('App data reset initiated!')}>
            Reset App Data
          </button>
          <button type="button" className="danger-btn" onClick={() => alert('All users deleted!')}>
            Delete All Users
          </button>
        </section>

        <button type="submit" className="save-btn">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
