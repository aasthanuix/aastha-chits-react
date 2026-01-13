import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import Brochure from "../models/brochureModel.js";
// import fetch from "node-fetch"; 
import axios from 'axios';

export const uploadBrochure = async (req, res) => {
  console.log('req.file:', req.file); 
  try { 
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "brochures",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

    const result = await streamUpload(req.file.buffer);

    // ✅ Save to MongoDB
    const brochureDoc = new Brochure({
      title: req.file.originalname,
      fileUrl: result.secure_url
    });
    await brochureDoc.save();

    res.status(201).json({ message: 'Brochure uploaded', brochure: brochureDoc });
  } catch (err) {
    console.error('Upload controller error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const downloadBrochure = async (req, res) => {
  try {
    const brochure = await Brochure.findOne().sort({ uploadedAt: -1 });

    if (!brochure) {
      return res.status(404).json({ message: "No brochure available" });
    }

    res.status(200).json({
      fileUrl: brochure.fileUrl,
    });
  } catch (err) {
    console.error("Download brochure error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
