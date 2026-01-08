import express from "express";
import { sendEnrollMail } from "../controllers/enrollController.js";

const router = express.Router();

router.post('/send-email', sendEnrollMail);

export default router;

