import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import Transaction from '../models/transactionsModel.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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
      totalChits,
      totalTransactions,

      monthlyTransactions,
      monthlyUsers,

      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      ChitPlan.countDocuments(),
      Transaction.countDocuments(),

      // Monthly transaction totals
      Transaction.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              year: { $year: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),

      // Monthly user growth
      User.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),

      // Recent activity feed
      Transaction.find()
        .sort({ date: -1 })
        .limit(10)
        .populate("user", "name")
        .select("amount status date")
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      totalChits,
      monthlyTransactions,
      monthlyUsers,
      recentActivity: recentActivity.map(tx => ({
        userName: tx.user?.name || "User",
        amount: tx.amount,
        status: tx.status,
        date: tx.date
      }))
    });
  } catch (error) {
    console.error("[getAdminStats] Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard analytics" });
  }
};

export const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
