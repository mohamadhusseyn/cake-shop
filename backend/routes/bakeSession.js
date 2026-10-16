const express = require('express');
const router = express.Router();
const BakeSession = require('../models/BakeSession');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/bake-session/current
 * @desc    دریافت نوبت پخت فعال و جاری (عمومی)
 * @access  Public
 */
router.get('/current', async (req, res) => {
  try {
    // یافتن جدیدترین جلسه پخت باز
    let session = await BakeSession.findOne({ isOpen: true }).sort({ nextBakeTime: 1 });

    // در صورت عدم وجود نوبت فعال، یک نوبت پیش‌فرض برای ۳ روز آینده برگردانده شود
    if (!session) {
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      session = {
        sessionTitle: 'نوبت پخت آخر هفته (پنجشنبه)',
        nextBakeTime: defaultDate,
        orderDeadline: new Date(defaultDate.getTime() - 24 * 60 * 60 * 1000),
        capacity: 25,
        currentOrders: 0,
        isOpen: true,
        description: 'کیک‌ها و نان‌های این نوبت با تازه‌ترین مواد اولیه و پخت اختصاصی عصر پنجشنبه آماده خواهند شد.',
        specialOffer: 'ارسال رایگان برای خریدهای بالای یک میلیون تومان در آبادان و خرمشهر',
        remainingCapacity: 25,
        isCapacityFull: false
      };
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('خطا در دریافت وضعیت نوبت پخت:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات نوبت پخت'
    });
  }
});

/**
 * @route   GET /api/bake-session/all
 * @desc    دریافت لیست کلیه نوبت‌های پخت گذشته و پیش‌رو
 * @access  Private (Admin Only)
 */
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const sessions = await BakeSession.find().sort({ nextBakeTime: -1 });
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در واکشی سوابق نوبت‌های پخت'
    });
  }
});

/**
 * @route   POST /api/bake-session
 * @desc    تعریف نوبت پخت جدید یا ویرایش نوبت فعلی
 * @access  Private (Admin Only)
 */
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      sessionTitle,
      nextBakeTime,
      orderDeadline,
      capacity,
      description,
      specialOffer,
      isOpen,
      sessionId
    } = req.body;

    let session;
    if (sessionId) {
      session = await BakeSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'نوبت پخت مورد نظر یافت نشد'
        });
      }
    } else {
      // اگر نوبت جدید باز شده، نوبت‌های قبلی باز را می‌توان بست
      if (isOpen !== false) {
        await BakeSession.updateMany({ isOpen: true }, { isOpen: false });
      }
      session = new BakeSession();
    }

    if (sessionTitle) session.sessionTitle = sessionTitle;
    if (nextBakeTime) session.nextBakeTime = new Date(nextBakeTime);
    if (orderDeadline) session.orderDeadline = new Date(orderDeadline);
    if (capacity !== undefined) session.capacity = Number(capacity);
    if (description !== undefined) session.description = description;
    if (specialOffer !== undefined) session.specialOffer = specialOffer;
    if (isOpen !== undefined) session.isOpen = isOpen;

    await session.save();

    res.status(200).json({
      success: true,
      message: 'نوبت پخت با موفقیت ثبت/به‌روزرسانی شد',
      session
    });
  } catch (error) {
    console.error('خطا در ذخیره نوبت پخت:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطا در ثبت نوبت پخت'
    });
  }
});

module.exports = router;
