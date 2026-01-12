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
  changePassword,
} from '../controllers/userController.js';
import { sendCredentialEmail } from "../utils/emailService.js";
import { sendWhatsAppCredentials } from "../utils/whatsappService.js";

const router = express.Router();

// JWT Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// ================= USER LOGIN =================
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId }).populate('enrolledChits');
    if (!user) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    // 🔥 THIS IS THE MISSING BUSINESS LOGIC
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// ============ GENERATE CREDENTIALS + EMAIL ============
router.post("/generate-credentials", protect, async (req, res) => {
  try {
    const { name, email, phone, enrolledChits = [] } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random credentials
    const userId = `USR${Math.floor(1000 + Math.random() * 9000)}`;
    const password = Math.random().toString(36).slice(-8);

    // Validate and map chit plans
    const chitIds = [];
    for (const chit of enrolledChits) {
      if (mongoose.Types.ObjectId.isValid(chit)) {
        chitIds.push(chit);
      } else {
        const plan = await ChitPlan.findOne({ planName: chit });
        if (plan) chitIds.push(plan._id);
      }
    }

    // Create user in DB
    await User.create({
      name,
      email,
      phone,
      userId,
      password,
      enrolledChits: chitIds,
    });

    // Send email + WhatsApp
    const delivery = { email: false, whatsapp: false };

    try {
      await sendCredentialEmail({ name, email, userId, password });
      delivery.email = true;
    } catch (e) {
      console.error("Email failed:", e.message);
    }

    try {
      await sendWhatsAppCredentials({ name, phone, userId, password });
      delivery.whatsapp = true;
    } catch (e) {
      console.error("WhatsApp failed:", e.message);
    }

    // Return credentials and delivery info to frontend
    res.status(201).json({
      success: true,
      message: "Credentials generated successfully",
      userId,
      password,
      delivery,
    });
  } catch (error) {
    console.error("Generate Credentials Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET USER DASHBOARD (AUTH)
router.get('/dashboard', protect, getUserDashboard);

router.put('/change-password', protect, changePassword);

// UPLOAD PROFILE PIC
router.post(
  "/profile-pic",
  protect,
  upload.single("profilePic"),
  uploadProfilePic
);

// CREATE USER (ADMIN ONLY)
router.post('/', protect, addUser);

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

export default router;
