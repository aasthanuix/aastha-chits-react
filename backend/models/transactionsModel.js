import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  chitPlan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChitPlan', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
