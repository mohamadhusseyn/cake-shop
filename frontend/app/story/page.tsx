'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  SparklesIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { toPersianDigits } from '@/store/cartStore';

export default function StoryPage() {
  const milestones = [
    {
      year: '۱۳۸۸',
      title: 'آغاز در یک آشپزخانه کوچک در محله بریم',
      description:
        'همه چیز از اشتیاق یک مادر برای پختن کیک‌های تولد فرزندان و نان عصرانه خرمایی با فر خانگی آغاز شد. به زودی عطر شیرینی‌ها توجه همسایگان و اقوام را جلب کرد.',
      tag: 'شروع مسیر',
    },
    {
      year: '۱۳۹۴',
      title: 'محبت اهالی اروند و افزایش سفارش‌ها',
      description:
        'نام «کیک‌های دست‌پخت مادر» دهان به دهان در کوچه پس‌کوچه‌های آبادان و خرمشهر پیچید. سفارش‌های جشن‌های عقد و نامزدی و دورهمی‌های عصرگاهی به اوج خود رسید.',
      tag: 'اعتماد مردم جنوب',
    },
    {
      year: '۱۳۹۹',
      title: 'راه‌اندازی کارگاه تخصصی با مجوز بهداشت',
      description:
        'با پایبندی سفت و سخت به استفاده از مواد اولیه ارگانیک و بدون مواد نگهدارنده، کارگاه تخصصی مجهز به فرهای استاندارد با حفظ روح سنتی و خانگی راه‌اندازی شد.',
      tag: 'توسعه و استاندارد',
    },
    {
      year: '۱۴۰۳',
      title: 'سامانه رزرو آنلاین و ارسال باکس عایق',
      description:
        'برای راحتی همراهان همیشگی و جلوگیری از معطلی، سیستم پیش‌سفارش هوشمند با ارسال سریع در باکس‌های خنک در آبادان و خرمشهر ایجاد گردید.',
      tag: 'امروز ما',
    },
  ];

  const certificates = [
    {
      title: 'نشان استانداردهای بهداشتی و سلامت غذا',
      issuer: 'معاونت غذا و داروی دانشگاه علوم پزشکی آبادان',
      icon: ShieldCheckIcon,
      desc: 'کنترل دوره‌ای تمام مواد اولیه، آزمایش‌های میکروبی خامه و آرد و رعایت کامل استانداردهای زنجیره سرد.',
    },
    {
      title: 'گواهی مهارت پخت شیرینی و کیک سنتی خوزستان',
      issuer: 'سازمان آموزش فنی و حرفه‌ای کشور',
      icon: AcademicCapIcon,
      desc: 'بیش از ۱۵ سال سابقه رسمی و تدریس الگوهای اصیل نان خرمایی و کیک اسفنجی سبک.',
    },
    {
      title: 'لوح زرین رضایت‌مندی مشتریان منطقه آزاد اروند',
      issuer: 'همایش برندهای بومی خوزستان',
      icon: CheckBadgeIcon,
      desc: 'انتخاب شده به عنوان کارگاه نمونه خانگی در ارائه محصولات تازه با بالاترین امتیاز طعم و کیفیت.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* =========================================================================
            HERO STORY SECTION
        ========================================================================= */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-roseBakery-100 text-roseBakery-700 text-xs font-bold"
          >
            <HeartIcon className="w-4 h-4 text-roseBakery-500 fill-roseBakery-500" />
            <span>عشق، اصالت، و دست‌پخت یک مادر</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-black text-bakeryBrown-900 leading-tight"
          >
            روایتی از گرمای دلنشین جنوب و عطر کیک‌های تازه‌پخت
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-bakeryBrown-700 leading-relaxed font-normal"
          >
            در روزگاری که شیرینی‌های آماده کارخانه‌ای پر از اسانس‌های مصنوعی و ماندگاری‌های طولانی شده‌اند، ما چراغ کارگاهی کوچک را روشن نگه داشته‌ایم که در آن کیک‌ها هنوز طعم دوران کودکی را می‌دهند.
          </motion.p>
        </section>

        {/* =========================================================================
            FEATURED PHOTO & PHILOSOPHY
        ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl glass-card overflow-hidden p-6 sm:p-10 border border-cream-300 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200">
              <Image
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=800&auto=format&fit=crop"
                alt="پخت نان و شیرینی سنتی"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-bakeryBrown-900">
                «راز یک کیک خوب، در صبوری قناد نهفته است»
              </h2>
              <p className="text-sm sm:text-base text-bakeryBrown-700 leading-relaxed">
                مادر همیشه می‌گوید خمیر کیک مثل کودک است؛ باید با حوصله هم‌زده شود، در دمای ملایم آرام بگیرد و با میوه‌ها و مغزهای پاکیزه آراسته شود. ما در کارگاه مادر از هیچ مخلوط آماده، پودر کیک بازاری یا شربت‌های گلوکز استفاده نمی‌کنیم.
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-bakeryBrown-800">
                <span className="px-3 py-1.5 rounded-xl bg-amberWarm-100 text-amberWarm-800">
                  ✓ خرمای درجه یک استعمران جنوب
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-roseBakery-100 text-roseBakery-800">
                  ✓ هل سبز و گلاب دوآتشه
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cream-200 text-bakeryBrown-800">
                  ✓ کره طبیعی حیوانی
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            TIMELINE OF JOURNEY
        ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-roseBakery-600 bg-roseBakery-50 px-3 py-1 rounded-full">
              مسیر ۱۵ ساله
            </span>
            <h2 className="text-3xl font-black text-bakeryBrown-900 mt-2">
              ایستگاه‌های سفر کارگاه مادر
            </h2>
          </div>

          <div className="relative border-r-2 border-roseBakery-200 mr-4 sm:mr-8 space-y-12">
            {milestones.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pr-8 sm:pr-10"
              >
                {/* Node Bullet */}
                <div className="absolute -right-[9px] top-1.5 w-4 h-4 rounded-full bg-roseBakery-500 ring-4 ring-roseBakery-100" />

                <div className="glass-card rounded-2xl p-6 border border-cream-200 hover:border-roseBakery-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-roseBakery-600 bg-roseBakery-50 px-2.5 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                    <span className="text-base font-black text-amberWarm-600 font-mono">
                      {toPersianDigits(item.year)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-bakeryBrown-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-bakeryBrown-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            WORKSHOP PHOTO GALLERY
        ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-amberWarm-600 bg-amberWarm-100 px-3 py-1 rounded-full">
              گوشه‌هایی از کارگاه
            </span>
            <h2 className="text-3xl font-black text-bakeryBrown-900 mt-2">
              محیطی پاکیزه و سرشار از عطر شیرینی
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop"
                alt="فرآیند آماده‌سازی خمیر کیک"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold">هم‌زدن خمیر با استانداردهای سنتی</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
                alt="پخت نان گرم خرمایی"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold">نان‌های گرم خرمایی آماده توزیع</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop"
                alt="تزیین دست‌ساز کیک خامه‌ای"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold">تزیین ظریف با خامه تازه</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CERTIFICATES & ACHIEVEMENTS
        ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              تضمین سلامت و کیفیت
            </span>
            <h2 className="text-3xl font-black text-bakeryBrown-900 mt-2">
              گواهینامه‌ها و تاییدهای بهداشتی
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl glass-card p-6 border border-emerald-200/50 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-bakeryBrown-900 mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mb-3">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-bakeryBrown-600 leading-relaxed">
                      {cert.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center py-10 rounded-3xl glass-card border border-roseBakery-200 p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-bakeryBrown-900 mb-3">
            طعم این اصالت را به جشن‌ها و عصرانه‌های خود بیاورید
          </h3>
          <p className="text-sm text-bakeryBrown-600 max-w-md mx-auto mb-6">
            برای سفارش کیک روز یا رزرو نوبت پخت آخر هفته کافیست از منوی محصولات بازدید فرمایید.
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-roseBakery-500 to-roseBakery-600 text-white font-bold text-sm shadow-lg shadow-roseBakery-500/30 inline-flex items-center gap-2"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span>مشاهده و سفارش محصولات مادر</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
