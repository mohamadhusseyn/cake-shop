const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      default: 'کاربر ناشناس'
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام محصول الزامی است'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'توضیحات محصول الزامی است'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'دسته‌بندی محصول الزامی است'],
      enum: {
        values: ['cake', 'bread', 'cookie', 'pastry'],
        message: 'دسته‌بندی نامعتبر است (cake, bread, cookie, pastry)'
      },
      default: 'cake'
    },
    basePrice: {
      type: Number,
      required: [true, 'قیمت پایه (تومان) الزامی است'],
      min: [0, 'قیمت نمی‌تواند منفی باشد']
    },
    pricePerKg: {
      type: Number,
      default: 0,
      min: [0, 'قیمت هر کیلوگرم نمی‌تواند منفی باشد']
    },
    images: {
      type: [String],
      default: []
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    maxOrders: {
      type: Number,
      default: 10,
      min: 0,
      help: 'حداکثر ظرفیت سفارش برای این محصول در هر نوبت پخت'
    },
    currentOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    weightOptions: {
      type: [Number], // وزن‌ها بر حسب کیلوگرم: مثلاً [1, 1.5, 2, 2.5, 3]
      default: [1, 1.5, 2, 3]
    },
    fillingOptions: {
      type: [String], // فیلینگ‌های قابل انتخاب: مثلاً ['موز و گردو', 'شکلات چیپسی و نوتلا', 'کارامل و بادام']
      default: ['موز و گردو', 'شکلات چیپسی', 'کارامل و بادام', 'توت‌فرنگی و خامه']
    },
    leadTimeHours: {
      type: Number,
      default: 24, // حداقل زمان لازم از ثبت تا آماده‌سازی بر حسب ساعت
      min: 0
    },
    tags: {
      type: [String],
      default: []
    },
    isSpecialOffer: {
      type: Boolean,
      default: false
    },
    ratings: [ratingSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// میانگین امتیازات محصول
productSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 5;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.score, 0);
  return Number((sum / this.ratings.length).toFixed(1));
});

// تعداد بررسی‌ها
productSchema.virtual('ratingsCount').get(function () {
  return this.ratings ? this.ratings.length : 0;
});

// بررسی تکمیل ظرفیت
productSchema.virtual('isSoldOut').get(function () {
  return !this.isAvailable || (this.maxOrders > 0 && this.currentOrders >= this.maxOrders);
});

module.exports = mongoose.model('Product', productSchema);
