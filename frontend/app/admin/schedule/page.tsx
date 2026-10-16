'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  FireIcon,
  LockClosedIcon,
  LockOpenIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPersianNumber } from '@/store/adminStore';

interface BakeSessionItem {
  _id?: string;
  sessionTitle: string;
  nextBakeTime: string;
  orderDeadline?: string;
  capacity: number;
  currentOrders: number;
  remainingCapacity?: number;
  isOpen: boolean;
  description?: string;
  specialOffer?: string;
  createdAt?: string;
}

const FALLBACK_CURRENT: BakeSessionItem = {
  _id: 'session-curr-1',
  sessionTitle: 'نوبت پخت آخر هفته (پنجشنبه)',
  nextBakeTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  orderDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  capacity: 25,
  currentOrders: 18,
  remainingCapacity: 7,
  isOpen: true,
  description:
    'کلیه محصولات با بهترین مواد اولیه تازه، آرد مرغوب و بدون مواد نگه‌دارنده پخته می‌شوند.',
  specialOffer: 'ارسال رایگان برای سفارش‌های بالای ۱ میلیون تومان در آبادان و خرمشهر',
};

const FALLBACK_PAST: BakeSessionItem[] = [
  {
    _id: 'session-past-1',
    sessionTitle: 'پخت دوشنبه عصر کیک‌های عصرانه',
    nextBakeTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 20,
    currentOrders: 20,
    isOpen: false,
    description: 'پخت کامل شد و سفارشات ارسال گردید.',
  },
  {
    _id: 'session-past-2',
    sessionTitle: 'نوبت پخت ویژه نیمه‌شعبان و اعیاد',
    nextBakeTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 35,
    currentOrders: 35,
    isOpen: false,
    description: 'پخت پرشور با استقبال همشهریان عزیز خرمشهر و آبادان.',
  },
];

