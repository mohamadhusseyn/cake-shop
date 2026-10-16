const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    weight: {
      type: Number, // بر حسب کیلوگرم (مثلاً ۱.۵ یا ۲ کیلو)
      default: 1
    },
    filling: {
      type: String, // فیلینگ انتخابی کیک
      default: 'موز و گردو'
    },
    customMessage: {
      type: String, // متن دست‌نویس روی کیک یا کارت تبریک
      trim: true,
      default: ''
    },
    ribbonColor: {
      type: String, // رنگ روبان جعبه کادویی
      default: 'طلایی'
    },
    price: {
      type: Number, // قیمت واحد به تومان در زمان ثبت سفارش
      required: true
    }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'سبد سفارش نمی‌تواند خالی باشد'
      }
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountCode: {
      type: String,
      trim: true,
      default: null
    },
    deliveryFee: {
      type: Number,
      default: 25000 // هزینه ارسال اختصاصی درون شهری (آبادان / خرمشهر)
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: {
        values: ['ثبت شد', 'در حال پخت با عشق', 'آماده ارسال', 'تحویل داده شد', 'لغو شده'],
        message: 'وضعیت سفارش نامعتبر است'
      },
      default: 'ثبت شد'
    },
    address: {
      city: {
        type: String,
        required: [true, 'انتخاب شهر (آبادان یا خرمشهر) الزامی است'],
        enum: {
          values: ['آبادان', 'خرمشهر', 'Abadan', 'Khorramshahr'],
          message: 'ارسال کیک و نان تازه در حال حاضر تنها برای شهرهای آبادان و خرمشهر امکان‌پذیر است'
        }
      },
      neighborhood: { type: String, trim: true },
      street: { type: String, trim: true },
      fullAddress: { type: String, required: [true, 'آدرس دقیق پستی الزامی است'], trim: true },
      postalCode: { type: String, trim: true },
      recipientName: { type: String, trim: true },
      recipientPhone: { type: String, trim: true }
    },
    deliveryDate: {
      type: Date,
      required: [true, 'تاریخ تحویل الزامی است']
    },
    deliveryTimeSlot: {
      type: String,
      default: '۱۶:۰۰ الی ۱۹:۰۰' // ساعات مرسوم عصرگاهی تحویل در خوزستان
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cash_on_delivery'],
      default: 'pending'
    },
    paymentRef: {
      type: String,
      default: null
    },
    specialNotes: {
      type: String, // یادداشت سرآشپز برای پرینت فاکتور کارگاهی
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// ایجاد خودکار شماره سفارش یکتا قبل از ذخیره
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    this.orderNumber = `CAKE-${dateStr}-${randomHex}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
