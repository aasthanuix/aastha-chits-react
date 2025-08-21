import express from 'express';
import {  sendBrochureEmail, downloadBrochure, enrollmentEmail, contactFormHandler } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-brochure', sendBrochureEmail); 
router.get("/download-brochure", downloadBrochure);
router.post('/send-email', enrollmentEmail);
router.post('/contact', contactFormHandler);

export default router;
