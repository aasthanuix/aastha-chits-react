import Transaction from '../models/transactionsModel.js'; 
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';

export const addTransaction = async (req, res) => {
  try {
    const { chitPlanId, amount, date } = req.body;
    const { userId } = req.params;

    if (!chitPlanId || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const chitPlan = await ChitPlan.findById(chitPlanId);
    if (!chitPlan) return res.status(404).json({ message: 'Chit Plan not found' });

    const transaction = new Transaction({
      user: userId,
      chitPlan: chitPlanId,
      amount,
      date,
      status: 'Pending',
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Flexible status update controller
export const updateTransactionStatus = async (req, res) => {
  try {
    const { txnId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Paid', 'Failed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const transaction = await Transaction.findById(txnId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = status;
    await transaction.save();

    res.json({ message: `Transaction marked as ${status}`, transaction });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// DELETE /api/transactions/:txnId
export const deleteTransaction = async (req, res) => {
  try {
    const { txnId } = req.params;
    const deleted = await Transaction.findByIdAndDelete(txnId);
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('chitPlan', 'planName totalAmount')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
