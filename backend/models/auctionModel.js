// models/Auction.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const AuctionUpdateSchema = new Schema(
  {
    type: { type: String, enum: ['created', 'status', 'bid', 'message', 'closed'], required: true },
    message: { type: String },
    payload: { type: Schema.Types.Mixed },
    by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const AuctionSchema = new Schema(
  {
    chitPlanId: { type: Schema.Types.ObjectId, ref: 'ChitPlan', required: true },
    chitPlanName: { type: String, required: true },

    startingAmount: { type: Number, required: true },
    currentAmount: { type: Number, required: true },

    auctionDate: { type: Date, required: true },

    status: { type: String, enum: ['scheduled', 'live', 'ended', 'closed'], default: 'live', index: true },

    highestBidder: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    lastBidAt: { type: Date },

    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    updates: [AuctionUpdateSchema],
  },
  { timestamps: true }
);

AuctionSchema.index({ chitPlanId: 1 });
AuctionSchema.index({ status: 1, auctionDate: 1 });

export default mongoose.model('Auction', AuctionSchema);
