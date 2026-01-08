import ChitPlan from '../models/chitPlanModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getChitPlans = async (_req, res) => {
  try {
    const plans = await ChitPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
};

export const getChitPlanById = async (req, res) => {
  try {
    const plan = await ChitPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error });
  }
};

export const createChitPlan = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'chitplans' });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const numericFields = ['monthlySubscription', 'minBidding', 'maxBidding', 'duration', 'totalAmount'];
    numericFields.forEach(field => {
      if (req.body[field] !== undefined) req.body[field] = Number(req.body[field]);
    });

    const newPlan = await ChitPlan.create({ ...req.body, image: imageUrl });
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Create Plan Error:', error);
    res.status(500).json({ message: 'Error creating plan', stack: error.stack });
  }
};

import streamifier from 'streamifier';

export const updateChitPlan = async (req, res) => {
  try {
    const plan = await ChitPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Upload image if file exists
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'chitplans' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      plan.image = uploadResult.secure_url;
    }

    // Update numeric fields
    const numericFields = [
      'monthlySubscription',
      'minBidding',
      'maxBidding',
      'duration',
      'totalAmount',
    ];
    numericFields.forEach((field) => {
      if (req.body[field] !== undefined) plan[field] = Number(req.body[field]);
    });

    // Update other fields
    if (req.body.planName !== undefined) plan.planName = req.body.planName;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    console.error('Update Plan Error:', error);
    res.status(500).json({ message: 'Error updating plan', error: error.message });
  }
};

export const deleteChitPlan = async (req, res) => {
  try {
    const deletedPlan = await ChitPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
};

export const getPlanUsers = async (req, res) => {
  try {
    const planId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ success: false, message: 'Invalid plan ID' });
    }

    const users = await User.find({ enrolledChits: planId }).select('name email');

    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching plan users:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
