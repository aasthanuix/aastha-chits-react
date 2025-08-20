import ChitPlan from '../models/chitPlanModel.js';
import asyncHandler from 'express-async-handler';

export const createChitPlan = async (req, res) => {
  try {
    const { planName, monthlySubscription, minBidding, maxBidding, duration, totalAmount } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPlan = await ChitPlan.create({
      planName,
      monthlySubscription,
      minBidding,
      maxBidding,
      duration,
      totalAmount,
      image
    });

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error });
  }
};

export const getChitPlans = async (req, res) => {
  try {
    const plans = await ChitPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
};

