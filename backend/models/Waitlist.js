const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'شماره موبایل الزامی است'],
      trim: true,
      match: [/^09\d{9}$/, 'شماره موبایل نامعتبر است']
    },
    name: {
      type: String,
      trim: true,
      default: 'علاقه‌مند به شیرینی خانگی'
    },
    requestedDate: {
      type: Date,
      default: null
    },
    preferredCategory: {
      type: String,
      enum: ['cake', 'bread', 'cookie', 'pastry', 'any'],
      default: 'any'
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'notified', 'fulfilled'],
      default: 'pending'
    },
    notifiedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Waitlist', waitlistSchema);
