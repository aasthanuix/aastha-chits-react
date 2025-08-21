import axios from 'axios';

const API = axios.create({
  baseURL: ' https://aasthachits-backend.onrender.com/api',
  withCredentials: true
});

export const adminLogin = async (email, password) => {
  const { data } = await API.post('/admin/login', { email, password });
  return data;
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Chit Plans APIs
export const getChitPlans = () => API.get('/chit-plans');
export const addChitPlan = (formData) => API.post('/chit-plans', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateChitPlan = (id, formData) => API.put(`/chit-plans/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteChitPlan = (id) => API.delete(`/chit-plans/${id}`);

// Users API
export const getUsers = () => API.get('/users');
export const addUser = (userData) => API.post('/users', userData);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Transactions API
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const updateTransactionStatus = async (req, res) => {
  try {
    const { userId, txnId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transaction = user.transactions.id(txnId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = 'Paid';
    await user.save();

    res.json({ message: 'Transaction updated successfully', transactions: user.transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error });
  }
};
