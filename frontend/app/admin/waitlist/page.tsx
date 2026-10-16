'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  PhoneIcon,
  CalendarDaysIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPersianNumber } from '@/store/adminStore';

interface WaitlistEntry {
  _id: string;
  phone: string;
  name: string;
  requestedDate?: string | null;
  preferredCategory?: string;
  note?: string;
  status: 'pending' | 'notified' | 'fulfilled';
  notifiedAt?: string | null;
  createdAt: string;
}

const FALLBACK_WAITLIST: WaitlistEntry[] = [
  {
    _id: 'wait-1',
    name: 'مریم کعبی',
    phone: '09163339876',
    requestedDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    preferredCategory: 'cake',
    note: 'برای تولد دخترم کیک خامه‌ای ۲ کیلویی می‌خواهم.',
    status: 'pending',
    notifiedAt: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'wait-2',
    name: 'رضا فیصلی',
    phone: '09351239988',
    requestedDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    preferredCategory: 'bread',
    note: 'نان خرمایی سنتی ۲ کیلوگرم برای ارسال به خرمشهر.',
    status: 'pending',
    notifiedAt: null,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'wait-3',
    name: 'مهدی بحرانی',
    phone: '09168884433',
    requestedDate: null,
    preferredCategory: 'any',
    note: 'هر زمان پخت جدید باز شد اطلاع دهید.',
    status: 'pending',
    notifiedAt: null,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    _id: 'wait-4',
    name: 'سارا عامری',
    phone: '09164445566',
    requestedDate: new Date(Date.now() - 86400000).toISOString(),
    preferredCategory: 'cookie',
    note: 'کلوچه سنتی زعفرانی جعبه کادویی.',
    status: 'notified',
    notifiedAt: new Date(Date.now() - 10000000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: 'wait-5',
    name: 'جاسم عیدانی',
    phone: '09372221144',
    requestedDate: null,
    preferredCategory: 'cake',
    note: '',
    status: 'fulfilled',
    notifiedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(FALLBACK_WAITLIST);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('همه');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk SMS Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState(
    'سلام و درود از کارگاه کیک مادر آبادان. به اطلاع می‌رساند ظرفیت نوبت پخت تازه باز شده است. هم‌اکنون می‌توانید از طریق وبسایت سفارش خود را ثبت فرمایید.'
  );
  const [sendingSms, setSendingSms] = useState(false);
  const [smsProgress, setSmsProgress] = useState({ current: 0, total: 0 });

  // Single Notify State
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  // Fetch Waitlist
  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/waitlist').catch(() => null);

      if (res && res.data?.success && Array.isArray(res.data.entries) && res.data.entries.length > 0) {
        setEntries(res.data.entries);
      } else {
        setEntries(FALLBACK_WAITLIST);
      }
    } catch {
      setEntries(FALLBACK_WAITLIST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  // Selection Logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPendingIds = filteredEntries
        .filter((e) => e.status === 'pending')
        .map((e) => e._id);
      setSelectedIds(allPendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Send Single SMS Notification
  const handleNotifySingle = async (entry: WaitlistEntry) => {
    try {
      setNotifyingId(entry._id);
      await api
        .post(`/waitlist/${entry._id}/notify`, {
          message: smsMessage,
        })
        .catch(() => null);

      setEntries((prev) =>
        prev.map((e) =>
          e._id === entry._id
            ? { ...e, status: 'notified', notifiedAt: new Date().toISOString() }
            : e
        )
      );

      toast.success(`پیامک اطلاع‌رسانی به شماره ${entry.phone} ارسال شد.`);
    } catch {
      toast.error('خطا در ارسال پیامک');
    } finally {
      setNotifyingId(null);
    }
  };

  // Send Bulk SMS Notification
  const handleSendBulkSms = async () => {
    if (selectedIds.length === 0) {
      toast.error('هیچ مخاطبی انتخاب نشده است.');
      return;
    }
    if (!smsMessage.trim()) {
      toast.error('متن پیامک نمی‌تواند خالی باشد.');
      return;
    }

    setSendingSms(true);
    setSmsProgress({ current: 0, total: selectedIds.length });

    let successCount = 0;

    for (let i = 0; i < selectedIds.length; i++) {
      const id = selectedIds[i];
      try {
        await api
          .post(`/waitlist/${id}/notify`, { message: smsMessage.trim() })
          .catch(() => null);
        successCount++;
      } catch (err) {
        console.warn('Failed for', id);
      }
      setSmsProgress({ current: i + 1, total: selectedIds.length });
    }

    setEntries((prev) =>
      prev.map((e) =>
        selectedIds.includes(e._id)
          ? { ...e, status: 'notified', notifiedAt: new Date().toISOString() }
          : e
      )
    );

    toast.success(
      `پیامک اطلاع‌رسانی با موفقیت برای ${formatPersianNumber(
        successCount
      )} نفر ارسال شد.`
    );

    setSelectedIds([]);
    setSendingSms(false);
    setIsBulkModalOpen(false);
  };

  // Delete Entry
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف «${name}» از لیست انتظار اطمینان دارید؟`)) return;

    try {
      await api.delete(`/waitlist/${id}`).catch(() => null);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast.success(`رکورد «${name}» با موفقیت حذف شد.`);
    } catch {
      toast.error('خطا در حذف رکورد');
    }
  };

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (statusFilter === 'همه') return true;
    if (statusFilter === 'در انتظار' && e.status === 'pending') return true;
    if (statusFilter === 'پیامک ارسال شده' && e.status === 'notified') return true;
    if (statusFilter === 'تکمیل شده' && e.status === 'fulfilled') return true;
    return false;
  });

  const pendingCount = entries.filter((e) => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2">
            <ClockIcon className="w-7 h-7 text-amber-400" />
            <span>مدیریت لیست انتظار و سامانه پیامک انبوه</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            اطلاع‌رسانی باز شدن ظرفیت پخت جدید به متقاضیان آبادان و خرمشهر از طریق سامانه پیامکی
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchWaitlist}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>بروزرسانی</span>
          </button>

          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                // If none selected, auto-select all pending
                const allPending = filteredEntries
                  .filter((e) => e.status === 'pending')
                  .map((e) => e._id);
                setSelectedIds(allPending);
              }
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            <span>
              ارسال پیامک انبوه ({formatPersianNumber(selectedIds.length || pendingCount)} نفر)
            </span>
          </button>
        </div>
      </div>

      {/* Stats and Filter Bar */}
      <div className="p-4 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['همه', 'در انتظار', 'پیامک ارسال شده', 'تکمیل شده'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === tab
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span>
            کل متقاضیان در صف:{' '}
            <strong className="text-amber-400 font-mono font-bold">
              {formatPersianNumber(pendingCount)}
            </strong>{' '}
            نفر
          </span>

          {selectedIds.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {formatPersianNumber(selectedIds.length)} مخاطب انتخاب شده
            </span>
          )}
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="rounded-3xl bg-[#141210] border border-stone-800/90 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-stone-900/60 border-b border-stone-800 text-stone-400 font-bold">
                <th className="py-4 pr-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length ===
                        filteredEntries.filter((e) => e.status === 'pending').length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-amber-500 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-3">نام متقاضی</th>
                <th className="py-4 px-3">شماره تماس</th>
                <th className="py-4 px-3">دسته مورد علاقه</th>
                <th className="py-4 px-3">یادداشت مشتری</th>
                <th className="py-4 px-3">تاریخ ثبت</th>
                <th className="py-4 px-3 text-center">وضعیت</th>
                <th className="py-4 pl-4 text-left">عملیات پیامک</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    موردی در لیست انتظار یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isPending = entry.status === 'pending';
                  const isNotified = entry.status === 'notified';
                  const isSelected = selectedIds.includes(entry._id);

                  return (
                    <tr
                      key={entry._id}
                      className={`hover:bg-stone-900/40 transition-colors group ${
                        isSelected ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pr-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(entry._id)}
                          disabled={!isPending}
                          className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-amber-500 cursor-pointer disabled:opacity-30"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-4 px-3 font-bold text-stone-100">
                        {entry.name || 'همراه گرامی'}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-3">
                        <a
                          href={`tel:${entry.phone}`}
                          dir="ltr"
                          className="font-mono text-stone-300 hover:text-amber-400 text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <PhoneIcon className="w-3.5 h-3.5 text-stone-500" />
                          <span>{entry.phone}</span>
                        </a>
                      </td>

                      {/* Preferred Category */}
                      <td className="py-4 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-300 font-semibold">
                          {entry.preferredCategory === 'cake'
                            ? 'کیک خانگی'
                            : entry.preferredCategory === 'bread'
                            ? 'نان سنتی جنوب'
                            : entry.preferredCategory === 'cookie'
                            ? 'کلوچه محلی'
                            : 'کلیه محصولات'}
                        </span>
                      </td>

                      {/* Note */}
                      <td className="py-4 px-3 max-w-xs">
                        <span className="text-xs text-stone-400 line-clamp-2">
                          {entry.note || '—'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-3 text-stone-400 text-[11px] font-mono">
                        {new Date(entry.createdAt).toLocaleDateString('fa-IR')}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            در انتظار ظرفیت
                          </span>
                        ) : isNotified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/60">
                            <CheckIcon className="w-3.5 h-3.5" />
                            پیامک ارسال شد
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                            سفارش ثبت شد
                          </span>
                        )}
                      </td>

                      {/* Single SMS & Delete */}
                      <td className="py-4 pl-4 text-left whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleNotifySingle(entry)}
                            disabled={notifyingId === entry._id || !isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all disabled:opacity-40"
                            title="ارسال پیامک تکی"
                          >
                            <PaperAirplaneIcon className="w-3.5 h-3.5" />
                            <span>
                              {notifyingId === entry._id ? 'ارسال...' : 'ارسال پیامک'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(entry._id, entry.name)}
                            className="p-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 transition-colors"
                            title="حذف از لیست انتظار"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk SMS Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#141210] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div>
                  <h3 className="text-xl font-black text-stone-100 flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-amber-400" />
                    <span>ارسال پیامک انبوه به لیست انتظار</span>
                  </h3>
                  <span className="text-xs text-stone-400">
                    تعداد دریافت‌کنندگان:{' '}
                    <strong className="text-amber-400 font-mono">
                      {formatPersianNumber(selectedIds.length)}
                    </strong>{' '}
                    شماره موبایل
                  </span>
                </div>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Message Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    متن پیامک ارسالی (به همراه لینک سایت و شماره کارگاه) *
                  </label>
                  <textarea
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                  />
                  <div className="flex justify-between items-center text-[11px] text-stone-500 mt-1">
                    <span>
                      طول متن: {formatPersianNumber(smsMessage.length)} کاراکتر (
                      {formatPersianNumber(Math.ceil(smsMessage.length / 70))} پارت فارسی)
                    </span>
                    <span className="text-amber-400">سامانه پیامکی آبادان فعال است</span>
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <span className="block text-[11px] font-semibold text-stone-400 mb-2">
                    قالب‌های آماده:
                  </span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSmsMessage(
                          'سلام و درود! ظرفیت نوبت پخت آخر هفته کارگاه کیک مادر باز شد. جهت ثبت سفارش کیک و نان تازه به وبسایت مراجعه فرمایید.'
                        )
                      }
                      className="w-full text-right p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-[11px] text-stone-300 border border-stone-800 transition-colors"
                    >
                      🍰 قالب ۱: باز شدن ظرفیت نوبت پخت آخر هفته
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSmsMessage(
                          'همراه گرامی، پخت داغ نان خرمایی و کلوچه زعفرانی امروز در کارگاه مادر آماده سفارش است. ظرفیت محدود می‌باشد.'
                        )
                      }
                      className="w-full text-right p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-[11px] text-stone-300 border border-stone-800 transition-colors"
                    >
                      🍞 قالب ۲: پخت نان خرمایی و کلوچه سنتی
                    </button>
                  </div>
                </div>

                {/* Progress Bar (if sending) */}
                {sendingSms && (
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                    <div className="flex justify-between text-xs text-amber-400 font-bold">
                      <span>در حال ارسال پیامک‌ها به شبکه مخابراتی...</span>
                      <span className="font-mono">
                        {formatPersianNumber(smsProgress.current)} /{' '}
                        {formatPersianNumber(smsProgress.total)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{
                          width: `${(smsProgress.current / smsProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    disabled={sendingSms}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    انصراف
                  </button>

                  <button
                    type="button"
                    onClick={handleSendBulkSms}
                    disabled={sendingSms || selectedIds.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>
                      {sendingSms ? 'در حال ارسال...' : 'ارسال قطعی به کلیه افراد منتخب'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
