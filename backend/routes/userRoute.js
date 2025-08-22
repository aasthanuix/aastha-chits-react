import express from 'express';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addUser,
  getUserDashboard,
  getUserById,
  updateUser,
  uploadUserProfilePic,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import uploadProfilePic from '../config/userProfile.js';

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

    // generate userId and password
    const userId = `USR${Math.floor(1000 + Math.random() * 9000)}`;
    const password = Math.random().toString(36).slice(-8);

    // validate enrolledChits (convert names/ids to ObjectIds)
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

    // create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      userId,
      password,
      enrolledChits: chitPlanIds,
    });

   
    const emailRes = await resend.emails.send({
      from: process.env.EMAIL_FROM, 
      to: [email],
      subject: 'Your Aastha Chits Login Credentials',
      html: `
        <h2>Welcome to Aastha Chits, ${name}!</h2>
        <p>Your account has been created successfully. Here are your login details:</p>
        <ul>
          <li><strong>User ID:</strong> ${userId}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>You can now log in and start using our platform.</p>
        <br/>
        <p>Best regards,<br/>Aastha Chits Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Credentials generated and emailed successfully',
      userId,
      password,
      enrolledChits: chitPlanIds,
      emailResponse: emailRes, // helpful for debugging
    });
  } catch (error) {
    console.error('Error generating credentials:', error);

    res.status(500).json({
      message: 'Failed to generate credentials',
      error: error.message || error.toString(),
      stack: error.stack,
      details: error.response?.body || error.response || null,
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
router.post('/profile-pic', protect, uploadProfilePic.single('profilePic'), uploadUserProfilePic);

// Forgot/Reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
