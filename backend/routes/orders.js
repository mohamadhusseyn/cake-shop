const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Discount = require('../models/Discount');
const BakeSession = require('../models/BakeSession');
const smsService = require('../utils/smsService');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * شهرهای مجاز جهت تحویل کیک و نان خانگی
 */
const VALID_CITIES = ['آبادان', 'خرمشهر', 'Abadan', 'Khorramshahr'];

/**
 * @route   POST /api/orders
 * @desc    ثبت سفارش جدید توسط مشتری
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      items,
      address,
      deliveryDate,
      deliveryTimeSlot,
      discountCode,
      specialNotes,
      paymentMethod
    } = req.body;

    // ۱. بررسی اعتبار سبد خرید
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'سبد خرید خالی است.'
      });
    }

    // ۲. بررسی شهر تحویل (انحصارا آبادان و خرمشهر)
    if (!address || !address.city || !VALID_CITIES.includes(address.city.trim())) {
      return res.status(400).json({
        success: false,
        message: 'در حال حاضر ارسال سفارشات فقط برای شهرهای آبادان و خرمشهر مقدور می‌باشد.'
      });
    }

    if (!address.fullAddress) {
      return res.status(400).json({
        success: false,
        message: 'آدرس کامل پستی جهت تحویل الزامی است.'
      });
    }

    // ۳. اعتبارسنجی محصولات، محاسبه مبلغ و استخراج اطلاعات
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصولی با شناسه ${item.productId} یافت نشد.`
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `متأسفانه محصول «${product.name}» در حال حاضر موجود نیست.`
        });
      }

      const qty = Number(item.quantity) || 1;
      const weight = Number(item.weight) || 1;
      
      // محاسبه قیمت: اگر قیمت بر اساس وزن باشد
      let itemPrice = product.basePrice;
      if (product.pricePerKg > 0 && weight > 1) {
        itemPrice = product.basePrice + (weight - 1) * product.pricePerKg;
      }
      const totalItemPrice = itemPrice * qty;
      calculatedSubtotal += totalItemPrice;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        quantity: qty,
        weight: weight,
        filling: item.filling || 'موز و گردو',
        customMessage: item.customMessage || '',
        ribbonColor: item.ribbonColor || 'طلایی',
        price: totalItemPrice
      });

      // به‌روزرسانی تعداد سفارش‌های محصول
      product.currentOrders = (product.currentOrders || 0) + qty;
      await product.save();
    }

    // ۴. بررسی و اعمال کد تخفیف
    let discountAmount = 0;
    let validDiscountDoc = null;

    if (discountCode && discountCode.trim() !== '') {
      validDiscountDoc = await Discount.findOne({
        code: discountCode.trim().toUpperCase(),
        isActive: true
      });

      if (validDiscountDoc) {
        const discountResult = validDiscountDoc.calculateDiscount(calculatedSubtotal);
        if (discountResult.isValid) {
          discountAmount = discountResult.discountAmount;
          validDiscountDoc.usedCount += 1;
          await validDiscountDoc.save();
        }
      }
    }

    // ۵. هزینه ارسال درون‌شهری (برای سفارش‌های بالای ۱ میلیون رایگان)
    const deliveryFee = calculatedSubtotal >= 1000000 ? 0 : 25000;
    const finalPrice = Math.max(0, calculatedSubtotal - discountAmount + deliveryFee);

    // ۶. ذخیره سفارش در دیتابیس
    const newOrder = new Order({
      userId: req.user._id,
      customerName: req.body.customerName || req.user.name || 'مشتری گرامی',
      customerPhone: req.body.customerPhone || req.user.phone,
      items: validatedItems,
      totalPrice: calculatedSubtotal,
      discountAmount,
      discountCode: validDiscountDoc ? validDiscountDoc.code : null,
      deliveryFee,
      finalPrice,
      status: 'ثبت شد',
      address: {
        city: address.city,
        neighborhood: address.neighborhood || '',
        street: address.street || '',
        fullAddress: address.fullAddress,
        postalCode: address.postalCode || '',
        recipientName: address.recipientName || req.user.name,
        recipientPhone: address.recipientPhone || req.user.phone
      },
      deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(Date.now() + 24 * 3600 * 1000),
      deliveryTimeSlot: deliveryTimeSlot || '۱۶:۰۰ الی ۱۹:۰۰',
      paymentStatus: paymentMethod === 'cash' ? 'cash_on_delivery' : 'pending',
      specialNotes: specialNotes || ''
    });

    await newOrder.save();

    // به‌روزرسانی نوبت پخت فعال
    await BakeSession.updateOne(
      { isOpen: true },
      { $inc: { currentOrders: validatedItems.length } }
    );

    // ارسال پیامک تأیید ثبت سفارش به کاربر
    await smsService.sendOrderStatus(
      newOrder.customerPhone,
      'ثبت شد (در صف تایید کارگاه)',
      newOrder.orderNumber
    );

    res.status(201).json({
      success: true,
      message: 'سفارش شما با موفقیت ثبت شد و در نوبت پخت قرار گرفت.',
      order: newOrder
    });
  } catch (error) {
    console.error('خطا در ثبت سفارش:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطا در ثبت سفارش'
    });
  }
});

/**
 * @route   GET /api/orders
 * @desc    دریافت سابقه سفارش‌های کاربر جاری
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تاریخچه سفارش‌ها'
    });
  }
});

/**
 * @route   GET /api/orders/admin
 * @desc    دریافت کلیه سفارش‌ها جهت مدیریت کارگاه
 * @access  Private (Admin Only)
 */
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, city, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (city) filter['address.city'] = city;
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      filter.deliveryDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارش‌های مدیریت'
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    دریافت جزییات یک سفارش خاص
 * @access  Private
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    // فقط صاحب سفارش یا ادمین اجازه مشاهده دارد
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این سفارش را ندارید'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در واکشی اطلاعات سفارش'
    });
  }
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    به‌روزرسانی وضعیت سفارش و ارسال پیامک به مشتری
 * @access  Private (Admin Only)
 */
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['ثبت شد', 'در حال پخت با عشق', 'آماده ارسال', 'تحویل داده شد', 'لغو شده'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت انتخاب شده نامعتبر است'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    order.status = status;
    if (status === 'تحویل داده شد') {
      order.paymentStatus = 'paid';
    }
    await order.save();

    // ارسال پیامک تغییر وضعیت سفارش
    await smsService.sendOrderStatus(order.customerPhone, status, order.orderNumber);

    res.status(200).json({
      success: true,
      message: `وضعیت سفارش به «${status}» تغییر یافت و پیامک ارسال شد`,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت سفارش'
    });
  }
});

