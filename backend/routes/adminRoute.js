import express from 'express';
import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import  {protect} from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';
import {getAdminStats} from '../controllers/adminController.js'
import User from '../models/userModel.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', protect, async (req, res) => {
  if (req.userType !== 'admin') 
    return res.status(403).json({ message: 'Admins only' });

  const admin = req.user; // already fetched in middleware
  res.json({
    name: admin.name,
    email: admin.email,
    role: 'Super Admin',
    avatar: admin.avatar ? `${req.protocol}://${req.get('host')}/${admin.avatar}` : ''
  });
});


// Update Admin Profile
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) admin.password = req.body.password;
    if (req.file) admin.avatar = `uploads/avatars/${req.file.filename}`;

    const updatedAdmin = await admin.save();

    res.json({
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: 'Super Admin',
      avatar: updatedAdmin.avatar ? `${req.protocol}://${req.get('host')}/${updatedAdmin.avatar}` : ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

router.post('/:id/transactions', protect, async (req, res) => {
  try {
    const { amount, status } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const transaction = { amount, date: new Date(), status: status || 'Pending' };

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.transactions.push(transaction);
    await user.save();

    res.status(201).json({
      message: 'Transaction added by admin',
      transactions: user.transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
});


router.get('/stats', protect, getAdminStats);

export default router;

