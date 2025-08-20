import Auction from "../models/auctionModel.js";
import ChitPlan from "../models/chitPlanModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

// Helper to get io from request (we attach it in middleware)
const getIO = (req) => req.app.get("io");

// Public: Get all auctions
export const getAllAuctionsPublic = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    console.error("Get All Auctions Error:", error);
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
};

// Example controller for GET /api/auctions
export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("highestBidder", "name email") 
      .populate("chitPlanId", "planName");

    const formatted = auctions.map(a => ({
      _id: a._id,
      chitPlanId: a.chitPlanId?._id || null,   
      chitPlanName: a.chitPlanId?.planName || a.chitPlanName,
      startingAmount: a.startingAmount,
      currentAmount: a.currentAmount,
      auctionDate: a.auctionDate,
      status: a.status,
      highestBidderName: a.highestBidder?.name || null,
      highestBidderEmail: a.highestBidder?.email || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching auctions" });
  }
};

// Protected route for logged-in users
export const getRecentAuctions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("enrolledChits", "_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const planIds = user.enrolledChits.map(plan => plan._id);

    const auctions = await Auction.find({
      chitPlanId: { $in: planIds }
    })
      .sort({ createdAt: -1 })
      .populate("chitPlanId", "planName _id") 
      .populate("highestBidder", "name email");

    const formattedAuctions = auctions.map(auction => ({
      _id: auction._id,
      chitPlanId: auction.chitPlanId?._id || null,   
      chitPlanName: auction.chitPlanId?.planName || auction.chitPlanName,
      startingAmount: auction.startingAmount,
      currentAmount: auction.currentAmount,
      auctionDate: auction.auctionDate,
      status: auction.status,
      highestBidderName: auction.highestBidder?.name || null,
      highestBidderEmail: auction.highestBidder?.email || null,
      createdAt: auction.createdAt,
      updates: auction.updates
    }));

    res.json(formattedAuctions);
  } catch (error) {
    console.error("Get Recent Auctions Error:", error);
    res.status(500).json({ message: "Error fetching recent auctions" });
  }
};

// Admin: Create auction
export const createAuction = async (req, res) => {
  try {
    const { chitPlanId, startingAmount, auctionDate } = req.body;

    // Validation
    if (!chitPlanId || startingAmount == null || !auctionDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get plan
    const plan = await ChitPlan.findById(chitPlanId);
    if (!plan) {
      return res.status(404).json({ message: "Chit plan not found" });
    }

    // Create auction
    const auction = new Auction({
      chitPlanId: plan._id,
      chitPlanName: plan.planName,
      startingAmount: Number(startingAmount),
      currentAmount: Number(startingAmount),
      auctionDate,
      createdBy: req.user._id,
      status: "live",
      updates: [
        {
          type: "created",
          message: `Auction created for ${plan.planName} at ₹${startingAmount}`,
          by: req.user._id,
        },
      ],
    });

    await auction.save();

    // Emit socket event to all clients subscribed to auctions
    const io = getIO(req);
    if (io) {
      io.to("auctions:all").emit("newAuction", auction);
    }

    res.status(201).json({
      success: true,
      auction,
    });
  } catch (error) {
    console.error("Create Auction Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating auction",
      error: error.message,
    });
  }
};

// Admin: Update auction amount and highest bidder
export const updateAuction = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { currentAmount, highestBidder } = req.body;

    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Validate currentAmount
    if (currentAmount !== undefined) {
      const amountNum = Number(currentAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ message: "Invalid currentAmount" });
      }
      auction.currentAmount = amountNum;
      auction.lastBidAt = new Date();
    }

    // Validate highestBidder
    if (highestBidder) {
      if (!mongoose.Types.ObjectId.isValid(highestBidder)) {
        return res.status(400).json({ message: "Invalid highestBidder ID" });
      }
      const user = await User.findById(highestBidder);
      if (!user) return res.status(404).json({ message: "Highest bidder not found" });

      auction.highestBidder = highestBidder;
    }

    // Record update
    auction.updates.push({
      type: "bid",
      message: `Updated amount: ₹${auction.currentAmount}, Highest bidder: ${highestBidder || auction.highestBidder}`,
      by: req.user._id,
      payload: { currentAmount: auction.currentAmount, highestBidder: auction.highestBidder },
    });

    await auction.save();

    // Emit event to users of this plan only
    const planUsers = await User.find({ enrolledPlans: auction.chitPlanId }, "_id");
    const io = req.app.get("io");
    if (io) {
      planUsers.forEach((user) => {
        io.to(`user:${user._id}`).emit("auctionUpdated", auction);
      });
    }

    res.json(auction);
  } catch (error) {
    console.error("Update Auction Error:", error);
    res.status(500).json({ message: "Error updating auction", error: error.message });
  }
};

// Admin: End auction
export const endAuction = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status === "ended" || auction.status === "closed") {
      return res.status(400).json({ message: "Auction has already ended" });
    }

    auction.status = "ended";
    auction.updates.push({
      type: "closed",
      message: `Auction ended at ₹${auction.currentAmount}`,
      by: req.user._id,
    });

    await auction.save();

    // Emit event to notify users
    const io = req.app.get("io");
    if (io) io.to(`auction:${auction._id}`).emit("auctionEnded", auction);
    if (io) io.to("auctions:all").emit("auctionEnded", auction);

    res.json(auction);
  } catch (error) {
    console.error("End Auction Error:", error);
    res.status(500).json({ message: "Error ending auction", error: error.message });
  }
};


// Admin: Delete auction
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json({ message: "Auction deleted" });
  } catch (error) {
    console.error("Delete Auction Error:", error);
    res.status(500).json({ message: "Error deleting auction", error: error.message });
  }
};
