const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Waitlist = require('../models/Waitlist');
const smsService = require('../utils/smsService');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/waitlist
 * @desc    ثبت‌نام کاربر در لیست انتظار پخت اختصاصی یا زمان تکمیل ظرفیت
 * @access  Public
 */
router.post(
  '/',
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
        message: errors.array()[0].msg
      });
    }

    try {
      const { phone, name, requestedDate, preferredCategory, note } = req.body;

      // بررسی آیا این شماره در وضعیت انتظار ثبت شده است یا خیر
      const existingEntry = await Waitlist.findOne({ phone, status: 'pending' });
      if (existingEntry) {
        return res.status(200).json({
          success: true,
          message: 'شماره شما پیش از این در لیست انتظار ثبت شده است. به محض باز شدن ظرفیت، پیامک اطلاع‌رسانی ارسال می‌گردد.',
          waitlist: existingEntry
        });
      }

      const waitlistEntry = new Waitlist({
        phone,
        name: name || 'همراه گرامی',
        requestedDate: requestedDate ? new Date(requestedDate) : null,
        preferredCategory: preferredCategory || 'any',
        note: note || '',
        status: 'pending'
      });

      await waitlistEntry.save();

      res.status(201).json({
        success: true,
        message: 'درخواست شما در لیست انتظار با موفقیت ثبت شد. به محض باز شدن ظرفیت، برای شما پیامک ارسال خواهد شد.',
        waitlist: waitlistEntry
      });
    } catch (error) {
      console.error('خطا در ثبت لیست انتظار:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ثبت اطلاعات در لیست انتظار'
      });
    }
  }
);

/**
 * @route   GET /api/waitlist
 * @desc    مشاهده کلیه افراد در لیست انتظار
 * @access  Private (Admin Only)
 */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.preferredCategory = category;

    const entries = await Waitlist.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست انتظار'
    });
  }
});

/**
 * @route   POST /api/waitlist/:id/notify
 * @desc    ارسال پیامک باز شدن ظرفیت به فرد حاضر در لیست انتظار
 * @access  Private (Admin Only)
 */
router.post('/:id/notify', verifyToken, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    const entry = await Waitlist.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'ورودی لیست انتظار یافت نشد'
      });
    }

    const defaultMsg = 'ظرفیت نوبت جدید پخت باز شده است. می‌توانید سفارش خود را ثبت نمایید.';
    const notificationText = message || defaultMsg;

    // ارسال پیامک
    await smsService.sendWaitlistNotification(entry.phone, notificationText);

    entry.status = 'notified';
    entry.notifiedAt = new Date();
    await entry.save();

    res.status(200).json({
      success: true,
      message: `پیامک اطلاع‌رسانی با موفقیت به شماره ${entry.phone} ارسال شد.`,
      entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال پیامک اطلاع‌رسانی'
    });
  }
});

/**
 * @route   DELETE /api/waitlist/:id
 * @desc    حذف یک رکورد از لیست انتظار
 * @access  Private (Admin Only)
 */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const entry = await Waitlist.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'رکورد مورد نظر یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      message: 'رکورد با موفقیت از لیست انتظار حذف شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف از لیست انتظار'
    });
  }
});

module.exports = router;
