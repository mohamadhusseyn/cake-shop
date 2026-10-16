'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PhoneIcon, MapPinIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { toPersianDigits } from '@/store/cartStore';
import { useSiteContent } from '@/context/SiteContentContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { content } = useSiteContent();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative mt-20 pt-16 pb-12 bg-gradient-to-b from-cream-100/60 to-cream-200/90 border-t border-cream-300">
      {/* Decorative top wave/glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-roseBakery-300 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎂</span>
              <h4 className="text-xl font-black text-bakeryBrown-900">
                {content.footer.aboutTitle || `${content.general.brandNameFa} (${content.general.brandNameEn})`}
              </h4>
            </div>
            <p className="text-sm text-bakeryBrown-700 leading-relaxed max-w-md">
              {content.footer.aboutText}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-roseBakery-600 bg-roseBakery-50/80 p-2.5 rounded-xl border border-roseBakery-200 max-w-fit">
              <SparklesIcon className="w-4 h-4 animate-spin" />
              <span>{content.footer.badgeText}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-bakeryBrown-900 text-base">دسترسی سریع</h5>
            <ul className="space-y-2 text-sm text-bakeryBrown-700">
              <li>
                <Link href="/products" className="hover:text-roseBakery-600 transition-colors">
                  منوی کیک‌ها و نان‌ها
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-roseBakery-600 transition-colors">
                  داستان دست‌پخت مادر
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-roseBakery-600 transition-colors">
                  سفارش مجالس و تماس
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-roseBakery-600 transition-colors">
                  سبد خرید و تسویه حساب
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Workshop Contact */}
          <div className="space-y-3">
            <h5 className="font-bold text-bakeryBrown-900 text-base">نشانی و ارتباط مستقیم</h5>
            <div className="space-y-2.5 text-sm text-bakeryBrown-700">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-roseBakery-600 shrink-0 mt-0.5" />
                <span>{content.general.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-roseBakery-600 shrink-0" />
                <span dir="ltr" className="font-mono text-sm font-semibold">
                  {content.general.phoneDisplay}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-roseBakery-600 font-bold">همراه / واتساپ:</span>
                <span dir="ltr" className="font-mono text-sm font-semibold">
                  {content.general.mobile}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Local SEO Keyword Tag Cloud */}
        <div className="pt-6 pb-4 border-t border-cream-200 text-[11px] text-bakeryBrown-500 leading-relaxed text-center sm:text-right">
          <span className="font-bold text-bakeryBrown-700 ml-1">خدمات قنادی {content.general.brandNameFa} در استان خوزستان:</span>
          <span>سفارش کیک تولد آبادان</span> •{' '}
          <span>کیک خانگی خرمشهر</span> •{' '}
          <span>خرید نان خرمایی دشتستان</span> •{' '}
          <span>کلوچه سنتی زعفرانی</span> •{' '}
          <span>کیک اسفنجی پسته و هل</span> •{' '}
          <span>شیرینی پخت روز منطقه آزاد اروند</span> •{' '}
          <span>ارسال اختصاصی با باکس خنک در آبادان و خرمشهر</span>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between text-xs text-bakeryBrown-600 gap-4">
          <p className="flex items-center gap-1.5">
            ساخته شده با <HeartIcon className="w-4 h-4 text-roseBakery-500 fill-roseBakery-500" /> برای مردم خونگرم و شریف آبادان و خرمشهر
          </p>
          <p>© {toPersianDigits(1403)} {content.footer.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};
