import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import Transaction from '../models/transactionsModel.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import { generateResetToken } from '../utils/tokenUtils.js';
import resendClient from '../config/resend.js';
import crypto from 'crypto';

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
export const uploadUserProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save relative path to database (not absolute file path)
    user.profilePic = path.posix.join('uploads/user-profiles', req.file.filename);
    await user.save();

    res.json({ message: 'Profile picture updated', profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token & expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 min expiry
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Styled HTML email
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto; border: 1px solid #eee;">
        <h2 style="color: #4CAF50; text-align: center;">Aastha Chits - Password Reset</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>We received a request to reset your password for your Aastha Chits account. Please click the button below to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Reset My Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in 30 minutes. If you did not request this, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Aastha Chits. All rights reserved.</p>
      </div>
    `;

    await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Aastha Chits - Password Reset',
      html: emailHTML
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
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



