import express from 'express';
import multer from 'multer';
import  {protect}  from '../middlewares/authMiddleware.js';
import ChitPlan from '../models/chitPlanModel.js';
import {getUsersOfChitPlan, getChitPlanByIdOrName } from '../controllers/userController.js'

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Public: Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await ChitPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
});

// Protected: Add new plan
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { planName, monthlySubscription, minBidding, maxBidding, duration, totalAmount } = req.body;

    const newPlan = new ChitPlan({
      planName,
      monthlySubscription,
      minBidding,
      maxBidding,
      duration,
      totalAmount,
      image: req.file ? req.file.filename : null,
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error });
  }
});

// Protected: Update plan
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    };

    Object.keys(updatedData).forEach((key) => updatedData[key] === undefined && delete updatedData[key]);

    const updatedPlan = await ChitPlan.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan', error });
  }
});

// Protected: Delete plan
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedPlan = await ChitPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
});

// get chit plan by ID
router.get('/:id', protect, getChitPlanByIdOrName);

router.get('/:id/users', protect, getUsersOfChitPlan );

export default router;
