# 🍰 راهنمای کامل انتشار سایت قنادی خانگی

## 📋 خلاصه معماری

```
Frontend (Next.js) → Netlify (رایگان)
Backend (Express/Node) → Render.com یا Railway.app (رایگان)
Database → MongoDB Atlas (رایگان)
```

---

## 🐛 باگ‌هایی که الان رفع شدند

> [!IMPORTANT]
> این باگ‌ها توسط Antigravity پیدا و برطرف شدند:

### ۱. سفارش‌ها در پنل ادمین نمایش داده نمی‌شدند
**ریشه مشکل:** در `frontend/app/admin/orders/page.tsx` شرط `orders.length > 0` باعث می‌شد وقتی هیچ سفارشی در دیتابیس نبود یا مشتری جدید سفارش می‌داد، کد به داده‌های نمونه (Fallback) برگردد — نه سفارشات واقعی!

**رفع شد:** حالا هر وقت API موفق پاسخ داد، داده واقعی نمایش داده می‌شود.

### ۲. مشتریان جدید در پنل ادمین نمایش داده نمی‌شدند
**همین مشکل در** `frontend/app/admin/customers/page.tsx` هم وجود داشت.

### ۳. امکان حذف مشتری وجود نداشت
**اضافه شد:** دکمه 🗑️ حذف در لیست مشتریان + دیالوگ تأیید + API Backend جدید

---

## 🗄️ مرحله ۱ — راه‌اندازی MongoDB Atlas

