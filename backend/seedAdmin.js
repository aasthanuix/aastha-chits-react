import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/adminModel.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@aasthachits.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    // Create the admin
    await Admin.create({
      name: 'Super Admin',
      email: 'admin@aasthachits.com',
      password: 'chitsAdmin@123', 
    });

    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
