import React from 'react';
import './ConfirmModel.css';

const ConfirmModel = ({ show, title, message, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h3>{title || 'Are you sure?'}</h3>
        <p>{message || 'This action cannot be undone.'}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;