/**
 * @route   GET /api/orders/:id/print
 * @desc    دریافت فرمت آماده چاپ (فیش کارگاه / فاکتور تحویل به مشتری)
 * @access  Private (Admin Only)
 */
router.get('/:id/print', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    // اگر فرمت JSON درخواست شده بود
    if (req.query.format === 'json') {
      return res.status(200).json({
        success: true,
        printData: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          city: order.address.city,
          fullAddress: order.address.fullAddress,
          deliveryDate: new Date(order.deliveryDate).toLocaleDateString('fa-IR'),
          deliveryTimeSlot: order.deliveryTimeSlot,
          items: order.items,
          specialNotes: order.specialNotes,
          totalPrice: order.totalPrice,
          discountAmount: order.discountAmount,
          finalPrice: order.finalPrice,
          status: order.status
        }
      });
    }

    // خروجی HTML شیک و بهینه‌شده برای چاپ (RTL و فونت فارسی استاندارد)
    const itemsHtml = order.items
      .map(
        (item, index) => `
        <tr style="border-bottom: 1px dashed #cbd5e1;">
          <td style="padding: 10px 4px; text-align: center;">${index + 1}</td>
          <td style="padding: 10px 4px; font-weight: bold;">
            ${item.productName}
            ${item.weight ? `<div style="font-size: 11px; color: #64748b;">وزن: ${item.weight} کیلوگرم</div>` : ''}
            ${item.filling ? `<div style="font-size: 11px; color: #64748b;">فیلینگ: ${item.filling}</div>` : ''}
            ${item.ribbonColor ? `<div style="font-size: 11px; color: #64748b;">رنگ روبان: ${item.ribbonColor}</div>` : ''}
            ${item.customMessage ? `<div style="font-size: 12px; color: #b45309; background: #fef3c7; padding: 3px 6px; border-radius: 4px; margin-top: 4px;">متن روی کیک: «${item.customMessage}»</div>` : ''}
          </td>
          <td style="padding: 10px 4px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 4px; text-align: left;">${item.price.toLocaleString('fa-IR')} تومان</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>فیش سفارش ${order.orderNumber} - قنادی خانگی</title>
        <style>
          @page { size: A5; margin: 10mm; }
          body { font-family: Tahoma, 'Vazirmatn', sans-serif; font-size: 13px; color: #1e293b; background: #fff; margin: 0; padding: 15px; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: bold; margin: 4px 0; }
          .subtitle { font-size: 12px; color: #64748b; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border-radius: 6px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .table th { background: #e2e8f0; padding: 8px; text-align: right; }
          .notes { background: #fffbeb; border: 1px dashed #f59e0b; padding: 8px; border-radius: 6px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; text-align: left;">
          <button onclick="window.print()" style="background: #e11d48; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">🖨️ چاپ فیش سفارش</button>
        </div>
        <div class="header">
          <div class="title">🍰 قنادی و نانوایی خانگی آبادان و خرمشهر</div>
          <div class="subtitle">برگه آماده‌سازی کارگاه و تحویل مشتری</div>
          <div style="font-weight: bold; margin-top: 6px;">شماره سفارش: ${order.orderNumber}</div>
        </div>

        <div class="info-grid">
          <div><strong>مشتری:</strong> ${order.customerName}</div>
          <div><strong>تماس:</strong> ${order.customerPhone}</div>
          <div><strong>شهر مقصد:</strong> ${order.address.city}</div>
          <div><strong>تاریخ تحویل:</strong> ${new Date(order.deliveryDate).toLocaleDateString('fa-IR')}</div>
          <div><strong>ساعت تحویل:</strong> ${order.deliveryTimeSlot}</div>
          <div><strong>وضعیت:</strong> ${order.status}</div>
        </div>

        <div style="margin-bottom: 10px;">
          <strong>آدرس دقیق تحویل:</strong> ${order.address.fullAddress}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th>شرح محصول و فیلینگ</th>
              <th style="width: 50px; text-align: center;">تعداد</th>
              <th style="width: 120px; text-align: left;">مبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: left; line-height: 1.8; margin-top: 10px;">
          <div>مجموع اقلام: <strong>${order.totalPrice.toLocaleString('fa-IR')} تومان</strong></div>
          ${order.discountAmount > 0 ? `<div>تخفیف: <span style="color: #16a34a;">-${order.discountAmount.toLocaleString('fa-IR')} تومان</span></div>` : ''}
          <div>هزینه پیک: <strong>${order.deliveryFee === 0 ? 'رایگان' : order.deliveryFee.toLocaleString('fa-IR') + ' تومان'}</strong></div>
          <div style="font-size: 15px; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            مبلغ نهایی قابل پرداخت: ${order.finalPrice.toLocaleString('fa-IR')} تومان
          </div>
        </div>

        ${order.specialNotes ? `
          <div class="notes">
            <strong>⚠️ یادداشت ویژه کارگاه:</strong> ${order.specialNotes}
          </div>
        ` : ''}

        <div class="footer">
          با عشق و آرزوی شادکامی برای شما • پخت تازه در همان روز تحویل
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تولید برگه چاپ سفارش'
    });
  }
});

module.exports = router;
