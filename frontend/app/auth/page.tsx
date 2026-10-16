'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { toPersianDigits } from '@/store/cartStore';

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, logout } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();

    // Iranian phone regex: starts with 09 and 11 digits total
    const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
    if (!cleanPhone.startsWith('09') || cleanPhone.length !== 11) {
      toast.error('لطفاً شماره موبایل معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(120);
      setCanResend(false);
      toast.success(`کد تایید پیامکی به شماره ${cleanPhone} ارسال شد.`);
      // Focus first otp input after step changes
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }, 700);
  };

  // Step 2: Handle OTP input digit change & auto advance
  const handleOtpChange = (index: number, val: string) => {
    // Only accept numeric
    const cleanVal = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (cleanVal && index === 5 && newOtp.every((d) => d !== '')) {
      verifyAndLogin(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verification & Login
  const verifyAndLogin = (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      toast.error('لطفاً کد ۶ رقمی را کامل وارد نمایید.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const fakeToken = `jwt_token_${Date.now()}`;
      login(phone, fakeToken, {
        fullName: 'همراه ارجمند کارگاه',
        city: 'آبادان',
      });
      toast.success('خوش آمدید! ورود موفقیت‌آمیز بود.');
      router.push('/cart');
    }, 900);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(120);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    toast.success('کد جدید ارسال شد.');
    otpInputsRef.current[0]?.focus();
  };

  // If already logged in, show profile state
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl glass-card p-8 text-center border border-roseBakery-200 shadow-2xl">
          <div className="w-16 h-16 bg-roseBakery-100 text-roseBakery-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-bakeryBrown-900 mb-1">
            حساب کاربری کارگاه مادر
          </h2>
          <p className="text-sm text-bakeryBrown-600 mb-6 font-mono" dir="ltr">
            {user.phone}
          </p>

          <div className="bg-cream-100 p-4 rounded-2xl border border-cream-200 text-right text-xs text-bakeryBrown-800 space-y-2 mb-6">
            <div className="flex justify-between">
              <span>نام کاربر:</span>
              <span className="font-bold">{user.fullName || 'کاربر مهمان'}</span>
            </div>
            <div className="flex justify-between">
              <span>شهر تحویل:</span>
              <span className="font-bold">{user.city || 'آبادان'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/products">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-md">
                مشاهده منوی محصولات
              </button>
            </Link>
            <button
              onClick={() => {
                logout();
                toast.success('با موفقیت از حساب کاربری خارج شدید.');
              }}
              className="w-full py-3 rounded-xl glass-button text-bakeryBrown-700 font-bold text-sm"
            >
              خروج از حساب کاربری
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
      {/* Background Subtle Blobs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amberWarm-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-roseBakery-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl glass-card p-6 sm:p-10 border border-white/80 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amberWarm-400 via-roseBakery-500 to-roseBakery-600 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-roseBakery-500/20">
            🎂
          </div>
          <h2 className="text-2xl font-black text-bakeryBrown-900">
            ورود به کارگاه کیک مادر
          </h2>
          <p className="text-xs sm:text-sm text-bakeryBrown-600 mt-1">
            پیگیری سفارش‌ها و رزرو اختصاصی پخت برای آبادان و خرمشهر
          </p>
        </div>

        {/* STEP 1: PHONE NUMBER INPUT */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleRequestOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-bakeryBrown-700 mb-2">
                  شماره موبایل خود را وارد نمایید:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0916 123 4567"
                    className="w-full pl-14 pr-11 py-3.5 rounded-2xl glass-input text-base text-bakeryBrown-900 font-mono tracking-wider placeholder-bakeryBrown-400 text-left"
                  />
                  {/* Phone Icon */}
                  <PhoneIcon className="w-5 h-5 text-bakeryBrown-400 absolute right-3.5" />
                  {/* Iran Flag Badge */}
                  <span className="absolute left-3.5 flex items-center gap-1 text-xs font-bold text-bakeryBrown-600 bg-cream-200/80 px-2 py-1 rounded-lg">
                    <span>🇮🇷</span>
                    <span>+۹۸</span>
                  </span>
                </div>
                <p className="text-[11px] text-bakeryBrown-500 mt-2">
                  کد تایید یکبار مصرف ۶ رقمی برای این شماره پیامک خواهد شد.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-xl shadow-roseBakery-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>دریافت کد تایید پیامکی</span>
                    <ArrowRightIcon className="w-4 h-4 rotate-180" />
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            /* STEP 2: 6-DIGIT OTP INPUT */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="text-xs text-bakeryBrown-500">
                  کد تایید ۶ رقمی به شماره زیر ارسال شد:
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-mono font-bold text-sm text-bakeryBrown-900" dir="ltr">
                    {phone}
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-roseBakery-600 hover:underline font-semibold"
                  >
                    (ویرایش)
                  </button>
                </div>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-2xl glass-input text-bakeryBrown-900 border-2 border-cream-300 focus:border-roseBakery-500 focus:bg-white shadow-sm transition-all"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-center text-xs text-bakeryBrown-600">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="inline-flex items-center gap-1 font-bold text-roseBakery-600 hover:text-roseBakery-700 transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>ارسال مجدد کد تایید</span>
                  </button>
                ) : (
                  <span>
                    ارسال مجدد کد پس از{' '}
                    <strong className="text-roseBakery-600 font-mono">
                      {toPersianDigits(Math.floor(timer / 60))}:
                      {toPersianDigits((timer % 60).toString().padStart(2, '0'))}
                    </strong>
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || otp.join('').length < 6}
                onClick={() => verifyAndLogin()}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                  otp.join('').length === 6
                    ? 'bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white shadow-roseBakery-500/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تایید و ورود به سایت</span>
                    <ShieldCheckIcon className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Link */}
        <div className="mt-8 pt-4 border-t border-cream-200 text-center">
          <Link href="/" className="text-xs text-bakeryBrown-500 hover:text-roseBakery-600">
            بازگشت به صفحه اصلی کارگاه
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
