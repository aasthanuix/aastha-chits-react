// models/Brochure.js
import mongoose from "mongoose";

const brochureSchema = new mongoose.Schema({
  title: String,
  fileUrl: String, // Cloudinary secure_url
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Brochure", brochureSchema);

