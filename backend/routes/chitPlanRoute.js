import express from 'express';
import {
  createChitPlan,
  getChitPlans,
  getChitPlanById,
  updateChitPlan,
  deleteChitPlan,
  getPlanUsers,
} from '../controllers/chitPlanController.js';
import upload from '../middlewares/upload.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getChitPlans);            // Get all plans
router.get('/:id', getChitPlanById);      // Get single plan by ID
router.post('/', protect, upload.single('image'), createChitPlan);
router.put('/:id', protect, upload.single('image'), updateChitPlan);
router.delete('/:id', protect, deleteChitPlan);
router.get('/:id/users', getPlanUsers);

export default router;
