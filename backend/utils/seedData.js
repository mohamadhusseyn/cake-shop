/**
 * اسکریپت مقداردهی اولیه داده‌های قنادی (Seed Script)
 * اجرا با دستور: node utils/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Product = require('../models/Product');
const User = require('../models/User');
const Discount = require('../models/Discount');
const BakeSession = require('../models/BakeSession');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-shop';

const sampleProducts = [
  {
    name: 'کیک تولد خامه‌ای کلاسیک',
    description: 'کیک اسفنجی وانیلی با لایه‌های خامه تازه قنادی، فیلینگ موز و گردوی درجه یک و تزئین گل‌های طبیعی یا میوه.',
    category: 'cake',
    basePrice: 350000,
    pricePerKg: 350000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 12,
    currentOrders: 2,
    weightOptions: [1, 1.5, 2, 2.5, 3],
    fillingOptions: ['موز و گردو', 'توت‌فرنگی و نوتلا', 'کارامل و بادام هندی', 'پسته و خامه عسلی'],
    leadTimeHours: 24,
    tags: ['کیک تولد', 'خامه‌ای', 'سفارشی', 'تازه'],
    isSpecialOffer: true
  },
  {
    name: 'کیک شکلاتی ویژه (دبل چاکلت بلژیکی)',
    description: 'کیک اسفنجی شکلاتی با گاناش غلیظ شکلات بلژیکی، مغز شکلات چیپسی و فیلینگ سس شکلات فندقی.',
    category: 'cake',
    basePrice: 400000,
    pricePerKg: 400000,
    images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 8,
    currentOrders: 1,
    weightOptions: [1.2, 1.8, 2.5],
    fillingOptions: ['نوتلا و فندق بو داده', 'شکلات چیپسی و موز', 'کارامل نمکی و گردو'],
    leadTimeHours: 24,
    tags: ['شکلاتی', 'دبل چاکلت', 'گاناش', 'لوکس'],
    isSpecialOffer: true
  },
  {
    name: 'نان روستایی سنتی (خمیر ترش ارگانیک)',
    description: 'نان روستایی پخته شده با خمیرترش طبیعی ۷۲ ساعته در تنور سنگی، پوسته کرانچی طلایی و بافت داخلی سبک و هضم آسان.',
    category: 'bread',
    basePrice: 80000,
    pricePerKg: 0,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 30,
    currentOrders: 5,
    weightOptions: [0.75],
    fillingOptions: ['ساده سنتی', 'کنجدی سبوس‌دار', 'زیتون و رزماری'],
    leadTimeHours: 12,
    tags: ['نان سنتی', 'خمیرترش', 'سالم', 'صبحانه'],
    isSpecialOffer: false
  },
  {
    name: 'کلوچه خانگی مغزدار خرمایی و گردویی',
    description: 'بسته ۶ عددی کلوچه اصیل جنوبی با خمیر ترد زعفرانی و فیلینگ خرمای درجه یک دشتستان، هل سبز و گردو.',
    category: 'cookie',
    basePrice: 120000,
    pricePerKg: 0,
    images: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 25,
    currentOrders: 4,
    weightOptions: [0.5],
    fillingOptions: ['خرمایی سنتی', 'شکلات چیپسی', 'دارچین و گردو'],
    leadTimeHours: 12,
    tags: ['کلوچه', 'خرمایی', 'خانگی', 'عصرانه'],
    isSpecialOffer: false
  },
  {
    name: 'کیک میوه تابستانی با کرم پاتیسیر',
    description: 'کیک سبک اسفنجی با لایه‌های کرم کاستارد ملایم خانگی، روکش ژله براق و ترکیبی از میوه‌های تازه فصل.',
    category: 'cake',
    basePrice: 380000,
    pricePerKg: 380000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 10,
    currentOrders: 0,
    weightOptions: [1.2, 1.5, 2],
    fillingOptions: ['کرم پاتیسیر و هلو', 'توت‌فرنگی و توت وحشی', 'موز و آناناس'],
    leadTimeHours: 24,
    tags: ['میوه‌ای', 'کیک میوه', 'تازه', 'کم‌شیرین'],
    isSpecialOffer: true
  },
  {
    name: 'چیز کیک سن سباستین سوخته اسپانیایی',
    description: 'چیزکیک کرمی غنی با سطح کاراملی شده و بافت مرکزی مخملی و ذوب شونده به همراه سس سیروپ توت‌فرنگی یا شکلات داغ.',
    category: 'pastry',
    basePrice: 290000,
    pricePerKg: 0,
    images: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true,
    maxOrders: 15,
    currentOrders: 3,
    weightOptions: [1],
    fillingOptions: ['سس شکلات دست‌ساز', 'سس تمشک ترش', 'ساده کلاسیک'],
    leadTimeHours: 18,
    tags: ['چیز کیک', 'سن سباستین', 'کافه‌ای', 'محبوب'],
    isSpecialOffer: false
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 در حال اتصال به پایگاه داده MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ اتصال موفق به دیتابیس:', mongoose.connection.name);

    // ۱. پاکسازی محصولات و ثبت مجدد
    await Product.deleteMany({});
    console.log('🗑️ محصولات قدیمی پاکسازی شدند.');

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✨ تعداد ${createdProducts.length} محصول شاخص قنادی با موفقیت ثبت شدند.`);

    // ۲. ایجاد یا به‌روزرسانی حساب کاربری مدیر ارشد (Admin)
    const adminPhone = '09160000000';
    const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'admin123456';
    const hashedPassword = await bcrypt.hash(adminPasswordRaw, 10);

    await User.deleteMany({ role: 'admin' });
    const adminUser = await User.create({
      phone: adminPhone,
      name: 'مدیر ارشد کارگاه قنادی',
      role: 'admin',
      password: hashedPassword,
      isVerified: true,
      addresses: [
        {
          city: 'آبادان',
          neighborhood: 'امیری',
          street: 'خیابان امام خمینی',
          fullAddress: 'آبادان، خیابان امیری، نبش خیابان سعدی، کارگاه قنادی خانگی',
          postalCode: '6315812345',
          isDefault: true
        }
      ]
    });
    console.log(`👑 حساب مدیریت ایجاد شد:\n  تلفن: ${adminPhone}\n  رمز عبور: ${adminPasswordRaw}`);

    // ۳. ایجاد نوبت پخت آینده (BakeSession)
    await BakeSession.deleteMany({});
    const bakeDate = new Date();
    bakeDate.setDate(bakeDate.getDate() + 2);
    bakeDate.setHours(17, 0, 0, 0);

    const deadlineDate = new Date(bakeDate);
    deadlineDate.setHours(deadlineDate.getHours() - 18);

    await BakeSession.create({
      sessionTitle: 'نوبت پخت اختصاصی پایان هفته (پنجشنبه)',
      nextBakeTime: bakeDate,
      orderDeadline: deadlineDate,
      capacity: 25,
      currentOrders: 6,
      isOpen: true,
      description: 'تمامی سفارشات روز پنجشنبه ساعت ۱۶ الی ۱۹ با بسته‌بندی عایق حرارتی و روبان کادویی ارسال می‌شوند.',
      specialOffer: 'ارسال رایگان در سراسر آبادان و خرمشهر برای سفارش‌های بالای ۱ میلیون تومان'
    });
    console.log('📅 نوبت پخت فعال ایجاد شد.');

    // ۴. ایجاد کدهای تخفیف نمونه
    await Discount.deleteMany({});
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 2);

    await Discount.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        value: 10,
        minOrderAmount: 200000,
        maxDiscountAmount: 100000,
        expiryDate: nextMonth,
        usageLimit: 200,
        usedCount: 5,
        isActive: true
      },
      {
        code: 'ARVAND50',
        discountType: 'fixed',
        value: 50000,
        minOrderAmount: 350000,
        expiryDate: nextMonth,
        usageLimit: 100,
        usedCount: 2,
        isActive: true
      }
    ]);
    console.log('🏷️ کدهای تخفیف WELCOME10 و ARVAND50 تعریف شدند.');

    console.log('\n=========================================');
    console.log('🎉 عملیات Seed دیتابیس با موفقیت به پایان رسید!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    if (error.message && error.message.includes('ECONNREFUSED')) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️ پایگاه داده MongoDB روی سیستم شما در حال اجرا نیست.');
      console.log('💡 برای راه‌اندازی سریع یکی از گزینه‌های زیر را انتخاب فرمایید:');
      console.log('   ۱. اگر نرم‌افزار MongoDB را نصب دارید، سرویس آن را استارت کنید.');
      console.log('   ۲. یا از طریق داکر دستور زیر را بزنید: docker run -d -p 27017:27017 mongo');
      console.log('   ۳. یا می‌توانید بدون نیاز به بک‌اند، مستقیماً وارد پوشه frontend شده و با دستورات:');
      console.log('      cd ../frontend -> npm install -> npm run dev');
      console.log('      کل وب‌سایت و فروشگاه را با داده‌های آماده در مرورگر مشاهده کنید.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.error('❌ خطا در عملیات Seed:', error.message || error);
    }
    process.exit(1);
  }
}

seedDatabase();