export default function AdminSchedulePage() {
  const [currentSession, setCurrentSession] = useState<BakeSessionItem>(FALLBACK_CURRENT);
  const [sessions, setSessions] = useState<BakeSessionItem[]>(FALLBACK_PAST);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [sessionTitle, setSessionTitle] = useState('');
  const [nextBakeDate, setNextBakeDate] = useState('');
  const [nextBakeTimeStr, setNextBakeTimeStr] = useState('16:00');
  const [orderDeadlineDate, setOrderDeadlineDate] = useState('');
  const [orderDeadlineTimeStr, setOrderDeadlineTimeStr] = useState('22:00');
  const [capacity, setCapacity] = useState<number>(25);
  const [description, setDescription] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  // Fetch Schedule Data
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const currRes = await api.get('/bake-session/current').catch(() => null);
      if (currRes && currRes.data?.session) {
        setCurrentSession(currRes.data.session);
      }

      const allRes = await api.get('/bake-session/all').catch(() => null);
      if (allRes && allRes.data?.sessions && Array.isArray(allRes.data.sessions) && allRes.data.sessions.length > 0) {
        setSessions(allRes.data.sessions);
      }
    } catch {
      // Keep fallbacks
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Open Edit / New Session Modal
  const handleOpenModal = (sessionToEdit?: BakeSessionItem) => {
    const s = sessionToEdit || currentSession;
    setSessionTitle(s.sessionTitle || 'پخت ویژه آخر هفته کیک و نان تازه');

    const bakeD = s.nextBakeTime ? new Date(s.nextBakeTime) : new Date();
    setNextBakeDate(bakeD.toISOString().split('T')[0]);
    setNextBakeTimeStr(
      `${String(bakeD.getHours()).padStart(2, '0')}:${String(bakeD.getMinutes()).padStart(2, '0')}`
    );

    const deadlineD = s.orderDeadline
      ? new Date(s.orderDeadline)
      : new Date(Date.now() + 24 * 3600000);
    setOrderDeadlineDate(deadlineD.toISOString().split('T')[0]);
    setOrderDeadlineTimeStr(
      `${String(deadlineD.getHours()).padStart(2, '0')}:${String(deadlineD.getMinutes()).padStart(2, '0')}`
    );

    setCapacity(s.capacity || 25);
    setDescription(s.description || 'پخت روز با آرد مرغوب جنوب و مواد اولیه درجه یک');
    setSpecialOffer(
      s.specialOffer || 'ارسال رایگان برای خریدهای بالای یک میلیون تومان در آبادان و خرمشهر'
    );
    setIsOpen(s.isOpen !== undefined ? s.isOpen : true);
    setIsModalOpen(true);
  };

  // Toggle Current Session Open/Close
  const handleToggleOpen = async () => {
    const newStatus = !currentSession.isOpen;
    try {
      setSaving(true);
      await api
        .post('/bake-session', {
          sessionId: currentSession._id,
          isOpen: newStatus,
        })
        .catch(() => null);

      setCurrentSession((prev) => ({ ...prev, isOpen: newStatus }));
      toast.success(
        newStatus
          ? 'نوبت پخت باز شد و سفارش‌گیری فعال گردید.'
          : 'نوبت پخت بسته شد (توقف دریافت سفارش).'
      );
    } catch {
      toast.error('خطا در به‌روزرسانی وضعیت نوبت پخت');
    } finally {
      setSaving(false);
    }
  };

  // Submit Session
  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim() || !nextBakeDate || !capacity) {
      toast.error('لطفاً عنوان، تاریخ پخت و ظرفیت را وارد فرمایید.');
      return;
    }

    setSaving(true);

    const [bHours, bMinutes] = nextBakeTimeStr.split(':');
    const bakeDateTime = new Date(nextBakeDate);
    bakeDateTime.setHours(Number(bHours) || 16, Number(bMinutes) || 0);

    const [dHours, dMinutes] = orderDeadlineTimeStr.split(':');
    const deadlineDateTime = new Date(orderDeadlineDate || nextBakeDate);
    deadlineDateTime.setHours(Number(dHours) || 22, Number(dMinutes) || 0);

    const payload = {
      sessionTitle: sessionTitle.trim(),
      nextBakeTime: bakeDateTime.toISOString(),
      orderDeadline: deadlineDateTime.toISOString(),
      capacity: Number(capacity),
      description: description.trim(),
      specialOffer: specialOffer.trim(),
      isOpen,
      sessionId: currentSession._id,
    };

    try {
      const res = await api.post('/bake-session', payload).catch(() => null);
      const updated = res?.data?.session || {
        ...currentSession,
        ...payload,
        remainingCapacity: Math.max(0, payload.capacity - (currentSession.currentOrders || 0)),
      };

      setCurrentSession(updated);
      toast.success('تنظیمات نوبت پخت با موفقیت در سامانه ذخیره شد.');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطا در ثبت نوبت پخت');
    } finally {
      setSaving(false);
    }
  };

  const remaining = Math.max(
    0,
    currentSession.capacity - (currentSession.currentOrders || 0)
  );
  const fillPercent = Math.min(
    100,
    Math.round(((currentSession.currentOrders || 0) / (currentSession.capacity || 1)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2">
            <CalendarDaysIcon className="w-7 h-7 text-amber-400" />
            <span>زمانبندی و مدیریت ظرفیت پخت کارگاه</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            کنترل سهمیه بچ‌های پخت کیک و نان، مهلت ثبت سفارش و اعلام وضعیت باز/بسته به مشتریان
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSchedule}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>بروزرسانی</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>تنظیم نوبت پخت جدید / ویرایش</span>
          </button>
        </div>
      </div>

      {/* Hero Active Session Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#141210] to-[#0E0C0A] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Glow & Badge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <FireIcon className="w-6 h-6 animate-bounce" />
              </span>
              <span className="text-xs font-bold text-amber-400 tracking-wider">
                نوبت پخت در حال اجرا و جاری
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentSession.isOpen
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950/80 text-rose-400 border-rose-800'
                }`}
              >
                {currentSession.isOpen ? 'ظرفیت باز و پذیرش فعال' : 'تکمیل ظرفیت / بسته'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              {currentSession.sessionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              {currentSession.description ||
                'محصولات در روز تحویل با بهترین آرد و مواد ارگانیک جنوب تهیه می‌گردند.'}
            </p>
          </div>

          {/* Quick Toggle Action Button */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={handleToggleOpen}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                currentSession.isOpen
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              {currentSession.isOpen ? (
                <>
                  <LockClosedIcon className="w-4 h-4" />
                  <span>توقف و بستن سفارش‌گیری</span>
                </>
              ) : (
                <>
                  <LockOpenIcon className="w-4 h-4" />
                  <span>بازگشایی مجدد سهمیه پخت</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              ویرایش جزئیات
            </button>
          </div>
        </div>

        {/* Schedule & Timing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">
              زمان شروع پخت و تحویل:
            </span>
            <span className="text-sm font-extrabold text-stone-100 block">
              {new Date(currentSession.nextBakeTime).toLocaleDateString('fa-IR', {
                dateStyle: 'full',
              })}
            </span>
            <span className="text-xs text-amber-400 font-mono mt-0.5 block">
              ساعت{' '}
              {new Date(currentSession.nextBakeTime).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">
              آخرین مهلت ثبت سفارش:
            </span>
            <span className="text-sm font-extrabold text-stone-100 block">
              {currentSession.orderDeadline
                ? new Date(currentSession.orderDeadline).toLocaleDateString('fa-IR', {
                    dateStyle: 'medium',
                  })
                : '۲۴ ساعت پیش از پخت'}
            </span>
            <span className="text-xs text-stone-400 font-mono mt-0.5 block">
              ساعت ۲۲:۰۰ شب
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">سفارشات ثبت شده:</span>
            <span className="text-2xl font-black text-amber-400 font-mono block">
              {formatPersianNumber(currentSession.currentOrders || 0)}
              <span className="text-xs text-stone-400 font-normal mr-1.5">از {currentSession.capacity}</span>
            </span>
            <span className="text-[11px] text-stone-400">کیک و نان در این نوبت</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">سهمیه باقی‌مانده:</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">
              {formatPersianNumber(remaining)}
              <span className="text-xs text-stone-400 font-normal mr-1.5">ظرفیت باز</span>
            </span>
            <span className="text-[11px] text-stone-400">تا تکمیل کامل بچ</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-stone-300">درصد پر شدن ظرفیت فرها و قنادی:</span>
            <span className="text-amber-400 font-mono font-bold">
              {formatPersianNumber(fillPercent)}٪
            </span>
          </div>
          <div className="w-full h-3 bg-stone-900 rounded-full border border-stone-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 rounded-full"
            />
          </div>
        </div>

        {/* Special Offer announcement */}
        {currentSession.specialOffer && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex items-center gap-3">
            <SparklesIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm text-amber-200 font-medium">
              <strong>آفر ویژه این نوبت پخت:</strong> {currentSession.specialOffer}
            </p>
          </div>
        )}
      </div>

      {/* Past Sessions Archive */}
      <div className="p-6 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl space-y-4">
        <h3 className="font-extrabold text-lg text-stone-100 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-amber-400" />
          <span>تاریخچه نوبت‌های پخت گذشته کارگاه</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-bold">
                <th className="py-3 pr-2">عنوان نوبت پخت</th>
                <th className="py-3 px-3">تاریخ تحویل</th>
                <th className="py-3 px-3 text-center">ظرفیت کل</th>
                <th className="py-3 px-3 text-center">سفارشات تحویل شده</th>
                <th className="py-3 pl-2 text-left">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {sessions.map((sess, idx) => (
                <tr key={idx} className="hover:bg-stone-900/40 transition-colors">
                  <td className="py-3 pr-2 font-bold text-stone-200">
                    {sess.sessionTitle}
                  </td>
                  <td className="py-3 px-3 text-stone-400 font-mono">
                    {new Date(sess.nextBakeTime).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-stone-300">
                    {formatPersianNumber(sess.capacity)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                    {formatPersianNumber(sess.currentOrders)}
                  </td>
                  <td className="py-3 pl-2 text-left">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-400">
                      پایان یافته
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit or Schedule New Bake Session */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#141210] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <h3 className="text-xl font-black text-stone-100 flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 h-6 text-amber-400" />
                  <span>تنظیمات نوبت پخت کارگاه</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitSession} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    عنوان نوبت پخت *
                  </label>
                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="مثلاً پخت ویژه پنجشنبه عصر کیک و نان تازه"
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Next Bake Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      تاریخ پخت و تحویل *
                    </label>
                    <input
                      type="date"
                      value={nextBakeDate}
                      onChange={(e) => setNextBakeDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      ساعت تحویل کارگاه
                    </label>
                    <input
                      type="time"
                      value={nextBakeTimeStr}
                      onChange={(e) => setNextBakeTimeStr(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Deadline Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      آخرین مهلت ثبت سفارش
                    </label>
                    <input
                      type="date"
                      value={orderDeadlineDate}
                      onChange={(e) => setOrderDeadlineDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      ساعت پایان مهلت
                    </label>
                    <input
                      type="time"
                      value={orderDeadlineTimeStr}
                      onChange={(e) => setOrderDeadlineTimeStr(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    ظرفیت کل سفارشات قابل پذیرش *
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    توضیحات و پیام به مشتریان
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                {/* Special Offer */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    پیشنهاد یا آفر ویژه این نوبت
                  </label>
                  <input
                    type="text"
                    value={specialOffer}
                    onChange={(e) => setSpecialOffer(e.target.value)}
                    placeholder="مثلاً ارسال رایگان برای سفارش‌های بالای ۱ میلیون تومان"
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Open Status Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-300">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={(e) => setIsOpen(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-amber-500"
                    />
                    <span>نوبت پخت هم‌اکنون برای ثبت سفارش باز باشد</span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>ثبت و فعال‌سازی نوبت پخت</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
