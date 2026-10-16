'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useCartStore, toPersianDigits } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSiteContent } from '@/context/SiteContentContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { content } = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'صفحه اصلی', href: '/' },
    { name: 'محصولات و سفارش', href: '/products' },
    { name: 'داستان ما', href: '/story' },
    { name: 'ارتباط با کارگاه', href: '/contact' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-3 sm:px-6 pt-3 md:pt-4">
      <div
        className={`max-w-6xl mx-auto rounded-3xl transition-all duration-300 ${
          scrolled
            ? 'glass shadow-xl py-3 px-4 sm:px-6 border border-white/60 bg-white/85'
            : 'glass py-3.5 px-4 sm:px-6 border border-white/40 bg-white/70 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amberWarm-400 via-roseBakery-500 to-roseBakery-600 flex items-center justify-center text-white shadow-md shadow-roseBakery-500/25 group-hover:scale-105 transition-transform">
              <span className="text-xl">🎂</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-bakeryBrown-900 group-hover:text-roseBakery-600 transition-colors">
                  {content.navbar.logoTitle || content.general.brandNameFa}
                </span>
                <span className="text-[10px] font-bold text-roseBakery-600 bg-roseBakery-100 px-1.5 py-0.2 rounded-md font-sans">
                  {content.general.brandNameEn}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-bakeryBrown-500 font-medium truncate max-w-[200px] sm:max-w-none">
                {content.navbar.logoSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'text-roseBakery-600'
                      : 'text-bakeryBrown-700 hover:text-roseBakery-600 hover:bg-roseBakery-50/60'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amberWarm-400 to-roseBakery-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-2xl glass-card text-bakeryBrown-800 hover:text-roseBakery-600 cursor-pointer transition-colors"
                aria-label="سبد خرید"
              >
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {toPersianDigits(cartItemCount)}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Auth / Profile Button */}
            <Link href="/auth">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  mounted && isAuthenticated
                    ? 'bg-roseBakery-50 text-roseBakery-700 border border-roseBakery-200'
                    : 'glass-button text-bakeryBrown-800'
                }`}
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-roseBakery-500" />
                <span className="hidden sm:inline">
                  {mounted && isAuthenticated ? user?.fullName || 'حساب کاربری' : 'ورود / ثبت‌نام'}
                </span>
              </motion.div>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl glass-card text-bakeryBrown-800 hover:text-roseBakery-600"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl glass-card p-5 border border-roseBakery-100 shadow-2xl bg-white/95"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-roseBakery-500 text-white shadow-md shadow-roseBakery-500/20'
                        : 'text-bakeryBrown-800 hover:bg-roseBakery-50 hover:text-roseBakery-600'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <SparklesIcon className="w-4 h-4" />}
                  </Link>
                );
              })}

              <div className="pt-3 mt-1 border-t border-cream-200 flex items-center justify-between text-xs text-bakeryBrown-500 px-2">
                <span>تحویل اختصاصی آبادان و خرمشهر</span>
                <span className="font-semibold text-roseBakery-600">پخت روز مادر</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
