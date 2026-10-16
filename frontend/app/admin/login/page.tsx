'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('لطفاً نام کاربری را وارد فرمایید.');
      return;
    }
    if (!password) {
      setErrorMsg('لطفاً کلمه عبور را وارد فرمایید.');
      return;
    }

    setLoading(true);

    try {
      let success = false;
      let token = '';
      let adminData = {
        id: 'admin_id',
        username: username.trim(),
        name: 'مدیر ارشد کارگاه کیک مادر',
        role: 'admin' as const,
      };

      // ۱. تلاش برای لاگین از طریق API بک‌اند
      try {
        const response = await api.post('/auth/admin-login', {
          username: username.trim(),
          password,
        });

        if (response.data?.success && response.data?.token) {
          success = true;
          token = response.data.token;
          if (response.data.admin) {
            adminData = response.data.admin;
          }
        }
      } catch (apiErr) {
        // در صورت خاموش بودن بک‌اند یا اجرا روی نتلیفای، از اعتبارسنجی لوکال استفاده می‌شود
        console.warn('Backend API unreachable, checking standard admin credentials...');
      }

      // ۲. بررسی اعتبارسنجی لوکال در صورت آفلاین بودن بک‌اند
      if (!success) {
        if (
          (username.trim().toLowerCase() === 'admin' && password === 'admin123456') ||
          (username.trim() === '09160000000' && password === 'admin123456')
        ) {
          success = true;
          token = 'madar_admin_offline_token_' + Date.now();
        }
      }

      if (success) {
        login(token, adminData);
        toast.success('خوش آمدید! ورود به پنل کارگاه با موفقیت انجام شد');
        router.push('/admin');
        return;
      }

      const msg = 'نام کاربری یا رمز عبور اشتباه است. (پیش‌فرض: admin و رمز: admin123456)';
      setErrorMsg(msg);
      toast.error('نام کاربری یا رمز عبور اشتباه است.');
    } catch (err: any) {
      setErrorMsg('خطایی رخ داد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0908] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0A0908] to-black flex items-center justify-center p-4 relative overflow-hidden font-vazir">
      {/* Ambient background glow & particles */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative rounded-3xl bg-[#141210]/80 backdrop-blur-2xl border border-stone-800/90 shadow-2xl shadow-black/80 p-8 sm:p-10">
          {/* Top Logo & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 mb-4 relative"
            >
              <span className="text-4xl">🎂</span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-stone-900 border-2 border-stone-800 flex items-center justify-center">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-black text-stone-100 tracking-tight flex items-center gap-1.5">
              ورود به مدیریت کارگاه
              <SparklesIcon className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs text-stone-400 mt-2 font-medium">
              سامانه کنترل سفارش‌ها و برنامه پخت روزانه (آبادان و خرمشهر)
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                نام کاربری مدیر
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                  placeholder="admin"
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#1C1917]/90 border border-stone-800 text-stone-100 placeholder-stone-600 text-sm font-mono focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-left"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                کلمه عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500">
                  <LockClosedIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#1C1917]/90 border border-stone-800 text-stone-100 placeholder-stone-600 text-sm font-mono focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl text-stone-950 font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 focus:outline-none transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>در حال احراز هویت...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>ورود به سامانه کارگاه</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-6 pt-5 border-t border-stone-800/80 text-center">
            <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
              رمز عبور پیش‌فرض تست سرور:{' '}
              <span className="font-mono text-amber-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                admin123456
              </span>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors"
            >
              <ArrowRightIcon className="w-3.5 h-3.5" />
              <span>بازگشت به فروشگاه اصلی</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
