const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const smsService = require('../utils/smsService');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'persian_cake_shop_super_secret_jwt_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * تولید توکن JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    ارسال کد یکبار مصرف پیامکی برای ورود یا ثبت‌نام
 * @access  Public
 */
router.post(
  '/send-otp',
  [
    body('phone')
      .trim()
      .matches(/^09\d{9}$/)
      .withMessage('شماره موبایل باید ۱۱ رقم بوده و با ۰۹ شروع شود (مانند ۰۹۱۲۳۴۵۶۷۸۹)')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    try {
      const { phone } = req.body;

      // یافتن کاربر یا ایجاد حساب کاربری جدید
      let user = await User.findOne({ phone });
      if (!user) {
        user = new User({ phone });
      }

      // تولید کد تایید ۵ رقمی
      const otpCode = user.generateOTP();
      await user.save();

      // ارسال پیامک
      await smsService.sendOTP(phone, otpCode);

      res.status(200).json({
        success: true,
        message: 'کد تایید با موفقیت ارسال شد',
        // در محیط دولوپمنت برای راحتی تست کد را در پاسخ نیز می‌فرستیم
        devCode: process.env.NODE_ENV !== 'production' ? otpCode : undefined
      });
    } catch (error) {
      console.error('خطا در ارسال کد تایید:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در برقراری ارتباط با سامانه ارسال پیامک'
      });
    }
  }
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    بررسی کد یکبار مصرف و ورود / صدور توکن
 * @access  Public
 */
router.post(
  '/verify-otp',
  [
    body('phone').trim().matches(/^09\d{9}$/).withMessage('شماره موبایل نامعتبر است'),
    body('code').trim().isLength({ min: 5, max: 5 }).withMessage('کد تایید باید ۵ رقم باشد')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    try {
      const { phone, code } = req.body;

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'کاربری با این شماره یافت نشد. لطفا ابتدا درخواست کد تایید دهید.'
        });
      }

      const isValid = user.verifyOTP(code);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'کد تایید اشتباه است یا منقضی شده است'
        });
      }

      await user.save();

      // صدور توکن ورود
      const token = generateToken(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'ورود موفقیت‌آمیز بود',
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('خطا در بررسی کد OTP:', error);
      res.status(500).json({
        success: false,
        message: 'خطای سرور در تایید کد'
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    دریافت پروفایل کاربر وارد شده
 * @access  Private (Bearer Token)
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        phone: req.user.phone,
        name: req.user.name,
        role: req.user.role,
        isVerified: req.user.isVerified,
        addresses: req.user.addresses,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات کاربری'
    });
  }
});

/**
 * @route   PUT /api/auth/me
 * @desc    به‌روزرسانی اطلاعات پروفایل کاربر
 * @access  Private
 */
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, addresses } = req.body;
    if (name) req.user.name = name;
    if (addresses && Array.isArray(addresses)) {
      req.user.addresses = addresses;
    }

    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'اطلاعات با موفقیت به‌روزرسانی شد',
      user: {
        id: req.user._id,
        phone: req.user.phone,
        name: req.user.name,
        addresses: req.user.addresses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پروفایل'
    });
  }
});

/**
 * @route   POST /api/auth/admin-login
 * @desc    ورود ادمین با نام کاربری و رمز عبور
 * @access  Public
 */
router.post(
  '/admin-login',
  [
    body('username').trim().notEmpty().withMessage('نام کاربری الزامی است'),
    body('password').notEmpty().withMessage('رمز عبور الزامی است')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    try {
      const { username, password } = req.body;

      const adminUser = process.env.ADMIN_USERNAME || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123456';

      // بررسی لاگین بر اساس متغیرهای محیطی یا دیتابیس
      let isValidAdmin = username === adminUser && password === adminPass;

      // جستجو در دیتابیس در صورتی که کاربر ادمین ثبت شده باشد
      let dbAdmin = null;
      if (!isValidAdmin) {
        dbAdmin = await User.findOne({
          $or: [{ phone: username }, { name: username }],
          role: 'admin'
        }).select('+password');

        if (dbAdmin && dbAdmin.password) {
          isValidAdmin = await dbAdmin.comparePassword(password);
        }
      }

      if (!isValidAdmin) {
        return res.status(401).json({
          success: false,
          message: 'نام کاربری یا رمز عبور اشتباه است'
        });
      }

      // در صورت لاگین با env، کاربر ادمین را در دیتابیس تضمین می‌کنیم
      if (!dbAdmin) {
        dbAdmin = await User.findOne({ role: 'admin' });
        if (!dbAdmin) {
          dbAdmin = await User.create({
            phone: '09120000000',
            name: 'مدیر کل قنادی',
            role: 'admin',
            isVerified: true
          });
        }
      }

      const token = generateToken(dbAdmin._id, 'admin');

      res.status(200).json({
        success: true,
        message: 'خوش آمدید مدیر گرامی',
        token,
        admin: {
          id: dbAdmin._id,
          username: adminUser,
          name: dbAdmin.name || 'مدیر سیستم',
          role: 'admin'
        }
      });
    } catch (error) {
      console.error('خطای ورود ادمین:', error);
      res.status(500).json({
        success: false,
        message: 'خطای سرور در ورود مدیریت'
      });
    }
  }
);

module.exports = router;
