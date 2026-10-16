'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useCartStore, formatPrice, toPersianDigits } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Checkout Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'آبادان' | 'خرمشهر' | 'سایر'>('آبادان');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('فردا (نوبت اول پخت)');
  const [timeSlot, setTimeSlot] = useState('عصر (۱۷ الی ۲۱)');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      if (user.fullName) setName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.city && (user.city === 'آبادان' || user.city === 'خرمشهر')) {
        setCity(user.city);
      }
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roseBakery-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getTotalPrice();

  // Delivery Cost calculation
  // Free delivery for orders above 1,200,000 Tomans
  const isFreeDelivery = subtotal >= 1200000;
  let deliveryFee = 0;
  if (!isFreeDelivery && items.length > 0) {
    if (city === 'آبادان') deliveryFee = 35000;
    else if (city === 'خرمشهر') deliveryFee = 45000;
    else deliveryFee = 0;
  }

  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('سبد خرید شما خالی است.');
      return;
    }

    if (city === 'سایر') {
      toast.error('ارسال به شهرهای دیگر مقدور نیست. لطفاً یکی از دو شهر آبادان یا خرمشهر را انتخاب فرمایید.');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('لطفاً مشخصات تحویل‌گیرنده و آدرس دقیق را وارد فرمایید.');
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Gateway & Order Placement
    setTimeout(() => {
      setIsProcessing(false);
      const generatedId = `MDR-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setOrderComplete(true);
      clearCart();
      toast.success('سفارش شما با موفقیت در نوبت پخت ثبت گردید.');
    }, 1500);
  };

  // SUCCESS STATE VIEW
  if (orderComplete) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full rounded-3xl glass-card p-8 md:p-10 text-center border border-emerald-300 shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircleIcon className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            سفارش با موفقیت ثبت شد
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-bakeryBrown-900 mt-3 mb-2">
            مبارک باشد! سفارش در نوبت فر قرار گرفت
          </h2>

          <p className="text-sm text-bakeryBrown-600 leading-relaxed mb-6">
            شماره پیگیری سفارش شما: <strong className="text-roseBakery-600 font-mono text-base">{orderId}</strong>
            <br />
            همکاران ما در کارگاه مادر پیش از ارسال با شماره {phone} هماهنگ خواهند شد.
          </p>

          <div className="bg-cream-100 p-4 rounded-2xl border border-cream-300 text-right text-xs text-bakeryBrown-700 space-y-1.5 mb-8">
            <div className="flex justify-between">
              <span>مقصد تحویل:</span>
              <strong className="text-bakeryBrown-900">{city} - {address}</strong>
            </div>
            <div className="flex justify-between">
              <span>زمان ارسال:</span>
              <strong className="text-bakeryBrown-900">{deliveryDate} ({timeSlot})</strong>
            </div>
            <div className="flex justify-between">
              <span>مبلغ پرداختی:</span>
              <strong className="text-roseBakery-600">{formatPrice(grandTotal)}</strong>
            </div>
          </div>

          <Link href="/">
            <button className="w-full py-3.5 px-6 rounded-2xl bg-bakeryBrown-800 text-cream-50 font-bold text-sm hover:bg-bakeryBrown-900 transition-colors">
              بازگشت به صفحه اصلی کارگاه
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // EMPTY STATE VIEW
  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl glass-card p-8 text-center border border-cream-300 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-roseBakery-50 text-roseBakery-500 flex items-center justify-center mx-auto mb-4">
            <ShoppingBagIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-bakeryBrown-900 mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-sm text-bakeryBrown-600 mb-8 leading-relaxed">
            محصولات تازه و خوش‌طعم پخت امروز در انتظار شما هستند. سری به منوی کارگاه بزنید!
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-lg shadow-roseBakery-500/25"
            >
              مشاهده منوی محصولات
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-bakeryBrown-900 mb-2">
            سبد خرید و تکمیل سفارش
          </h1>
          <p className="text-sm text-bakeryBrown-600">
            بررسی اقلام انتخابی و ثبت آدرس تحویل اختصاصی در شهرهای آبادان و خرمشهر
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* =========================================================================
              ITEMS LIST (COL 7)
          ========================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <span className="text-sm font-bold text-bakeryBrown-800">
                اقلام درخواستی ({toPersianDigits(items.length)} قلم)
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-roseBakery-600 hover:text-roseBakery-700 font-semibold"
              >
                پاک کردن همه اقلام
              </button>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-3xl glass-card p-4 sm:p-5 border border-cream-200 flex flex-col sm:flex-row items-center gap-4 relative shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-cream-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full text-right space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-bold text-bakeryBrown-900">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-bakeryBrown-400 hover:text-roseBakery-600 p-1 rounded-lg transition-colors"
                        title="حذف از سبد"
                        aria-label="حذف آیتم"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-bakeryBrown-600 pt-1">
                      <span className="bg-cream-100 px-2 py-0.5 rounded-md font-medium border border-cream-300">
                        وزن: {item.weight}
                      </span>
                      {item.filling && (
                        <span className="bg-cream-100 px-2 py-0.5 rounded-md font-medium border border-cream-300">
                          طعم: {item.filling}
                        </span>
                      )}
                      {item.ribbonColor && (
                        <span className="bg-cream-100 px-2 py-0.5 rounded-md font-medium border border-cream-300">
                          روبان: {item.ribbonColor}
                        </span>
                      )}
                    </div>

                    {item.customText && (
                      <p className="text-xs text-roseBakery-700 bg-roseBakery-50 px-2.5 py-1 rounded-md mt-1 inline-block">
                        متن کیک: «{item.customText}»
                      </p>
                    )}

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-sm font-extrabold text-roseBakery-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2 bg-white/80 p-1 rounded-xl border border-cream-300">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-roseBakery-100 flex items-center justify-center text-bakeryBrown-700"
                          aria-label="کاهش"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs min-w-[20px] text-center">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-roseBakery-100 flex items-center justify-center text-bakeryBrown-700"
                          aria-label="افزایش"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* =========================================================================
              CHECKOUT & CITY VALIDATION FORM (COL 5)
          ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-roseBakery-200/80 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-bakeryBrown-900 border-b border-cream-200 pb-3">
                اطلاعات تحویل و پرداخت
              </h3>

              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Name & Phone */}
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                    نام و نام خانوادگی گیرنده <span className="text-roseBakery-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: رضا دریس"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                    شماره همراه جهت هماهنگی پیک <span className="text-roseBakery-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0916..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400 text-right"
                  />
                </div>

                {/* STRICT CITY VALIDATION SECTION */}
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                    شهر تحویل سفارش <span className="text-roseBakery-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['آبادان', 'خرمشهر', 'سایر'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                          city === c
                            ? c === 'سایر'
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-roseBakery-500 text-white border-roseBakery-600 shadow-sm'
                            : 'bg-white/70 text-bakeryBrown-700 border-cream-300 hover:bg-cream-100'
                        }`}
                      >
                        {c === 'سایر' ? 'سایر شهرها' : c}
                      </button>
                    ))}
                  </div>

                  {/* Warning if other city selected */}
                  {city === 'سایر' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3.5 rounded-2xl bg-roseBakery-50 border border-roseBakery-300 text-roseBakery-800 text-xs leading-relaxed flex items-start gap-2"
                    >
                      <ExclamationTriangleIcon className="w-5 h-5 text-roseBakery-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>همراه گرامی:</strong> متأسفانه فعلاً به دلیل حفظ نهایت تازگی، بافت لطیف خامه و دمای کیک‌ها در گرمای جنوب، ارسال مستقیم با پیک اختصاصی کارگاه <strong>فقط به آبادان و خرمشهر</strong> انجام می‌شود.
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                    نشانی دقیق پستی و شماره زنگ <span className="text-roseBakery-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="نام محله، خیابان، کوچه، پلاک، طبقه و واحد..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                  />
                </div>

                {/* Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                      روز تحویل
                    </label>
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-bakeryBrown-900 font-semibold cursor-pointer"
                    >
                      <option value="فردا (نوبت اول پخت)">فردا (نوبت اول پخت)</option>
                      <option value="پس‌فردا">پس‌فردا</option>
                      <option value="پنج‌شنبه عصر">پنج‌شنبه عصر</option>
                      <option value="جمعه صبح">جمعه صبح</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                      بازه ساعتی
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-bakeryBrown-900 font-semibold cursor-pointer"
                    >
                      <option value="صبح (۱۰ الی ۱۳)">صبح (۱۰ الی ۱۳)</option>
                      <option value="عصر (۱۷ الی ۲۱)">عصر (۱۷ الی ۲۱)</option>
                    </select>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1">
                    یادداشت یا هماهنگی خاص (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: شمع تولد و کارد یکبارمصرف هم قرار دهید..."
                    className="w-full px-4 py-2 rounded-xl glass-input text-xs text-bakeryBrown-900 placeholder-bakeryBrown-400"
                  />
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-3 border-t border-cream-200 space-y-2 text-xs text-bakeryBrown-700">
                  <div className="flex justify-between">
                    <span>مجموع قیمت اقلام:</span>
                    <span className="font-bold text-bakeryBrown-900">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <TruckIcon className="w-4 h-4 text-roseBakery-500" />
                      هزینه ارسال اختصاصی ({city}):
                    </span>
                    <span className="font-bold text-bakeryBrown-900">
                      {isFreeDelivery
                        ? 'رایگان (سفارش بالای ۱.۲ میلیون)'
                        : city === 'سایر'
                        ? 'غیر قابل ارسال'
                        : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-cream-300 flex justify-between items-center text-sm sm:text-base">
                    <span className="font-black text-bakeryBrown-900">مبلغ نهایی قابل پرداخت:</span>
                    <span className="font-black text-roseBakery-600 text-lg">
                      {city === 'سایر' ? '—' : formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing || city === 'سایر'}
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                    city === 'سایر'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 via-roseBakery-600 to-roseBakery-500 hover:from-emerald-700 hover:to-roseBakery-600 text-white shadow-roseBakery-500/25'
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>اتصال به درگاه امن پرداخت و ثبت سفارش</span>
                      <ShieldCheckIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
