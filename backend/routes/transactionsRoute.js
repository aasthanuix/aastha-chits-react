import express from 'express';
import { addTransaction, updateTransactionStatus, deleteTransaction, getAllTransactions } from '../controllers/transactionController.js';
import {protect}  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:userId', protect, addTransaction);
router.patch('/:txnId/status', protect, updateTransactionStatus);
router.delete('/:txnId', protect, deleteTransaction);
router.get('/', protect, getAllTransactions); 

export default router;
