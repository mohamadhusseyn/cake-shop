'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCakeName?: string;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  defaultCakeName = 'سفارش پخت هفتگی',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'آبادان' | 'خرمشهر'>('آبادان');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error('لطفاً شماره تماس معتبر وارد فرمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    if (!name.trim()) {
      toast.error('لطفاً نام و نام خانوادگی خود را بنویسید.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success('درخواست شما در نوبت پخت ثبت شد! به زودی با شما تماس می‌گیریم.');
    }, 800);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-bakeryBrown-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl glass-card p-6 md:p-8 shadow-2xl border border-roseBakery-200/50"
          >
            {/* Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute left-4 top-4 p-2 text-bakeryBrown-500 hover:text-roseBakery-600 transition-colors rounded-full hover:bg-roseBakery-50"
              aria-label="بستن پنجره"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="flex items-center gap-2 mb-2 text-roseBakery-600 font-medium text-sm">
                  <SparklesIcon className="w-5 h-5 animate-pulse" />
                  <span>ثبت‌نام در لیست انتظار پخت اختصاصی</span>
                </div>

                <h3 className="text-2xl font-bold text-bakeryBrown-900 mb-2">
                  رزرو پخت روز کارگاه مادر
                </h3>
                <p className="text-sm text-bakeryBrown-600 mb-6 leading-relaxed">
                  به دلیل پخت روزانه و سنتی با ظرفیت محدود، سفارش‌ها سریع تکمیل می‌شوند. شماره خود را بگذارید تا هنگام باز شدن ظرفیت یا نوبت جدید با شما هماهنگ شویم.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-bakeryBrown-700 mb-1">
                      محصول مورد نظر
                    </label>
                    <input
                      type="text"
                      disabled
                      value={defaultCakeName}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-100 text-bakeryBrown-800 text-sm border border-cream-300 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bakeryBrown-700 mb-1">
                        نام و نام خانوادگی <span className="text-roseBakery-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مریم عامری"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-bakeryBrown-700 mb-1">
                        شماره همراه (آبادان/خرمشهر) <span className="text-roseBakery-500">*</span>
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
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bakeryBrown-700 mb-1">
                      شهر مقصد تحویل
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['آبادان', 'خرمشهر'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCity(c)}
                          className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                            city === c
                              ? 'bg-roseBakery-500 text-white border-roseBakery-600 shadow-md shadow-roseBakery-500/20'
                              : 'bg-white/60 text-bakeryBrown-700 border-cream-300 hover:bg-cream-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bakeryBrown-700 mb-1">
                      یادداشت یا تاریخ درخواستی (اختیاری)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="اگر برای تاریخ خاصی مثل تولد یا سالگرد است، اینجا بنویسید..."
                      className="w-full px-4 py-2 rounded-xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amberWarm-500 via-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-lg shadow-roseBakery-500/30 hover:shadow-xl hover:shadow-roseBakery-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ثبت در اولویت لیست پخت</span>
                        <SparklesIcon className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-bakeryBrown-900 mb-2">
                  نوبت شما با مهر ثبت شد!
                </h4>
                <p className="text-sm text-bakeryBrown-600 mb-6 max-w-sm mx-auto leading-relaxed">
                  از همراهی شما با کارگاه مادر سپاسگزاریم. به محض آغاز بارگیری فرها برای شهر {city}، از طریق پیامک و تماس تلفنی با شماره {phone} به شما اطلاع‌رسانی خواهد شد.
                </p>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-bakeryBrown-800 text-cream-50 text-sm font-semibold hover:bg-bakeryBrown-900 transition-colors"
                >
                  متوجه شدم، بازگشت
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
