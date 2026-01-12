import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import Transaction from '../models/transactionsModel.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import { generateResetToken } from '../utils/tokenUtils.js';
import resendClient from '../config/resend.js';
import crypto from 'crypto';
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Add User with multiple chit plans
export const addUser = asyncHandler(async (req, res) => {
  const { name, email, phone, userId, enrolledChits = [] } = req.body;

  // Validate chit plans exist
  const validPlans = await ChitPlan.find({ _id: { $in: enrolledChits } });
  if (validPlans.length !== enrolledChits.length) {
    return res.status(400).json({ message: 'One or more chit plans are invalid' });
  }

  // Generate transactions for each plan
  const transactions = [];
  // validPlans.forEach(plan => {
  //   for (let i = 0; i < plan.duration; i++) {
  //     transactions.push({
  //       chitPlan: plan._id,
  //       amount: plan.monthlySubscription,
  //       date: new Date(new Date().setMonth(new Date().getMonth() + i)),
  //       status: 'Pending',
  //     });
  //   }
  // });

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    userId,
    enrolledChits,
    transactions,
  });

  res.status(201).json({
    message: 'User created successfully',
    user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, enrolledChits = [] } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Validate chit plans exist
  const validPlans = await ChitPlan.find({ _id: { $in: enrolledChits } });
  if (validPlans.length !== enrolledChits.length) {
    return res.status(400).json({ message: 'One or more chit plans are invalid' });
  }

  // Update user fields only if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Update enrolled chit plans to the new list
  user.enrolledChits = enrolledChits;

  // **Do NOT create transactions here**

  await user.save();

  res.json(user);
});

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate('enrolledChits');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ user: userId })
      .populate('chitPlan', 'planName monthlySubscription totalAmount')
      .sort({ date: -1 });

    res.json({
      ...user.toObject(),
      transactions,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "user_profiles",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        const user = await User.findByIdAndUpdate(
          req.user._id,
          { profilePic: result.secure_url },
          { new: true }
        ).select("-password");

        res.status(200).json(user);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Profile upload crash:", error);
    res.status(500).json({ message: "Profile upload failed" });
  }
};

// GET /api/chit-plans/:id/users
export const getUsersOfChitPlan = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching users for chitPlanId:", id);

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid chitPlan ID" });
    }

    const plan = await ChitPlan.findById(id);
    if (!plan) return res.status(404).json({ success: false, message: 'Chit plan not found' });

    const users = await User.find({ enrolledChits: plan._id }).select('_id name email');

    res.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    console.error("Error fetching users for chit plan:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

// GET /api/chit-plans/:id
export const getChitPlanByIdOrName = asyncHandler(async (req, res) => {
  const { idOrName } = req.params;

  let plan;

  // If valid ObjectId → search by _id
  if (/^[0-9a-fA-F]{24}$/.test(idOrName)) {
    plan = await ChitPlan.findById(idOrName);
  }

  // Otherwise search by name
  if (!plan) {
    plan = await ChitPlan.findOne({ planName: idOrName });
  }

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Chit plan not found' });
  }

  res.json({ success: true, plan });
});

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user info with enrolled chit details
    const user = await User.findById(userId)
      .select('name email phone profilePic enrolledChits')
      .populate('enrolledChits', 'planName monthlySubscription totalAmount duration');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // All transactions for the user
    const transactions = await Transaction.find({ user: userId })
      .populate('chitPlan', 'planName monthlySubscription totalAmount')
      .sort({ date: -1 });

    // Only pending transactions
    const pendingTransactions = await Transaction.find({ 
        user: userId, 
        status: 'Pending' 
      })
      .populate('chitPlan', 'planName monthlySubscription totalAmount')
      .sort({ date: -1 });

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      enrolledChits: user.enrolledChits,
      transactions,
      pendingTransactions
    });

  } catch (error) {
    console.error('Error in getUserDashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
