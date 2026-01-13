import express from 'express';
import { uploadBrochure, downloadBrochure } from '../controllers/brochureController.js';
import  upload  from '../middlewares/upload.js';

const router = express.Router();

console.log('Brochure routes loaded!');

// Upload brochure
router.post('/admin/upload-brochure', upload.single('brochure'), uploadBrochure);
router.get('/send-brochure', downloadBrochure)

export default router;
