'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { INITIAL_PRODUCTS, Product } from '@/lib/api';
import { useCartStore, formatPrice, toPersianDigits } from '@/store/cartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Find product or fallback to first product
  const product: Product = useMemo(() => {
    const found = INITIAL_PRODUCTS.find((p) => p.id === params.id);
    return found || INITIAL_PRODUCTS[0];
  }, [params.id]);

  // Gallery Active Image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Customization States
  const weights = product.availableWeights || [
    { weight: '۱ کیلوگرم', multiplier: 1 },
    { weight: '۱.۵ کیلوگرم', multiplier: 1.5 },
    { weight: '۲ کیلوگرم', multiplier: 2.0 },
  ];

  const [selectedWeight, setSelectedWeight] = useState(weights[0]);
  const [selectedFilling, setSelectedFilling] = useState(
    product.fillings ? product.fillings[0] : 'ساده خانگی'
  );
  const [selectedRibbon, setSelectedRibbon] = useState(
    product.ribbonColors ? product.ribbonColors[0] : { name: 'رز گلد', hex: '#E0A99E' }
  );
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Instant Live Price Calculation
  const unitPrice = Math.round(product.basePrice * selectedWeight.multiplier);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: unitPrice,
      image: product.images[activeImageIndex] || product.images[0],
      weight: selectedWeight.weight,
      filling: selectedFilling,
      customText: customText.trim() ? customText : undefined,
      ribbonColor: selectedRibbon.name,
      quantity: quantity,
    });

    toast.success(`${product.title} به سبد خرید شما اضافه شد.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-bakeryBrown-500 mb-8">
          <Link href="/" className="hover:text-roseBakery-600 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-roseBakery-600 transition-colors">
            محصولات
          </Link>
          <span>/</span>
          <span className="text-bakeryBrown-800 font-bold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* =========================================================================
              LEFT (RTL RIGHT): IMAGE GALLERY
          ========================================================================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Preview Image */}
            <motion.div
              layout
              className="relative aspect-square w-full rounded-3xl overflow-hidden glass-card border border-white shadow-xl bg-cream-100"
            >
              <Image
                src={product.images[activeImageIndex]}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {product.isSpecial && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amberWarm-500/90 text-white text-xs font-bold backdrop-blur-md shadow-md">
                  <SparklesIcon className="w-4 h-4" />
                  <span>دستور پخت ویژه مادر</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-roseBakery-500 shadow-md scale-105'
                        : 'border-cream-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Badge Box */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center justify-center">
                <TruckIcon className="w-6 h-6 text-roseBakery-500 mb-1" />
                <span className="text-[11px] font-bold text-bakeryBrown-800">
                  فقط آبادان و خرمشهر
                </span>
                <span className="text-[10px] text-bakeryBrown-500">حمل با باکس عایق</span>
              </div>
              <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center justify-center">
                <ClockIcon className="w-6 h-6 text-amberWarm-500 mb-1" />
                <span className="text-[11px] font-bold text-bakeryBrown-800">
                  پخت روزانه
                </span>
                <span className="text-[10px] text-bakeryBrown-500">تحویل گرم و خنک</span>
              </div>
              <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold text-bakeryBrown-800">
                  مواد ۱۰۰٪ طبیعی
                </span>
                <span className="text-[10px] text-bakeryBrown-500">بدون مواد نگهدارنده</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT (RTL LEFT): DETAILS & LIVE CUSTOMIZATION
          ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-roseBakery-600 bg-roseBakery-50 px-3 py-1 rounded-full">
                  {product.category === 'cake'
                    ? 'کیک سفارشی'
                    : product.category === 'bread'
                    ? 'نان اصیل جنوبی'
                    : 'کلوچه سنتی'}
                </span>
                <div className="flex items-center gap-1 text-amberWarm-500 font-bold text-xs">
                  <StarIcon className="w-4 h-4 fill-amberWarm-400" />
                  <span>{toPersianDigits(product.rating.toFixed(1))}</span>
                  <span className="text-bakeryBrown-400">
                    ({toPersianDigits(product.reviewCount)} نظر مشتریان)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-bakeryBrown-900 leading-tight mb-3">
                {product.title}
              </h1>

              <p className="text-sm sm:text-base text-bakeryBrown-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Customization Section */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border border-roseBakery-100/80 space-y-5">
              <h3 className="text-base font-bold text-bakeryBrown-900 flex items-center gap-2 border-b border-cream-200 pb-2">
                <SparklesIcon className="w-5 h-5 text-roseBakery-500" />
                <span>شخصی‌سازی زنده سفارش</span>
              </h3>

              {/* 1. Weight Selection */}
              <div>
                <label className="block text-xs font-bold text-bakeryBrown-700 mb-2">
                  ۱. انتخاب وزن یا حجم:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {weights.map((w, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`p-3 rounded-2xl text-xs sm:text-sm font-bold text-right border transition-all flex items-center justify-between ${
                        selectedWeight.weight === w.weight
                          ? 'border-roseBakery-500 bg-roseBakery-50/70 text-roseBakery-700 shadow-sm'
                          : 'border-cream-300 bg-white/70 text-bakeryBrown-700 hover:bg-cream-100'
                      }`}
                    >
                      <span>{w.weight}</span>
                      {selectedWeight.weight === w.weight && (
                        <CheckIcon className="w-4 h-4 text-roseBakery-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Filling / Flavor Selection (if available) */}
              {product.fillings && product.fillings.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-2">
                    ۲. طعم و فیلینگ داخلی:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.fillings.map((filling, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedFilling(filling)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-right border transition-all ${
                          selectedFilling === filling
                            ? 'border-roseBakery-500 bg-roseBakery-50 text-roseBakery-700'
                            : 'border-cream-300 bg-white/70 text-bakeryBrown-700 hover:bg-cream-100'
                        }`}
                      >
                        {filling}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Ribbon Color Selection */}
              {product.ribbonColors && product.ribbonColors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-2">
                    ۳. رنگ روبان و تزیین جعبه:
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {product.ribbonColors.map((ribbon, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedRibbon(ribbon)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedRibbon.name === ribbon.name
                            ? 'border-roseBakery-600 bg-white shadow-md ring-2 ring-roseBakery-400'
                            : 'border-cream-300 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: ribbon.hex }}
                        />
                        <span>{ribbon.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Custom Cake Message */}
              {product.category === 'cake' && (
                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                    ۴. متن دست‌نویس روی کیک (یا کارت هدیه):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="مثال: مادر عزیزم روزت مبارک، همیشه سلامت باشی..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                    maxLength={60}
                  />
                  <div className="flex justify-between text-[11px] text-bakeryBrown-400 mt-1">
                    <span>خط نستعلیق با شکلات یا کرم مخصوص</span>
                    <span>{toPersianDigits(60 - customText.length)} کاراکتر باقیمانده</span>
                  </div>
                </div>
              )}

              {/* 5. Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-bakeryBrown-700">تعداد سفارش:</span>
                <div className="flex items-center gap-3 bg-white/90 p-1 rounded-2xl border border-cream-300">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-cream-100 hover:bg-roseBakery-100 text-bakeryBrown-700 flex items-center justify-center transition-colors"
                    aria-label="کاهش تعداد"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-base min-w-[28px] text-center text-bakeryBrown-900">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl bg-cream-100 hover:bg-roseBakery-100 text-bakeryBrown-700 flex items-center justify-center transition-colors"
                    aria-label="افزایش تعداد"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Breakdown & CTA Sticky Box */}
            <div className="rounded-3xl glass-card p-5 sm:p-6 border border-roseBakery-200/80 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-bakeryBrown-500 block">مبلغ نهایی سفارش:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-roseBakery-600">
                      {formatPrice(totalPrice)}
                    </span>
                    {quantity > 1 && (
                      <span className="text-xs text-bakeryBrown-400">
                        ({toPersianDigits(quantity)} عدد × {formatPrice(unitPrice)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    آماده‌سازی پخت روز
                  </span>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="p-3 rounded-2xl bg-amberWarm-50 border border-amberWarm-200/60 mb-5 text-xs text-bakeryBrown-800 leading-relaxed flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-amberWarm-600 shrink-0" />
                <span>
                  تحویل درب منزل با پیک اختصاصی در <strong>آبادان و خرمشهر</strong> در زمان و ساعت هماهنگ شده.
                </span>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-2xl glass-button text-bakeryBrown-900 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBagIcon className="w-5 h-5 text-roseBakery-500" />
                  <span>افزودن به سبد خرید</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 hover:from-roseBakery-600 hover:to-roseBakery-700 text-white font-bold text-sm shadow-lg shadow-roseBakery-500/25 flex items-center justify-center gap-2"
                >
                  <span>ثبت سفارش و تسویه</span>
                  <ArrowRightIcon className="w-4 h-4 rotate-180" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
