import express from 'express';
import User from '../models/userModel.js';
import Transaction from '../models/transactionsModel.js';
import ChitPlan from '../models/chitPlanModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalChits = await ChitPlan.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Monthly Transactions (group by month & year)
    const monthlyTransactions = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Monthly Users (group by month & year)
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent Activity (latest 5 transactions)
    const recentActivity = await Transaction.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('user', 'name');

    res.json({
      totalUsers,
      totalChits,
      totalTransactions,
      monthlyTransactions,
      monthlyUsers,
      recentActivity: recentActivity.map(tx => ({
        userName: tx.user?.name || 'Unknown',
        amount: tx.amount,
        date: tx.date,
        status: tx.status
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;