### گام‌ها:
1. به [mongodb.com/atlas](https://www.mongodb.com/atlas) بروید
2. ثبت‌نام رایگان کنید
3. یک **Cluster** جدید بسازید (گزینه M0 رایگان)
4. در بخش **Database Access** یک کاربر با رمز عبور بسازید
5. در بخش **Network Access** گزینه **Allow from Anywhere** را انتخاب کنید: `0.0.0.0/0`
6. روی Cluster کلیک کنید → **Connect** → **Drivers** → آدرس Connection String را کپی کنید

Connection String شبیه این است:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cake-shop?retryWrites=true&w=majority
```

---

## ☁️ مرحله ۲ — آپلود Backend روی Render.com

### گام‌ها:
1. به [render.com](https://render.com) بروید و ثبت‌نام کنید
2. **New Web Service** بزنید
3. گزینه **Deploy from Git Repo** را انتخاب کنید

### تنظیمات Render:
| تنظیم | مقدار |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Environment | `Node` |

### متغیرهای محیطی در Render:
```
MONGODB_URI = (آدرس MongoDB Atlas که از مرحله ۱ گرفتید)
JWT_SECRET = یک_رمز_قوی_تصادفی_بنویسید
JWT_EXPIRES_IN = 7d
PORT = 5000
FRONTEND_URL = https://your-site.netlify.app
NODE_ENV = production
```

> [!TIP]
> آدرس Backend شما بعد از Deploy چیزی شبیه `https://cake-shop-backend.onrender.com` خواهد بود.

---

## 🌐 مرحله ۳ — آپلود Frontend روی Netlify

### گام‌ها:
1. به [netlify.com](https://netlify.com) بروید و ثبت‌نام کنید
2. **Add new site** → **Import an existing project** → **Deploy with GitHub**
3. ریپوی گیت‌هاب را انتخاب کنید

### تنظیمات Netlify:
| تنظیم | مقدار |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/.next` |

### متغیرهای محیطی در Netlify:
```
NEXT_PUBLIC_API_URL = https://cake-shop-backend.onrender.com/api
NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
```

---

## 📂 مرحله ۴ — آپلود روی GitHub

### ۴.۱ — ایجاد `.gitignore` مناسب برای ریشه پروژه

در پوشه `cake-shop` یک `.gitignore` جامع دارید. اطمینان حاصل کنید:

**`backend/.gitignore`** باید شامل:
```
node_modules/
.env
```

**`frontend/.gitignore`** باید شامل:
```
node_modules/
.next/
.env.local
```

### ۴.۲ — دستورات Git

```bash
# رفتن به پوشه cake-shop
cd "C:\Users\Mohamadhosseyn Jorfi\Desktop\New folder (2)\cake-shop"

# اگر Git هنوز initialize نشده:
git init
git remote add origin https://github.com/username/cake-shop.git

# اضافه کردن همه فایل‌ها
git add .
git commit -m "🍰 Initial commit - Persian Cake Shop"
git push -u origin main
```

### ۴.۳ — نکات مهم امنیتی

> [!CAUTION]
> هرگز فایل‌های `.env` و `.env.local` را در GitHub آپلود نکنید!

---

## 💳 مرحله ۵ — اتصال درگاه پرداخت

### گزینه‌های پرداخت در ایران:

| درگاه | سایت | مناسب برای |
|---|---|---|
| **زرین‌پال** | zarinpal.com | بیشترین پشتیبانی |
| **IDPay** | idpay.ir | آسان‌ترین راه‌اندازی |
| **سامان** | sep.shaparak.ir | بانک محور |
| **پی‌پینگ** | payping.ir | ساده |

### راه‌اندازی با زرین‌پال (پیشنهادی):

#### در Backend — اضافه کردن مسیر پرداخت:

```javascript
// backend/routes/payment.js
const axios = require('axios');
const Order = require('../models/Order');

const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID;
const CALLBACK_URL = `${process.env.BACKEND_URL}/api/payment/verify`;

// شروع پرداخت
router.post('/request', verifyToken, async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  
  const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
    merchant_id: ZARINPAL_MERCHANT,
    amount: order.finalPrice * 10, // تومان به ریال
    description: `سفارش قنادی خانگی - ${order.orderNumber}`,
    callback_url: CALLBACK_URL,
    metadata: { orderId: order._id.toString() }
  });
  
  const { authority } = response.data.data;
  order.paymentAuthority = authority;
  await order.save();
  
  res.json({
    success: true,
    paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`
  });
});

// تأیید پرداخت
router.get('/verify', async (req, res) => {
  const { Authority, Status } = req.query;
  
  if (Status !== 'OK') {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
  
  const order = await Order.findOne({ paymentAuthority: Authority });
  
  const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', {
    merchant_id: ZARINPAL_MERCHANT,
    amount: order.finalPrice * 10,
    authority: Authority
  });
  
  if (response.data.data.code === 100) {
    order.paymentStatus = 'paid';
    order.status = 'در حال پخت با عشق';
    await order.save();
    
    return res.redirect(`${process.env.FRONTEND_URL}/payment-success?order=${order.orderNumber}`);
  }
  
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
});
```

#### متغیرهای محیطی اضافه در Render:
```
ZARINPAL_MERCHANT_ID = your-merchant-id-from-zarinpal
BACKEND_URL = https://cake-shop-backend.onrender.com
```

#### در `server.js` مسیر را اضافه کنید:
```javascript
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);
```

---

## 💡 ایده‌های بهبود سایت

### ۱. اعلان Push (پنل ادمین)
وقتی سفارش جدید می‌رسد، یک صدای بیپ یا نوتیفیکیشن مرورگر به ادمین نشان داده شود.

### ۲. Auto-refresh سفارشات
هر ۳۰ ثانیه یک‌بار لیست سفارشات به‌طور خودکار بروزرسانی شود.

### ۳. صفحه رهگیری سفارش برای مشتری
مشتری با شماره سفارش بتواند وضعیت سفارشش را ببیند (بدون نیاز به ورود).

### ۴. داشبورد گزارشات پیشرفته
نمودار فروش روزانه/هفتگی، محصول پرفروش، شهر فعال‌تر.

### ۵. سیستم رتبه‌بندی مشتریان
مشتریان با خرید بالای X تومان VIP شوند و تخفیف خودکار دریافت کنند.

### ۶. لینک واتساپ سریع
در صفحه تأیید سفارش یک دکمه برای ارسال پیام مستقیم به واتساپ کارگاه.

---

> [!NOTE]
> Backend روی Render.com در نسخه رایگان بعد از ۱۵ دقیقه بی‌فعالیت به خواب می‌رود. برای جلوگیری، از سرویس [uptimerobot.com](https://uptimerobot.com) استفاده کنید تا هر ۵ دقیقه یک‌بار به `/api/health` پینگ بزند.
