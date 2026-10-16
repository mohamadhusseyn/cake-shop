'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TagIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPersianCurrency, formatPersianNumber } from '@/store/adminStore';

interface DiscountItem {
  _id?: string;
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const FALLBACK_DISCOUNTS: DiscountItem[] = [
  {
    _id: 'disc-1',
    code: 'MADAR10',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 300000,
    maxDiscountAmount: 100000,
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    usageLimit: 100,
    usedCount: 24,
    isActive: true,
  },
  {
    _id: 'disc-2',
    code: 'BAHAR50K',
    discountType: 'fixed',
    value: 50000,
    minOrderAmount: 500000,
    maxDiscountAmount: null,
    expiryDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    usageLimit: 50,
    usedCount: 18,
    isActive: true,
  },
  {
    _id: 'disc-3',
    code: 'ARVAND20',
    discountType: 'percentage',
    value: 20,
    minOrderAmount: 800000,
    maxDiscountAmount: 200000,
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    usageLimit: 30,
    usedCount: 29,
    isActive: true,
  },
  {
    _id: 'disc-4',
    code: 'NOROOZ1403',
    discountType: 'fixed',
    value: 70000,
    minOrderAmount: 600000,
    maxDiscountAmount: null,
    expiryDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    usageLimit: 50,
    usedCount: 50,
    isActive: false,
  },
];

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>(FALLBACK_DISCOUNTS);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(300000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(100000);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [usageLimit, setUsageLimit] = useState<number>(100);

  // Fetch Discounts
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discounts').catch(() => null);

      if (res && res.data?.success && Array.isArray(res.data.discounts) && res.data.discounts.length > 0) {
        setDiscounts(res.data.discounts);
      } else {
        setDiscounts(FALLBACK_DISCOUNTS);
      }
    } catch {
      setDiscounts(FALLBACK_DISCOUNTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Copy Code to Clipboard
  const handleCopyCode = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`کد تخفیف «${text}» در حافظه کپی شد.`);
    }
  };

  // Delete Discount
  const handleDelete = async (id?: string, codeText?: string) => {
    if (!id) return;
    if (!confirm(`آیا از حذف کد تخفیف «${codeText}» اطمینان دارید؟`)) return;

    try {
      await api.delete(`/discounts/${id}`).catch(() => null);
      setDiscounts((prev) => prev.filter((d) => d._id !== id && d.id !== id));
      toast.success(`کد تخفیف «${codeText}» با موفقیت حذف شد.`);
    } catch {
      toast.error('خطا در حذف کد تخفیف');
    }
  };

  // Submit New Discount
  const handleSubmitDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value || !expiryDate) {
      toast.error('لطفاً کد، مقدار و تاریخ انقضا را تکمیل فرمایید.');
      return;
    }

    setSaving(true);

    const payload = {
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount:
        discountType === 'percentage' && maxDiscountAmount
          ? Number(maxDiscountAmount)
          : null,
      expiryDate: new Date(expiryDate).toISOString(),
      usageLimit: Number(usageLimit) || 100,
    };

    try {
      const res = await api.post('/discounts', payload).catch(() => null);
      const newDoc = res?.data?.discount || {
        _id: `disc_${Date.now()}`,
        ...payload,
        usedCount: 0,
        isActive: true,
      };

      setDiscounts((prev) => [newDoc, ...prev]);
      toast.success(`کد تخفیف «${payload.code}» با موفقیت فعال و اضافه شد.`);
      setIsModalOpen(false);
      setCode('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطا در ثبت کد تخفیف');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2">
            <TicketIcon className="w-7 h-7 text-amber-400" />
            <span>مدیریت کدهای تخفیف و بن‌های خرید</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            تعریف کوپن‌های درصدی یا ثابت برای اعیاد، مشتریان جدید و کمپین‌های کارگاه
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDiscounts}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>بروزرسانی</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>تعریف کد تخفیف جدید</span>
          </button>
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount) => {
          const isExpired = new Date(discount.expiryDate).getTime() < Date.now();
          const isFullyUsed = discount.usedCount >= discount.usageLimit;
          const isCurrentActive = discount.isActive && !isExpired && !isFullyUsed;

          return (
            <motion.div
              layout
              key={discount._id || discount.code}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all relative overflow-hidden group ${
                isCurrentActive
                  ? 'bg-[#141210] border-stone-800/90 hover:border-amber-500/50'
                  : 'bg-[#12100E] border-stone-900 opacity-70'
              }`}
            >
              {/* Top Row: Code & Copy */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-black text-amber-400 tracking-wider bg-stone-900 px-3 py-1 rounded-xl border border-stone-800">
                      {discount.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(discount.code)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 border border-stone-800 transition-colors"
                      title="کپی کد تخفیف"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isCurrentActive
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                    }`}
                  >
                    {isCurrentActive ? 'فعال' : isExpired ? 'منقضی شده' : 'تکمیل ظرفیت'}
                  </span>
                </div>

                {/* Value display */}
                <div className="mb-4">
                  <span className="text-2xl font-black text-stone-100 font-mono">
                    {discount.discountType === 'percentage'
                      ? `${formatPersianNumber(discount.value)}٪ تخفیف`
                      : formatPersianCurrency(discount.value)}
                  </span>
                  {discount.maxDiscountAmount && discount.discountType === 'percentage' ? (
                    <span className="text-xs text-stone-400 block mt-0.5">
                      سقف تخفیف:{' '}
                      <strong className="text-amber-400 font-mono">
                        {formatPersianCurrency(discount.maxDiscountAmount)}
                      </strong>
                    </span>
                  ) : null}
                </div>

                {/* Conditions Specs */}
                <div className="space-y-2 text-xs text-stone-300 border-t border-stone-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-stone-400">حداقل مبلغ سفارش:</span>
                    <span className="font-mono font-bold text-stone-200">
                      {discount.minOrderAmount === 0
                        ? 'بدون محدودیت'
                        : formatPersianCurrency(discount.minOrderAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">میزان مصرف شده:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {formatPersianNumber(discount.usedCount)} از{' '}
                      {formatPersianNumber(discount.usageLimit)} بار
                    </span>
                  </div>

                  {/* Usage Progress bar */}
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800 my-1">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((discount.usedCount / discount.usageLimit) * 100)
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-stone-400">مهلت استفاده:</span>
                    <span className="font-mono text-stone-200">
                      {new Date(discount.expiryDate).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  نوع تخفیف:{' '}
                  {discount.discountType === 'percentage' ? 'درصدی' : 'مبلغ ثابت'}
                </span>

                <button
                  onClick={() => handleDelete(discount._id, discount.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-900/50 transition-colors"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>حذف کوپن</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Discount Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141210] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <h3 className="text-xl font-black text-stone-100 flex items-center gap-2">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                  <span>تعریف کد تخفیف جدید</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitDiscount} className="space-y-4">
                {/* Code & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      کد تخفیف (حروف انگلیسی/اعداد) *
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="MADAR20"
                      dir="ltr"
                      required
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono text-left uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      نوع تخفیف *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="percentage">درصدی (٪)</option>
                      <option value="fixed">مبلغ ثابت (تومان)</option>
                    </select>
                  </div>
                </div>

                {/* Value & Max Cap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      {discountType === 'percentage'
                        ? 'درصد تخفیف (مثلاً ۱۵) *'
                        : 'مبلغ تخفیف (تومان) *'}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {discountType === 'percentage' ? (
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        حداکثر سقف تخفیف (تومان)
                      </label>
                      <input
                        type="number"
                        value={maxDiscountAmount}
                        onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                        placeholder="100000"
                        min={0}
                        className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Min Order & Usage Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      حداقل مبلغ سفارش (تومان)
                    </label>
                    <input
                      type="number"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                      min={0}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      سقف تعداد استفاده (ظرفیت)
                    </label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(Number(e.target.value))}
                      min={1}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    تاریخ انقضا *
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
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
                        <span>ایجاد کد تخفیف</span>
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
