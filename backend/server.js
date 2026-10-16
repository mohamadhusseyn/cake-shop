/**
 * سرور اصلی بک‌اند قنادی و نانوایی خانگی
 * قنادی اختصاصی آبادان و خرمشهر
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// مسیرهای API
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const waitlistRoutes = require('./routes/waitlist');
const bakeSessionRoutes = require('./routes/bakeSession');
const discountRoutes = require('./routes/discounts');
const adminRoutes = require('./routes/admin');

const app = express();

// ۱. تنظیمات CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // اجازه به درخواست‌های بدون origin (مانند Postman یا اسکریپت‌های سرور)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // برای راحتی توسعه شبکه محلی
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ۲. پردازشگرهای بادی درخواست
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ۳. لاگر ساده درخواست‌ها در کنسول
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('fa-IR');
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ۴. مسیر بررسی سلامت سرور (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Persian Cake Shop Backend API',
    citySupport: ['آبادان', 'خرمشهر'],
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ۵. بارگذاری مسیرهای برنامه
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/bake-session', bakeSessionRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/admin', adminRoutes);

// ۶. روت ۴۰۴ برای مسیرهای تعریف‌نشده
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `مسیر مورد نظر (${req.originalUrl}) در سرور یافت نشد`
  });
});

// ۷. میان‌افزار مدیریت خطاهای سراسری (Global Error Handler)
app.use((err, req, res, next) => {
  console.error('🔥 خطای غیرمنتظره در سرور:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'خطایی در سمت سرور رخ داده است';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ۸. اتصال به دیتابیس MongoDB و شروع به کار سرور
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-shop';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ اتصال به پایگاه داده MongoDB با موفقیت برقرار شد.');
    app.listen(PORT, () => {
      console.log(`🍰 سرور قنادی خانگی روی پورت ${PORT} آماده پاسخگویی است.`);
      console.log(`🌐 آدرس دسترسی محلی: http://localhost:${PORT}`);
      console.log(`📡 نقطه اتصال API: http://localhost:${PORT}/api/health`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  })
  .catch((err) => {
    console.error('❌ خطا در اتصال به پایگاه داده MongoDB:', err.message);
    console.log('💡 سرور در حالت اضطراری (بدون دیتابیس) راه‌اندازی می‌شود...');
    app.listen(PORT, () => {
      console.log(`⚠️ سرور روی پورت ${PORT} شروع شد اما دیتابیس متصل نیست.`);
    });
  });

module.exports = app;
