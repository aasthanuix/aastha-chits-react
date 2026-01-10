import express from 'express';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import upload from "../middlewares/upload.js";
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addUser,
  getUserDashboard,
  getUserById,
  updateUser,
  uploadProfilePic,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
// import uploadProfilePic from '../config/userProfile.js';

const router = express.Router();

//  Initialize Resend properly
const resend = new Resend(process.env.RESEND_API_KEY);

// JWT Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// ================= USER LOGIN =================
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId }).populate('enrolledChits');
    if (!user) return res.status(401).json({ message: 'Invalid User ID or Password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid User ID or Password' });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ GENERATE CREDENTIALS + EMAIL ============
router.post('/generate-credentials', protect, async (req, res) => {
  try {
    const { name, email, phone, enrolledChits = [] } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Generate userId and password
    const userId = `USR${Math.floor(1000 + Math.random() * 9000)}`;
    const password = Math.random().toString(36).slice(-8);

    // Validate enrolledChits
    const chitPlanIds = [];
    for (const chit of enrolledChits) {
      let plan;
      if (mongoose.Types.ObjectId.isValid(chit)) {
        plan = await ChitPlan.findById(chit);
      } else {
        plan = await ChitPlan.findOne({ planName: chit });
      }
      if (plan) chitPlanIds.push(plan._id);
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      userId,
      password,
      enrolledChits: chitPlanIds,
    });

    res.status(201).json({
      success: true,
      message: 'Credentials generated successfully',
      userId,
      password,
      enrolledChits: chitPlanIds,
    });

  } catch (error) {
    console.error('Error generating credentials:', error);
    res.status(500).json({
      message: 'Failed to generate credentials',
      error: error.message || error.toString(),
    });
  }
});

// ================= CRUD Routes =================

// CREATE USER (ADMIN ONLY)
router.post('/', protect, addUser);

// GET USER DASHBOARD (AUTH)
router.get('/dashboard', protect, getUserDashboard);

// GET ALL USERS (ADMIN ONLY)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().populate('enrolledChits').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET SINGLE USER BY ID
router.get('/:id', protect, getUserById);

// UPDATE USER
router.put('/:id', protect, updateUser);

// DELETE USER (ADMIN ONLY)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// UPLOAD PROFILE PIC
router.post(
  "/profile-pic",
  protect,
  upload.single("profilePic"),
  uploadProfilePic
);

// Forgot/Reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
