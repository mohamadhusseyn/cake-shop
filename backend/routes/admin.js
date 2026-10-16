const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Waitlist = require('../models/Waitlist');
const { verifyToken, isAdmin } = require('../middleware/auth');

// تمام مسیرهای این فایل نیازمند دسترسی ادمین هستند
router.use(verifyToken, isAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    دریافت آمار جامع داشبورد مدیریت (تعداد سفارش‌ها، درآمد، نوبت پخت و وضعیت لیست انتظار)
 * @access  Private (Admin Only)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments();
    const pendingOrdersCount = await Order.countDocuments({
      status: { $in: ['ثبت شد', 'در حال پخت با عشق'] }
    });
    const completedOrdersCount = await Order.countDocuments({ status: 'تحویل داده شد' });
    const waitlistCount = await Waitlist.countDocuments({ status: 'pending' });
    const productsCount = await Product.countDocuments();
    const activeProductsCount = await Product.countDocuments({ isAvailable: true });

    // محاسبه مجموع درآمد از سفارش‌های پرداخت شده یا تکمیل شده
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'لغو شده' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // ۱۰ سفارش اخیر
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name phone');

    // تفکیک آمار سفارش‌ها بر اساس شهر (آبادان و خرمشهر)
    const ordersByCity = await Order.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 }, revenue: { $sum: '$finalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        completedOrdersCount,
        waitlistCount,
        productsCount,
        activeProductsCount,
        ordersByCity
      },
      recentOrders
    });
  } catch (error) {
    console.error('خطای دریافت آمار داشبورد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بارگذاری آمار داشبورد مدیریت'
    });
  }
});

/**
 * @route   GET /api/admin/customers
 * @desc    دریافت لیست کلیه مشتریان همراه با سابقه و مجموع مبالغ خرید
 * @access  Private (Admin Only)
 */
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean();

    // استخراج سابقه خرید برای هر مشتری
    const customerStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ userId: customer._id });
        const ordersCount = orders.length;
        const totalSpent = orders
          .filter((o) => o.status !== 'لغو شده')
          .reduce((sum, o) => sum + o.finalPrice, 0);
        const lastOrder = orders.length > 0 ? orders[orders.length - 1].createdAt : null;

        return {
          id: customer._id,
          phone: customer.phone,
          name: customer.name,
          addresses: customer.addresses,
          isVerified: customer.isVerified,
          createdAt: customer.createdAt,
          ordersCount,
          totalSpent,
          lastOrder
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customerStats.length,
      customers: customerStats
    });
  } catch (error) {
    console.error('خطا در دریافت لیست مشتریان:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست مشتریان'
    });
  }
});

/**
 * @route   GET /api/admin/orders/printable
 * @desc    دریافت دفترچه چاپی کلیه سفارش‌های یک تاریخ معین مخصوص کارگاه پخت و بسته‌بندی
 * @access  Private (Admin Only)
 */
router.get('/orders/printable', async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: 'لغو شده' };
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      filter.deliveryDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(filter).sort({ deliveryTimeSlot: 1, createdAt: 1 });

    // خروجی در قالب HTML برای چاپ فیزیکی لیست کارگاهی روزانه
    const ordersRows = orders
      .map((ord, idx) => {
        const itemsList = ord.items
          .map(
            (it) => `
          <div style="margin-bottom: 4px;">
            • <strong>${it.productName}</strong> (${it.weight || 1} کیلو) × ${it.quantity}
            ${it.filling ? `<span style="color: #666;">[فیلینگ: ${it.filling}]</span>` : ''}
            ${it.customMessage ? `<span style="color: #d97706; font-weight: bold;">[متن کیک: "${it.customMessage}"]</span>` : ''}
            ${it.ribbonColor ? `<span>[روبان: ${it.ribbonColor}]</span>` : ''}
          </div>
        `
          )
          .join('');

        return `
        <tr style="border-bottom: 2px solid #e2e8f0;">
          <td style="padding: 10px 6px; text-align: center; vertical-align: top;">${idx + 1}</td>
          <td style="padding: 10px 6px; vertical-align: top;">
            <strong>${ord.orderNumber}</strong>
            <div style="font-size: 11px; color: #64748b;">${ord.deliveryTimeSlot}</div>
          </td>
          <td style="padding: 10px 6px; vertical-align: top;">
            <div><strong>${ord.customerName}</strong></div>
            <div dir="ltr" style="font-size: 11px; text-align: right;">${ord.customerPhone}</div>
          </td>
          <td style="padding: 10px 6px; vertical-align: top;">
            <div><strong>${ord.address.city}</strong></div>
            <div style="font-size: 11px; color: #475569;">${ord.address.fullAddress}</div>
          </td>
          <td style="padding: 10px 6px; vertical-align: top;">
            ${itemsList}
            ${ord.specialNotes ? `<div style="background: #fffbeb; padding: 4px; font-size: 11px; color: #92400e; margin-top: 4px; border-radius: 4px;">یادداشت کارگاه: ${ord.specialNotes}</div>` : ''}
          </td>
          <td style="padding: 10px 6px; vertical-align: top; text-align: center;">
            <span style="font-weight: bold; background: #e0f2fe; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${ord.status}</span>
          </td>
        </tr>
      `;
      })
      .join('');

    const printableHtml = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>دفترچه برنامه پخت و ارسال کارگاه</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: Tahoma, 'Vazirmatn', sans-serif; font-size: 12px; color: #0f172a; margin: 0; padding: 10px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f1f5f9; padding: 10px 6px; text-align: right; border-bottom: 2px solid #cbd5e1; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px;">
          <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ چاپ برنامه سفارشات کارگاه</button>
        </div>

        <div class="header">
          <div>
            <h2 style="margin: 0;">لیست سفارشات کارگاه قنادی خانگی (آبادان و خرمشهر)</h2>
            <div style="color: #64748b; font-size: 12px; margin-top: 4px;">تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')} | تعداد کل سفارش‌ها: ${orders.length}</div>
          </div>
          <div style="text-align: left; font-size: 11px; color: #475569;">
            تاریخ پخت و ارسال: ${date ? new Date(date).toLocaleDateString('fa-IR') : 'کلیه روزهای فعال'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th style="width: 140px;">سفارش / زمان</th>
              <th style="width: 120px;">مشتری</th>
              <th style="width: 180px;">آدرس تحویل</th>
              <th>اقلام سفارش، فیلینگ و متن کیک</th>
              <th style="width: 100px; text-align: center;">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            ${ordersRows || '<tr><td colspan="6" style="text-align: center; padding: 20px;">هیچ سفارشی برای این تاریخ یافت نشد.</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `;

    if (req.query.format === 'json') {
      return res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(printableHtml);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد گزارش چاپی کارگاه'
    });
  }
});

/**
 * @route   DELETE /api/admin/customers/:id
 * @desc    حذف مشتری و کلیه سفارشات مرتبط با او از سیستم
 * @access  Private (Admin Only)
 */
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'مشتری مورد نظر یافت نشد'
      });
    }

    if (customer.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'حذف حساب مدیر سیستم امکان‌پذیر نیست'
      });
    }

    // حذف تمام سفارشات مرتبط با این کاربر
    const deletedOrders = await Order.deleteMany({ userId: customer._id });

    // حذف حساب کاربری
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `مشتری «${customer.name}» با موفقیت حذف شد. تعداد ${deletedOrders.deletedCount} سفارش مرتبط نیز پاک‌سازی گردید.`
    });
  } catch (error) {
    console.error('خطا در حذف مشتری:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف مشتری'
    });
  }
});

module.exports = router;
