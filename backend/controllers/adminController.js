import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import Transaction from '../models/transactionsModel.js';

import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalChits,
      totalTransactions,
      totalPendingTransactions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ enrolledChits: { $exists: true, $nin: [[], null] } }),
      ChitPlan.countDocuments(), // count all chits (no status filter)
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: { $regex: /^pending$/i } }) 
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalChits,
      totalTransactions,
      pendingTransactions: totalPendingTransactions
    });
  } catch (error) {
    console.error('[getAdminStats] Error:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics', error: error.message });
  }
};

