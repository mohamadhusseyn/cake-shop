'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useSpring, useTransform } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  PrinterIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPersianCurrency, formatPersianNumber } from '@/store/adminStore';
import { StatusBadge } from '@/components/StatusBadge';

// Animated Counter Component
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString('fa-IR')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  waitlistCount: number;
  customersCount?: number;
  productsCount: number;
  activeProductsCount: number;
}

interface BakeSessionData {
  sessionTitle: string;
  nextBakeTime: string;
  capacity: number;
  currentOrders: number;
  remainingCapacity: number;
  isOpen: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 24500000,
    totalOrdersCount: 42,
    pendingOrdersCount: 9,
    completedOrdersCount: 31,
    waitlistCount: 7,
    customersCount: 28,
    productsCount: 8,
    activeProductsCount: 7,
  });

  const [bakeSession, setBakeSession] = useState<BakeSessionData>({
    sessionTitle: 'پخت ویژه آخر هفته کیک و نان تازه جنوب',
    nextBakeTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 25,
    currentOrders: 18,
    remainingCapacity: 7,
    isOpen: true,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      // Fetch Dashboard Stats & Recent Orders
      const dashRes = await api.get('/admin/dashboard').catch(() => null);
      if (dashRes && dashRes.data?.success) {
        setStats((prev) => ({
          ...prev,
          ...dashRes.data.stats,
        }));
        if (dashRes.data.recentOrders?.length > 0) {
          setRecentOrders(dashRes.data.recentOrders);
        }
      }

      // Fetch Customers Count
      const custRes = await api.get('/admin/customers').catch(() => null);
      if (custRes && custRes.data?.success) {
        setStats((prev) => ({
          ...prev,
          customersCount: custRes.data.count || custRes.data.customers?.length || 28,
        }));
      }

      // Fetch Bake Session
      const sessionRes = await api.get('/bake-session/current').catch(() => null);
      if (sessionRes && sessionRes.data?.session) {
        setBakeSession(sessionRes.data.session);
      }
    } catch (err) {
      console.warn('Backend call failed, using default showcase dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Default mock recent orders if none returned from DB
  const displayOrders = recentOrders.length > 0 ? recentOrders : [
    {
      _id: 'ord_1',
      orderNumber: 'CAKE-2410-8841',
      customerName: 'فاطمه موسوی',
      customerPhone: '09161314589',
      address: { city: 'آبادان', fullAddress: 'خیابان امیری، فرعی چهارم' },
      items: [{ productName: 'کیک خامه‌ای کارامل و نوتلا', quantity: 1, weight: 2 }],
      finalPrice: 890000,
      status: 'در حال پخت با عشق',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'ord_2',
      orderNumber: 'CAKE-2410-6729',
      customerName: 'علی دریس',
      customerPhone: '09169993322',
      address: { city: 'خرمشهر', fullAddress: 'کوت‌شیخ، بلوار ساحلی' },
      items: [{ productName: 'نان خرمایی اصیل جنوب', quantity: 2, weight: 1 }],
      finalPrice: 465000,
      status: 'ثبت شد',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: 'ord_3',
      orderNumber: 'CAKE-2410-5412',
      customerName: 'زهرا مطوری',
      customerPhone: '09167771234',
      address: { city: 'آبادان', fullAddress: 'بریم، خیابان گلستان' },
      items: [{ productName: 'کیک اسفنجی پسته و هل', quantity: 1, weight: 1.5 }],
      finalPrice: 620000,
      status: 'آماده ارسال',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      _id: 'ord_4',
      orderNumber: 'CAKE-2410-3190',
      customerName: 'حسین بچاری',
      customerPhone: '09375554321',
      address: { city: 'خرمشهر', fullAddress: 'میدان فرمانداری' },
      items: [{ productName: 'کلوچه سنتی زعفرانی', quantity: 3, weight: 0.6 }],
      finalPrice: 570000,
      status: 'تحویل داده شد',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  const capacityPercentage = Math.min(
    100,
    Math.round((bakeSession.currentOrders / (bakeSession.capacity || 1)) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              داشبورد مدیریت کارگاه
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              زنده
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            وضعیت لحظه‌ای سفارش‌ها، نوبت پخت کارگاه مادر و مانیتورینگ مشتریان
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`}
            />
            <span>به‌روزرسانی آمار</span>
          </button>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            <span>مدیریت همه سفارش‌ها</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400">کل سفارشات ثبت شده</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <ShoppingBagIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-100 tracking-tight">
            <AnimatedCounter value={stats.totalOrdersCount} />
            <span className="text-xs font-normal text-stone-400 mr-2">سفارش</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400">
            <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
            <span>+۱۲٪ افزایش نسبت به هفته قبل</span>
          </div>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400">مجموع درآمد کارگاه</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CurrencyDollarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            <AnimatedCounter value={stats.totalRevenue} />
            <span className="text-xs font-normal text-stone-400 mr-1.5">تومان</span>
          </div>
          <div className="mt-3 text-[11px] text-stone-400 flex items-center gap-1">
            <span>دریافتی خالص پخت‌های جاری</span>
          </div>
        </motion.div>

        {/* Pending Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400">سفارشات در صف و پخت</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
              <ClockIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 tracking-tight">
            <AnimatedCounter value={stats.pendingOrdersCount} />
            <span className="text-xs font-normal text-stone-400 mr-2">در دست اقدام</span>
          </div>
          <div className="mt-3 text-[11px] text-amber-400/90 flex items-center gap-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>نیاز به آماده‌سازی امروز کارگاه</span>
          </div>
        </motion.div>

        {/* Customers Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400">تعداد مشتریان وفادار</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <UsersIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-100 tracking-tight">
            <AnimatedCounter value={stats.customersCount || 28} />
            <span className="text-xs font-normal text-stone-400 mr-2">نفر</span>
          </div>
          <div className="mt-3 text-[11px] text-stone-400 flex items-center gap-1">
            <span>ثبت نام شده در آبادان و خرمشهر</span>
          </div>
        </motion.div>
      </div>

      {/* Bake Session Capacity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Indicator for Current Bake Session */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base sm:text-lg text-stone-100">
                  وضعیت ظرفیت نوبت پخت کارگاه
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {bakeSession.sessionTitle || 'پخت ویژه آخر هفته'}
              </p>
            </div>

            <Link
              href="/admin/schedule"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 underline underline-offset-4"
            >
              <span>تنظیم زمان و سهمیه</span>
              <span>←</span>
            </Link>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-stone-300 font-medium">
                تکمیل شده:{' '}
                <strong className="text-amber-400 font-bold font-mono">
                  {formatPersianNumber(bakeSession.currentOrders)}
                </strong>{' '}
                از{' '}
                <strong className="text-stone-100 font-bold font-mono">
                  {formatPersianNumber(bakeSession.capacity)}
                </strong>{' '}
                سفارش
              </span>
              <span className="font-bold text-amber-400 font-mono">
                {formatPersianNumber(capacityPercentage)}٪
              </span>
            </div>

            {/* Custom Progress bar */}
            <div className="w-full h-4 bg-stone-900 rounded-full p-0.5 border border-stone-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  capacityPercentage >= 90
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/30'
                }`}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-1">ظرفیت کل</span>
                <span className="text-base font-bold text-stone-100 font-mono">
                  {formatPersianNumber(bakeSession.capacity)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-1">رزرو شده</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {formatPersianNumber(bakeSession.currentOrders)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-1">باقی‌مانده</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {formatPersianNumber(
                    Math.max(0, bakeSession.capacity - bakeSession.currentOrders)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-6 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-stone-100 mb-1 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              <span>دسترسی‌های سریع کارگاه</span>
            </h3>
            <p className="text-xs text-stone-400 mb-4">عملیات متداول مدیرتی</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 hover:bg-[#1C1917] border border-stone-800 hover:border-amber-500/40 text-xs font-semibold text-stone-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircleIcon className="w-4 h-4" />
              </div>
              <span>افزودن محصول به منو</span>
            </Link>

            <Link
              href="/admin/schedule"
              className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 hover:bg-[#1C1917] border border-stone-800 hover:border-amber-500/40 text-xs font-semibold text-stone-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDaysIcon className="w-4 h-4" />
              </div>
              <span>تنظیم نوبت پخت آینده</span>
            </Link>

            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 hover:bg-[#1C1917] border border-stone-800 hover:border-amber-500/40 text-xs font-semibold text-stone-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClockIcon className="w-4 h-4" />
              </div>
              <span>ارسال پیامک به لیست انتظار</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders List with Status Badges */}
      <div className="p-6 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-stone-100 flex items-center gap-2">
              <ShoppingBagIcon className="w-5 h-5 text-amber-400" />
              <span>سفارشات اخیر کارگاه</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              آخرین سفارش‌های ثبت شده مشتریان شهرهای آبادان و خرمشهر
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>مشاهده همه سفارش‌ها</span>
            <span>←</span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                <th className="pb-3 pr-2">شماره سفارش</th>
                <th className="pb-3 px-3">نام مشتری</th>
                <th className="pb-3 px-3">محصولات</th>
                <th className="pb-3 px-3">شهر تحویل</th>
                <th className="pb-3 px-3">مبلغ کل</th>
                <th className="pb-3 px-3">وضعیت</th>
                <th className="pb-3 pl-2 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {displayOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-stone-900/40 transition-colors group"
                >
                  <td className="py-4 pr-2 font-mono text-amber-400 font-bold">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 px-3 font-semibold text-stone-200">
                    <div>{order.customerName}</div>
                    <div className="text-[11px] text-stone-400 font-mono" dir="ltr">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-stone-300">
                    {order.items?.map((item: any, i: number) => (
                      <span key={i} className="block text-xs">
                        {item.productName} ({formatPersianNumber(item.quantity)} عدد)
                      </span>
                    ))}
                  </td>
                  <td className="py-4 px-3 text-stone-300">
                    <span className="px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px]">
                      {order.address?.city || 'آبادان'}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-bold text-amber-400">
                    {formatPersianCurrency(order.finalPrice || order.totalPrice || 0)}
                  </td>
                  <td className="py-4 px-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 pl-2 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/print/${order._id}`}
                        target="_blank"
                        className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors"
                        title="پرینت فاکتور کارگاهی"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors"
                        title="مشاهده جزییات"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
