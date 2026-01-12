import Transaction from '../models/transactionsModel.js'; 
import User from '../models/userModel.js';
import ChitPlan from '../models/chitPlanModel.js';
import { sendTransactionEmail } from "../utils/emailService.js";

export const addTransaction = async (req, res) => {
  try {
    const { chitPlanId, amount, date } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    const chitPlan = await ChitPlan.findById(chitPlanId);

    if (!user || !chitPlan) {
      return res.status(404).json({ message: "User or Plan not found" });
    }

    const transaction = await Transaction.create({
      user: userId,
      chitPlan: chitPlanId,
      amount,
      date,
      status: "Pending",
    });

    // 🔔 SEND EMAIL
    await sendTransactionEmail({
      userEmail: user.email,
      userName: user.name,
      planName: chitPlan.planName,
      amount,
      status: "Pending",
      date,
    });

    res.status(201).json({
      message: "Transaction added and email sent",
      transaction,
    });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Flexible status update controller
export const updateTransactionStatus = async (req, res) => {
  try {
    const { txnId } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findById(txnId)
      .populate("user")
      .populate("chitPlan");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    // 🔔 SEND EMAIL
    await sendTransactionEmail({
      userEmail: transaction.user.email,
      userName: transaction.user.name,
      planName: transaction.chitPlan.planName,
      amount: transaction.amount,
      status,
      date: transaction.date,
    });

    res.json({
      message: `Transaction marked as ${status} and email sent`,
      transaction,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
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
