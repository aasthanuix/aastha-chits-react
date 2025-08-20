import mongoose from 'mongoose';

const chitPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  monthlySubscription: { type: Number, required: true },
  minBidding: { type: Number, required: true },
  maxBidding: { type: Number, required: true },
  duration: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  image: { type: String },

}, { timestamps: true });

const chitPlanModel = mongoose.models.chitPlans || mongoose.model('ChitPlan', chitPlanSchema);

export default chitPlanModel;
