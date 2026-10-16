const mongoose = require('mongoose');

const bakeSessionSchema = new mongoose.Schema(
  {
    sessionTitle: {
      type: String,
      required: [true, 'عنوان نوبت پخت الزامی است'],
      trim: true,
      default: 'پخت ویژه آخر هفته کیک و نان تازه'
    },
    nextBakeTime: {
      type: Date,
      required: [true, 'زمان تحویل یا پخت الزامی است']
    },
    orderDeadline: {
      type: Date,
      help: 'آخرین مهلت ثبت سفارش برای این نوبت پخت'
    },
    capacity: {
      type: Number,
      required: true,
      default: 20,
      min: 1,
      help: 'حداکثر تعداد سفارش‌های قابل پذیرش در این بچ پخت'
    },
    currentOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true,
      default: 'کلیه محصولات با بهترین مواد اولیه تازه، آرد مرغوب و بدون مواد نگه‌دارنده پخته می‌شوند.'
    },
    specialOffer: {
      type: String,
      trim: true,
      default: 'ارسال رایگان برای سفارش‌های بالای ۱ میلیون تومان در آبادان و خرمشهر'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// تعداد ظرفیت باقی‌مانده
bakeSessionSchema.virtual('remainingCapacity').get(function () {
  return Math.max(0, this.capacity - this.currentOrders);
});

// وضعیت پر شدن سهمیه
bakeSessionSchema.virtual('isCapacityFull').get(function () {
  return this.currentOrders >= this.capacity;
});

module.exports = mongoose.model('BakeSession', bakeSessionSchema);
