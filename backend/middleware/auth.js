const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'persian_cake_shop_super_secret_jwt_key_2024';

/**
 * میان‌افزار بررسی و احراز هویت توکن JWT کاربر
 */
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'دسترسی غیرمجاز! لطفا ابتدا وارد حساب کاربری خود شوید.'
      });
    }

    // بررسی و رمزگشایی توکن
    const decoded = jwt.verify(token, JWT_SECRET);

    // بررسی وجود کاربر در دیتابیس
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر مربوط به این نشست دیگر در سیستم وجود ندارد.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'توکن ورود شما منقضی شده است. لطفا مجددا وارد شوید.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است.'
    });
  }
};

/**
 * میان‌افزار بررسی سطح دسترسی مدیر (Admin)
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'خطای عدم دسترسی: این بخش تنها مخصوص مدیر سیستم می‌باشد.'
  });
};

/**
 * میان‌افزار اختیاری کاربر (در صورت وجود توکن شناسایی می‌کند و در غیر این صورت اجازه عبور می‌دهد)
 */
const optionalAuth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // خطا در توکن اختیاری نادیده گرفته می‌شود
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  optionalAuth
};
