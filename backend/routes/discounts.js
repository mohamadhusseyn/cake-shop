const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/discounts/validate
 * @desc    اعتبارسنجی کد تخفیف و محاسبه مبلغ کسر شونده برای سبد خرید
 * @access  Public
 */
router.post('/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'کد تخفیف را وارد کنید'
      });
    }

    const subtotal = Number(amount) || 0;
    const discount = await Discount.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'کد تخفیف معتبر نیست یا منقضی شده است'
      });
    }

    const calcResult = discount.calculateDiscount(subtotal);
    if (!calcResult.isValid) {
      return res.status(400).json({
        success: false,
        message: calcResult.message
      });
    }

    res.status(200).json({
      success: true,
      message: calcResult.message,
      code: discount.code,
      discountAmount: calcResult.discountAmount,
      finalAmount: Math.max(0, subtotal - calcResult.discountAmount)
    });
  } catch (error) {
    console.error('خطا در اعتبارسنجی تخفیف:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بررسی کد تخفیف'
    });
  }
});

/**
 * @route   GET /api/discounts
 * @desc    دریافت کلیه کدهای تخفیف
 * @access  Private (Admin Only)
 */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: discounts.length,
      discounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در واکشی کدهای تخفیف'
    });
  }
});

/**
 * @route   POST /api/discounts
 * @desc    ایجاد کد تخفیف جدید
 * @access  Private (Admin Only)
 */
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      code,
      discountType,
      value,
      minOrderAmount,
      maxDiscountAmount,
      expiryDate,
      usageLimit
    } = req.body;

    if (!code || !value || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'کد تخفیف، مقدار و تاریخ انقضا الزامی هستند'
      });
    }

    const existingCode = await Discount.findOne({ code: code.trim().toUpperCase() });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'این کد تخفیف قبلاً تعریف شده است'
      });
    }

    const discount = new Discount({
      code: code.trim().toUpperCase(),
      discountType: discountType || 'percentage',
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit) || 100,
      isActive: true
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: 'کد تخفیف با موفقیت ایجاد شد',
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'خطا در ایجاد کد تخفیف'
    });
  }
});

/**
 * @route   DELETE /api/discounts/:id
 * @desc    حذف کد تخفیف
 * @access  Private (Admin Only)
 */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'کد تخفیف یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      message: 'کد تخفیف با موفقیت حذف گردید'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف کد تخفیف'
    });
  }
});

module.exports = router;
