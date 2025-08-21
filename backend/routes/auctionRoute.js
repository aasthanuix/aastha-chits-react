import express from "express";
import Auction from "../models/auctionModel.js";
import {
  getAllAuctionsPublic,
  getAuctions,
  getRecentAuctions,
  createAuction,
  updateAuction,
  endAuction,
  deleteAuction,
} from "../controllers/auctionController.js";
import {  protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/public", getAllAuctionsPublic);
router.get("/recent", protect, getRecentAuctions);

// Admin-only routes
router.get("/", protect, getAuctions);
  
router.post("/", protect, createAuction);
router.patch('/:id/end', protect, endAuction);
router.patch('/:id', protect, updateAuction);
router.delete("/:id", protect, deleteAuction);

export default router;
