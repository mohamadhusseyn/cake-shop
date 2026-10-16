'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  PaintBrushIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  CakeIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  SiteContent,
  DEFAULT_SITE_CONTENT,
  getStoredSiteContent,
  saveSiteContent,
  resetSiteContent,
} from '@/lib/siteContent';

type EditorTab =
  | 'brand'
  | 'hero'
  | 'cakeDive'
  | 'countdown'
  | 'featured'
  | 'story'
  | 'faq'
  | 'footer';

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState<EditorTab>('brand');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const current = getStoredSiteContent();
    setContent(current);
  }, []);

  const handleSave = () => {
    saveSiteContent(content);
    setIsSaved(true);
    toast.success('تمامی متن‌های سایت با موفقیت ذخیره و در سرتاسر سایت اعمال شدند! 🎉');
  };

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام متن‌ها به حالت اولیه کارخانه بازگردند؟')) {
      const def = resetSiteContent();
      setContent(def);
      setIsSaved(true);
      toast.success('متن‌های سایت با موفقیت به حالت پیش‌فرض بازنشانی شدند.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smin_cake_content_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('فایل پشتیبان JSON با موفقیت دانلود شد.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setContent(parsed);
        saveSiteContent(parsed);
        setIsSaved(true);
        toast.success('فایل پشتیبان با موفقیت بارگذاری و اعمال شد!');
      } catch {
        toast.error('فرمت فایل پشتیبان نامعتبر است.');
      }
    };
    reader.readAsText(file);
  };

  // Helper for updating nested fields
  const updateGeneral = (field: keyof SiteContent['general'], value: string) => {
    setContent((prev) => ({
      ...prev,
      general: { ...prev.general, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateHero = (field: keyof SiteContent['hero'], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateCakeDive = (field: keyof SiteContent['cakeDive'], value: any) => {
    setContent((prev) => ({
      ...prev,
      cakeDive: { ...prev.cakeDive, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateCountdown = (field: keyof SiteContent['countdown'], value: string) => {
    setContent((prev) => ({
      ...prev,
      countdown: { ...prev.countdown, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateFeatured = (field: keyof SiteContent['featured'], value: string) => {
    setContent((prev) => ({
      ...prev,
      featured: { ...prev.featured, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateStory = (field: keyof SiteContent['story'], value: string) => {
    setContent((prev) => ({
      ...prev,
      story: { ...prev.story, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateGuarantee = (field: keyof SiteContent['guarantee'], value: string) => {
    setContent((prev) => ({
      ...prev,
      guarantee: { ...prev.guarantee, [field]: value },
    }));
    setIsSaved(false);
  };

  const updateFooter = (field: keyof SiteContent['footer'], value: string) => {
    setContent((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
    setIsSaved(false);
  };

  // FAQ item helpers
  const updateFAQ = (id: string, field: 'q' | 'a', value: string) => {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
    setIsSaved(false);
  };

  const addFAQ = () => {
    const newItem = {
      id: `faq-${Date.now()}`,
      q: 'پرسش جدید شما درباره سفارش کیک یا نحوه تحویل؟',
      a: 'پاسخ کامل و شفاف کارگاه ثمین کیک به این پرسش...',
    };
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: [...prev.faq.items, newItem],
      },
    }));
    setIsSaved(false);
    toast.success('پرسش جدید افزوده شد.');
  };

  const removeFAQ = (id: string) => {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.filter((item) => item.id !== id),
      },
    }));
    setIsSaved(false);
    toast.success('پرسش مورد نظر حذف شد.');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#1C1917] via-[#26221F] to-[#1C1917] border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
            <PaintBrushIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-amber-400">
                ویرایشگر متن‌های سایت (المنتور ثمین کیک)
              </h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                CMS زنده
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              متن هر کجای سایت، هدر، فوتر، لایه‌ها، داستان مادر یا سوالات را تغییر دهید و فوراً به صورت زنده ببینید.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition-all"
            title="مشاهده سایت اصلی در تب جدید"
          >
            <EyeIcon className="w-4 h-4 text-amber-400" />
            <span>مشاهده سایت</span>
          </Link>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-all"
            title="خروجی گرفتن فایل پشتیبان JSON"
          >
            <ArrowDownTrayIcon className="w-4 h-4 text-emerald-400" />
            <span>پشتیبان‌گیری</span>
          </button>

          <label className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 cursor-pointer transition-all">
            <ArrowUpTrayIcon className="w-4 h-4 text-sky-400" />
            <span>بازیابی JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-xl bg-stone-800/80 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 border border-stone-700/80 transition-all"
            title="بازنشانی به حالت کارخانه"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>بازنشانی</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white shadow-amber-500/40 animate-pulse'
            }`}
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>{isSaved ? 'ذخیره شده ✓' : 'ذخیره تغییرات جدید'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Tabs & Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Sidebar Category Navigation (3 Cols) */}
        <div className="lg:col-span-3 space-y-2 bg-[#141210] p-3 rounded-3xl border border-stone-800/80 h-fit sticky top-24 shadow-xl">
          <span className="text-[11px] font-black text-amber-400/80 px-3 py-2 block uppercase tracking-wider">
            بخش‌های قابل ویرایش سایت:
          </span>

          {[
            { id: 'brand', name: '🏷️ برند ثمین کیک و تماس', icon: SparklesIcon },
            { id: 'hero', name: '🚀 هدر و بنر معرفی (Hero)', icon: HomeIcon },
            { id: 'cakeDive', name: '🍰 لایه‌های کیک (Cake Dive)', icon: CakeIcon },
            { id: 'countdown', name: '⏳ سهمیه روزانه پخت', icon: InformationCircleIcon },
            { id: 'featured', name: '🧁 محصولات شاخص هفته', icon: CakeIcon },
            { id: 'story', name: '📖 داستان مادر و اصالت', icon: BookOpenIcon },
            { id: 'faq', name: '❓ پرسش‌های متداول (FAQ)', icon: QuestionMarkCircleIcon },
            { id: 'footer', name: '🚚 ضمانت ارسال و فوتر', icon: TruckIcon },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-l from-amber-500 to-amber-600 text-stone-900 shadow-lg shadow-amber-500/20 font-black'
                    : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-stone-900 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Center/Right Form Editor Area (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: BRAND & CONTACT */}
          {activeTab === 'brand' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  تنظیمات هویت برند «ثمین کیک / Smin Cake» و اطلاعات ارتباطی
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  نام برند، متن لوگو، اطلاعات تماس آبادان و خرمشهر را اینجا تنظیم فرمایید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نام فارسی برند:
                  </label>
                  <input
                    type="text"
                    value={content.general.brandNameFa}
                    onChange={(e) => updateGeneral('brandNameFa', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="ثمین کیک"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نام انگلیسی برند (English Brand):
                  </label>
                  <input
                    type="text"
                    value={content.general.brandNameEn}
                    onChange={(e) => updateGeneral('brandNameEn', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="Smin Cake"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    عنوان کامل و شعار برند:
                  </label>
                  <input
                    type="text"
                    value={content.general.brandFullName}
                    onChange={(e) => updateGeneral('brandFullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    پوشش جغرافیایی و تحویل:
                  </label>
                  <input
                    type="text"
                    value={content.general.cityCoverage}
                    onChange={(e) => updateGeneral('cityCoverage', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تلفن ثابت کارگاه (نمایشی):
                  </label>
                  <input
                    type="text"
                    value={content.general.phoneDisplay}
                    onChange={(e) => updateGeneral('phoneDisplay', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    شماره همراه / پشتیبانی واتساپ:
                  </label>
                  <input
                    type="text"
                    value={content.general.mobile}
                    onChange={(e) => updateGeneral('mobile', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    آدرس کارگاه در آبادان:
                  </label>
                  <input
                    type="text"
                    value={content.general.address}
                    onChange={(e) => updateGeneral('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    ساعات کاری و پذیرش سفارشات:
                  </label>
                  <input
                    type="text"
                    value={content.general.workingHours}
                    onChange={(e) => updateGeneral('workingHours', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: HERO BANNER */}
          {activeTab === 'hero' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش بخش بالای صفحه اصلی (Hero Section)
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  اولین بخشی که هر کاربر به محض باز کردن سایت می‌بیند.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نشان بیضی بالای عنوان (Top Badge):
                  </label>
                  <input
                    type="text"
                    value={content.hero.pillBadge}
                    onChange={(e) => updateHero('pillBadge', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      بخش اول تیتر بزرگ:
                    </label>
                    <input
                      type="text"
                      value={content.hero.titlePrefix}
                      onChange={(e) => updateHero('titlePrefix', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                      placeholder="کارگاه تخصصی کیک"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      کلمه مورد تأکید (با افکت گرادیان درخشان):
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) => updateHero('titleHighlight', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-400 font-black text-sm focus:border-amber-500 focus:outline-none"
                      placeholder="ثمین کیک"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    پاراگراف توضیحات زیر تیتر (Subtitle):
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.subtitle}
                    onChange={(e) => updateHero('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      متن دکمه اصلی (قرمز-طلایی):
                    </label>
                    <input
                      type="text"
                      value={content.hero.primaryBtnText}
                      onChange={(e) => updateHero('primaryBtnText', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      متن دکمه ثانویه (شیشه‌ای):
                    </label>
                    <input
                      type="text"
                      value={content.hero.secondaryBtnText}
                      onChange={(e) => updateHero('secondaryBtnText', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن نشانگر اسکرول به پایین:
                  </label>
                  <input
                    type="text"
                    value={content.hero.scrollIndicatorText}
                    onChange={(e) => updateHero('scrollIndicatorText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CAKE DIVE EXPERIENCE */}
          {activeTab === 'cakeDive' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش متون بخش تعاملی لایه‌های کیک (Cake Dive Experience)
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  عناوین اصلی، توضیحات و رازهای ۱۵ ساله مادر در هر لایه.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نشان بالای بخش تعاملی:
                  </label>
                  <input
                    type="text"
                    value={content.cakeDive.badgeText}
                    onChange={(e) => updateCakeDive('badgeText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      شروع تیتر بخش:
                    </label>
                    <input
                      type="text"
                      value={content.cakeDive.titlePrefix}
                      onChange={(e) => updateCakeDive('titlePrefix', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      تیتر برجسته (Highlight):
                    </label>
                    <input
                      type="text"
                      value={content.cakeDive.titleHighlight}
                      onChange={(e) => updateCakeDive('titleHighlight', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-400 font-bold text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن راهنمای اسکرول برای کاربر:
                  </label>
                  <textarea
                    rows={2}
                    value={content.cakeDive.subtitle}
                    onChange={(e) => updateCakeDive('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: COUNTDOWN & LIMIT */}
          {activeTab === 'countdown' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش بخش سهمیه روزانه و وضعیت سفارشات
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  پیام‌هایی که درباره محدودیت تعداد پخت روزانه و کیفیت مواد به مشتری نشان داده می‌شود.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نشان وضعیت سهمیه:
                  </label>
                  <input
                    type="text"
                    value={content.countdown.badge}
                    onChange={(e) => updateCountdown('badge', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر اصلی ظرفیت امروز:
                  </label>
                  <input
                    type="text"
                    value={content.countdown.title}
                    onChange={(e) => updateCountdown('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    توضیحات تعهد کیفیت و پخت روز:
                  </label>
                  <textarea
                    rows={2}
                    value={content.countdown.subtitle}
                    onChange={(e) => updateCountdown('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن سقف ظرفیت کل:
                  </label>
                  <input
                    type="text"
                    value={content.countdown.dailyLimitText}
                    onChange={(e) => updateCountdown('dailyLimitText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: FEATURED PRODUCTS */}
          {activeTab === 'featured' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش تیترهای بخش محصولات برگزیده هفته
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نشان بالای بخش:
                  </label>
                  <input
                    type="text"
                    value={content.featured.badge}
                    onChange={(e) => updateFeatured('badge', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر اصلی:
                  </label>
                  <input
                    type="text"
                    value={content.featured.title}
                    onChange={(e) => updateFeatured('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن توضیحی تحویل در آبادان و خرمشهر:
                  </label>
                  <input
                    type="text"
                    value={content.featured.subtitle}
                    onChange={(e) => updateFeatured('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن لینک مشاهده منوی کامل:
                  </label>
                  <input
                    type="text"
                    value={content.featured.viewAllBtnText}
                    onChange={(e) => updateFeatured('viewAllBtnText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: STORY & MOTHER */}
          {activeTab === 'story' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش بخش داستان کارگاه ثمین کیک و دست‌پخت مادر
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نشان بالای بخش:
                  </label>
                  <input
                    type="text"
                    value={content.story.badge}
                    onChange={(e) => updateStory('badge', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر اصلی داستان:
                  </label>
                  <input
                    type="text"
                    value={content.story.title}
                    onChange={(e) => updateStory('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    پاراگراف اول (شروع ماجرا):
                  </label>
                  <textarea
                    rows={3}
                    value={content.story.paragraph1}
                    onChange={(e) => updateStory('paragraph1', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    پاراگراف دوم (تعهد امروز کارگاه ثمین کیک):
                  </label>
                  <textarea
                    rows={3}
                    value={content.story.paragraph2}
                    onChange={(e) => updateStory('paragraph2', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      عدد سال‌های تجربه:
                    </label>
                    <input
                      type="text"
                      value={content.story.experienceYears}
                      onChange={(e) => updateStory('experienceYears', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      توضیح نشان تجربه:
                    </label>
                    <input
                      type="text"
                      value={content.story.experienceLabel}
                      onChange={(e) => updateStory('experienceLabel', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      نقل قول مادر روی تصویر:
                    </label>
                    <input
                      type="text"
                      value={content.story.quoteText}
                      onChange={(e) => updateStory('quoteText', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-2">
                      محل کارگاه روی تصویر:
                    </label>
                    <input
                      type="text"
                      value={content.story.quoteLocation}
                      onChange={(e) => updateStory('quoteLocation', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: FAQ BUILDER */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-amber-400">
                    مدیریت و ویرایش پرسش‌های متداول (FAQ Builder)
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    پاسخ به سوالات مشتریان که مستقیم در نتایج هوش مصنوعی و گوگل ظاهر می‌شوند.
                  </p>
                </div>

                <button
                  onClick={addFAQ}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>افزودن پرسش جدید</span>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر اصلی بخش پرسش‌ها:
                  </label>
                  <input
                    type="text"
                    value={content.faq.title}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        faq: { ...prev.faq, title: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* FAQ Items List */}
                <div className="space-y-4 pt-2">
                  {content.faq.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400">
                          پرسش شماره {idx + 1}:
                        </span>
                        <button
                          onClick={() => removeFAQ(item.id)}
                          className="text-stone-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                          title="حذف این پرسش"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => updateFAQ(item.id, 'q', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs sm:text-sm font-bold focus:border-amber-500 focus:outline-none"
                          placeholder="متن سوال..."
                        />
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          value={item.a}
                          onChange={(e) => updateFAQ(item.id, 'a', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs sm:text-sm focus:border-amber-500 focus:outline-none leading-relaxed"
                          placeholder="پاسخ کامل..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 8: GUARANTEE & FOOTER */}
          {activeTab === 'footer' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-6 sm:p-8 rounded-3xl bg-[#141210] border border-stone-800 shadow-xl"
            >
              <div className="border-b border-stone-800 pb-4">
                <h2 className="text-lg font-black text-amber-400">
                  ویرایش باکس ضمانت ارسال و متن‌های فوتر سایت
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر باکس تضمین ارسال در گرما:
                  </label>
                  <input
                    type="text"
                    value={content.guarantee.title}
                    onChange={(e) => updateGuarantee('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن باکس تضمین ارسال (باکس‌های عایق خنک):
                  </label>
                  <textarea
                    rows={2}
                    value={content.guarantee.subtitle}
                    onChange={(e) => updateGuarantee('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    تیتر معرفی در فوتر:
                  </label>
                  <input
                    type="text"
                    value={content.footer.aboutTitle}
                    onChange={(e) => updateFooter('aboutTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن پاراگراف فوتر:
                  </label>
                  <textarea
                    rows={3}
                    value={content.footer.aboutText}
                    onChange={(e) => updateFooter('aboutText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    متن کپی‌رایت انتهای فوتر:
                  </label>
                  <input
                    type="text"
                    value={content.footer.copyrightText}
                    onChange={(e) => updateFooter('copyrightText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Sticky Bottom Save Bar */}
          <div className="p-4 rounded-2xl bg-[#1C1917] border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isSaved
                  ? 'همه تغییرات ذخیره هستند و در سایت فعالند.'
                  : 'تغییرات ذخیره‌نشده دارید. روی دکمه ذخیره کلیک کنید.'}
              </span>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 transition-all"
            >
              ذخیره تغییرات در کل سایت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
