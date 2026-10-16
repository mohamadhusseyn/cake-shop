const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'شماره موبایل الزامی است'],
      unique: true,
      trim: true,
      match: [/^09\d{9}$/, 'شماره موبایل باید ۱۱ رقم بوده و با ۰۹ شروع شود (مانند ۰۹۱۲۳۴۵۶۷۸۹)'],
      index: true
    },
    name: {
      type: String,
      trim: true,
      default: 'کاربر گرامی'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      select: false // برای امنیت در کوئری‌های عادی برگردانده نمی‌شود
    },
    otpCode: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    },
    addresses: [
      {
        city: {
          type: String,
          enum: ['آبادان', 'خرمشهر', 'Abadan', 'Khorramshahr'],
          required: true
        },
        neighborhood: { type: String, trim: true },
        street: { type: String, trim: true },
        fullAddress: { type: String, required: true, trim: true },
        postalCode: { type: String, trim: true },
        isDefault: { type: Boolean, default: false }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/**
 * ایجاد کد تایید ۵ رقمی یکبار مصرف با اعتبار ۲ دقیقه
 */
userSchema.methods.generateOTP = function () {
  // تولید کد ۵ رقمی تصادفی
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  this.otpCode = code;
  // اعتبار ۲ دقیقه پس از ایجاد
  this.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
  return code;
};

/**
 * اعتبارسنجی کد یکبار مصرف
 * @param {string} code
 * @returns {boolean}
 */
userSchema.methods.verifyOTP = function (code) {
  if (!this.otpCode || !this.otpExpiry) {
    return false;
  }

  const isExpired = Date.now() > new Date(this.otpExpiry).getTime();
  if (isExpired) {
    return false;
  }

  const isValid = this.otpCode.toString().trim() === code.toString().trim();
  if (isValid) {
    this.otpCode = null;
    this.otpExpiry = null;
    this.isVerified = true;
  }

  return isValid;
};

/**
 * مقایسه پسورد (ویژه حساب مدیران)
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// هش کردن رمز عبور قبل از ذخیره
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
