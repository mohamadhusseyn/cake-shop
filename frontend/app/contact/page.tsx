'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { toPersianDigits } from '@/store/cartStore';
import { useSiteContent } from '@/context/SiteContentContext';

export default function ContactPage() {
  const { content } = useSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'آبادان',
    subject: 'سفارش کیک مجلسی یا مراسم خاص',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('لطفاً فیلدهای الزامی فرم را تکمیل فرمایید.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success('پیام شما دریافت شد. در اسرع وقت با شما تماس می‌گیریم.');
      setFormData({
        name: '',
        phone: '',
        city: 'آبادان',
        subject: 'سفارش کیک مجلسی یا مراسم خاص',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-roseBakery-100 text-roseBakery-700 text-xs font-bold mb-3">
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>پاسخگویی صمیمانه کارگاه {content.general.brandNameFa}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-bakeryBrown-900 mb-3">
            تماس و سفارش اختصاصی مجالس
          </h1>
          <p className="text-sm sm:text-base text-bakeryBrown-600 leading-relaxed">
            برای هماهنگی کیک‌های عروسی، جشن‌های تولد بزرگ، یا تحویل ویژه در آبادان و خرمشهر با ما در ارتباط باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Info & Social Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone Card */}
            <div className="glass-card rounded-3xl p-6 border border-roseBakery-200/70 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-roseBakery-100 text-roseBakery-600 flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-bakeryBrown-900">تماس تلفنی و مشاوره</h3>
                  <p className="text-xs text-bakeryBrown-500">پاسخگویی از ۹ صبح تا ۹ شب</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 border border-cream-200">
                  <span className="text-xs font-bold text-bakeryBrown-700">تلفن کارگاه ({content.general.brandNameFa}):</span>
                  <a
                    href={`tel:${content.general.phone}`}
                    dir="ltr"
                    className="font-mono font-bold text-sm text-roseBakery-600 hover:text-roseBakery-700"
                  >
                    {content.general.phoneDisplay}
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 border border-cream-200">
                  <span className="text-xs font-bold text-bakeryBrown-700">خط مستقیم سفارش و واتساپ:</span>
                  <a
                    href={`tel:${content.general.mobile}`}
                    dir="ltr"
                    className="font-mono font-bold text-sm text-roseBakery-600 hover:text-roseBakery-700"
                  >
                    {content.general.mobile}
                  </a>
                </div>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="glass-card rounded-3xl p-6 border border-amberWarm-200/70 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amberWarm-100 text-amberWarm-600 flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-bakeryBrown-900">محل کارگاه و تحویل حضوری</h3>
                  <p className="text-xs text-bakeryBrown-500">با هماهنگی قبلی</p>
                </div>
              </div>

              <p className="text-sm text-bakeryBrown-700 leading-relaxed mb-4">
                {content.general.address}
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-amberWarm-800 bg-amberWarm-50 p-3 rounded-2xl border border-amberWarm-200">
                <ClockIcon className="w-5 h-5 text-amberWarm-600 shrink-0" />
                <span>
                  {content.general.workingHours}
                </span>
              </div>
            </div>

            {/* Instagram Link Card */}
            <motion.a
              href={`https://instagram.com/${content.general.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-6 border border-roseBakery-300 shadow-md block hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amberWarm-400 via-roseBakery-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
                    📸
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-bakeryBrown-900">
                      اینستاگرام {content.general.brandNameFa}
                    </h4>
                    <p className="text-xs text-roseBakery-600 font-mono" dir="ltr">
                      @{content.general.instagram}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-roseBakery-600 bg-roseBakery-50 px-3 py-1 rounded-xl">
                  مشاهده عکس‌های روزانه ↗
                </span>
              </div>
            </motion.a>
          </div>

          {/* Right Column: Glassmorphism Contact Form & Interactive Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-bakeryBrown-900 mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-roseBakery-500" />
                <span>ارسال پیام یا استعلام سفارش مراسم</span>
              </h2>
              <p className="text-xs sm:text-sm text-bakeryBrown-600 mb-6">
                مشخصات خود و جزییات درخواستی را یادداشت کنید؛ در سریع‌ترین زمان برای مشاوره با شما تماس خواهیم گرفت.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                      نام و نام خانوادگی <span className="text-roseBakery-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: علی حسینی"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                      شماره تماس همراه <span className="text-roseBakery-500">*</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0916..."
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400 text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                      شهر سکونت
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 font-semibold cursor-pointer"
                    >
                      <option value="آبادان">آبادان</option>
                      <option value="خرمشهر">خرمشهر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                      موضوع پیام
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 font-semibold cursor-pointer"
                    >
                      <option value="سفارش کیک مجلسی یا مراسم خاص">سفارش کیک مجلسی یا مراسم خاص</option>
                      <option value="سفارش عمده نان خرمایی و کلوچه">سفارش عمده نان خرمایی و کلوچه</option>
                      <option value="همکاری یا سوالات دیگر">همکاری یا سوالات دیگر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-bakeryBrown-700 mb-1.5">
                    متن پیام و توضیحات کیک درخواستی <span className="text-roseBakery-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="وزن تقریبی، تم مورد نظر، تاریخ مراسم، و یا هر سوالی دارید برایمان بنویسید..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400 leading-relaxed"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-lg shadow-roseBakery-500/25 flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>ارسال پیام به کارگاه مادر</span>
                      <PaperAirplaneIcon className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Map Placeholder Section */}
            <div className="glass-card rounded-3xl overflow-hidden p-4 border border-cream-200">
              <div className="relative aspect-[16/7] w-full rounded-2xl bg-gradient-to-tr from-cream-200 via-amberWarm-100 to-roseBakery-100 flex items-center justify-center overflow-hidden border border-cream-300">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#CEB27E_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 text-center flex flex-col items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-roseBakery-500 text-white flex items-center justify-center shadow-lg mb-2 animate-bounce">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-bakeryBrown-900 text-sm">
                    موقعیت مکانی کارگاه در مرکز شهر آبادان
                  </h4>
                  <p className="text-xs text-bakeryBrown-600 mt-0.5">
                    دسترسی آسان از خیابان امیری و خیابان زند
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
