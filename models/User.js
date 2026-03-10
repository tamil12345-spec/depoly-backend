// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    resetPasswordToken:   { type: String,  select: false },
    resetPasswordExpire:  { type: Date,    select: false },
    isVerified:           { type: Boolean, default: false },
    lastLogin:            { type: Date },
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ── Instance method: generate & hash reset token ─────────────
UserSchema.methods.getResetPasswordToken = function () {
  // Plain token (sent in email)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hashed token (stored in DB)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expires in 15 minutes
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // return PLAIN token for the email link
};

module.exports = mongoose.model('User', UserSchema);
