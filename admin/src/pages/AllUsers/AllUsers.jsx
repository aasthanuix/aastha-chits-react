import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../Components/ConfirmModel/ConfirmModel';
import './AllUsers.css';

const AllUsers = ({url}) => {
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url+'/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation modal on delete click
  const handleDeleteClick = (id) => {
    setSelectedUser(id);
    setShowConfirm(true);
  };

  // Confirm delete and remove user
  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${url}/api/users/${selectedUser}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
      }
      setShowConfirm(false);
      setSelectedUser(null);
      await fetchUsers(); // Refresh users list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page">
      <h2 className="page-title">All Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="error-msg">Error: {error}</p>}

      {!loading && !error && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Chit Plans</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.enrolledChits && user.enrolledChits.length > 0
                      ? user.enrolledChits.map((plan) => plan.planName).join(', ')
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                      title="View User"
                    >
                      View
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(user._id)}
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AllUsers;
