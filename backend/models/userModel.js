import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    userId: { type: String, unique: true },
    enrolledChits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChitPlan' }],
    profilePic: { type: String, default: '' },
    isActive: { type: Boolean, default: false }, // for active users
    lastLogin: { type: Date }, // optional, track last login
  },
  { timestamps: true }
);

// ---------------- Hash Password ----------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------------- Compare Password ----------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ---------------- Update lastLogin ----------------
userSchema.methods.updateLogin = async function () {
  this.lastLogin = new Date();
  this.isActive = true;
  await this.save();
};

// ---------------- Mark Inactive ----------------
userSchema.methods.markInactive = async function () {
  this.isActive = false;
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
