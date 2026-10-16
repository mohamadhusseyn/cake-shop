const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'کد تخفیف الزامی است'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
      help: 'درصدی یا مبلغ ثابت به تومان'
    },
    value: {
      type: Number,
      required: [true, 'مقدار تخفیف الزامی است'],
      min: [1, 'مقدار تخفیف باید بیشتر از صفر باشد']
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      help: 'حداقل مبلغ سفارش برای اعمال این کوپن (تومان)'
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      help: 'حداکثر سقف تخفیف برای تخفیف‌های درصدی (تومان)'
    },
    expiryDate: {
      type: Date,
      required: [true, 'تاریخ انقضا الزامی است']
    },
    usageLimit: {
      type: Number,
      default: 100,
      min: 1
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * متد محاسبه تخفیف روی مبلغ سفارش
 * @param {number} subtotal
 * @returns {{isValid: boolean, discountAmount: number, message: string}}
 */
discountSchema.methods.calculateDiscount = function (subtotal) {
  if (!this.isActive) {
    return { isValid: false, discountAmount: 0, message: 'کد تخفیف غیرفعال است' };
  }

  if (new Date() > new Date(this.expiryDate)) {
    return { isValid: false, discountAmount: 0, message: 'مهلت استفاده از این کد تخفیف به پایان رسیده است' };
  }

  if (this.usedCount >= this.usageLimit) {
    return { isValid: false, discountAmount: 0, message: 'سقف استفاده از این کد تخفیف به پایان رسیده است' };
  }

  if (subtotal < this.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `حداقل مبلغ سفارش برای استفاده از این کد ${this.minOrderAmount.toLocaleString('fa-IR')} تومان است`
    };
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = Math.round((subtotal * this.value) / 100);
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = Math.min(this.value, subtotal);
  }

  return {
    isValid: true,
    discountAmount: discount,
    message: 'کد تخفیف با موفقیت اعمال شد'
  };
};

module.exports = mongoose.model('Discount', discountSchema);
