'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CakeIcon,
  UsersIcon,
  TagIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  CheckBadgeIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import { useAdminStore } from '@/store/adminStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'داشبورد', href: '/admin', icon: HomeIcon },
  { name: 'سفارشات', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'ویرایشگر متن‌ها (المنتور)', href: '/admin/content', icon: PaintBrushIcon, badge: 'CMS' },
  { name: 'محصولات', href: '/admin/products', icon: CakeIcon },
  { name: 'مشتریان', href: '/admin/customers', icon: UsersIcon },
  { name: 'تخفیف‌ها', href: '/admin/discounts', icon: TagIcon },
  { name: 'لیست انتظار', href: '/admin/waitlist', icon: ClockIcon },
  { name: 'زمانبندی پخت', href: '/admin/schedule', icon: CalendarDaysIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, admin, logout } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPersianDate, setCurrentPersianDate] = useState('');

  const isLoginPage = pathname === '/admin/login';
  const isPrintPage = pathname?.includes('/admin/orders/print');

  useEffect(() => {
    setMounted(true);

    try {
      const today = new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'full',
      }).format(new Date());
      setCurrentPersianDate(today);
    } catch {
      setCurrentPersianDate('امروز');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoginPage) {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('admin_token') ||
            localStorage.getItem('madar_admin_token')
          : null;

      if (!token && !isAuthenticated) {
        router.replace('/admin/login');
      }
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // If on login page, display children without admin layout wrapper
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0C0A09] text-stone-100">{children}</div>;
  }

  // If on printable receipt page, render clean print-ready layout
  if (isPrintPage) {
    return <div className="min-h-screen bg-white text-stone-900">{children}</div>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen -mt-24 flex items-center justify-center bg-[#0C0A09] text-amber-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-400">در حال بارگذاری پنل مدیریت کارگاه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-24 bg-[#0C0A09] text-stone-100 font-vazir antialiased flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-[#141210] border-l border-stone-800/80 shadow-2xl z-30 shrink-0 sticky top-0 h-screen">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-stone-800/80 bg-gradient-to-b from-[#1C1917]/70 to-[#141210]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <span className="text-2xl">🎂</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-extrabold text-lg text-amber-400 tracking-tight flex items-center gap-1.5">
                  ثمین کیک | Smin Cake
                  <SparklesIcon className="w-4 h-4 text-amber-400" />
                </h1>
                <span className="text-xs text-stone-400 font-medium">
                  مدیریت کارگاه آبادان و خرمشهر
                </span>
              </div>
            </div>

            {/* Status indicator badge */}
            <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>سیستم آنلاین کارگاه</span>
              </div>
              <span className="text-amber-400/90 font-mono text-[10px]">v1.0</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-dark-scrollbar">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/25'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-[#1C1917]/80'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-stone-950' : 'text-stone-400 group-hover:text-amber-400'
                    }`}
                  />
                  <span>{item.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute right-0 top-2 bottom-2 w-1.5 rounded-l-full bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin Profile & Logout Footer */}
          <div className="p-4 border-t border-stone-800/80 bg-[#12100E]">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  {admin?.name ? admin.name[0] : 'م'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-200 line-clamp-1">
                    {admin?.name || 'مدیر ارشد کارگاه'}
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-mono">
                    {admin?.username || 'admin'}
                  </span>
                </div>
              </div>
              <CheckBadgeIcon className="w-5 h-5 text-amber-400 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/50">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-700/60 transition-colors"
                title="مشاهده وبسایت اصلی در تب جدید"
              >
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>فروشگاه</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/admin/login');
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay & Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-[#141210] border-l border-stone-800 z-50 flex flex-col lg:hidden"
              >
                <div className="p-5 border-b border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎂</span>
                    <span className="font-bold text-amber-400 text-base">ثمین کیک | Smin Cake</span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname?.startsWith(item.href);

                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30'
                            : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-stone-800 bg-[#100E0C]">
                  <button
                    onClick={() => {
                      logout();
                      router.push('/admin/login');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-300 bg-rose-950/50 border border-rose-900/60"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>خروج از حساب مدیر</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Admin Header Bar */}
          <header className="h-18 px-4 sm:px-8 py-3.5 bg-[#141210]/95 backdrop-blur-md border-b border-stone-800/80 sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800/60 focus:outline-none"
                aria-label="باز کردن منو"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              <div className="flex flex-col">
                <span className="text-xs text-amber-500 font-semibold tracking-wide">
                  پیشخوان کنترل قنادی و نانوایی
                </span>
                <span className="text-sm sm:text-base font-bold text-stone-100">
                  {currentPersianDate || 'پخت اختصاصی جنوب'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Workshop Badge */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>شعبه آبادان و خرمشهر</span>
              </div>

              <Link
                href="/admin/orders"
                className="relative p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                title="مدیریت سفارشات"
              >
                <ClipboardDocumentListIcon className="w-5 h-5" />
              </Link>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
