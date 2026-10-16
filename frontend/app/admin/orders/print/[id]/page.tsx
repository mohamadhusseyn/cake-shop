'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PrinterIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPersianCurrency, formatPersianNumber } from '@/store/adminStore';

export default function OrderPrintPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderForPrint = async () => {
      try {
        setLoading(true);
        // Try print API first
        const res = await api
          .get(`/orders/${orderId}/print?format=json`)
          .catch(() => null);

        if (res && res.data?.success && res.data.printData) {
          setOrder(res.data.printData);
        } else {
          // Try regular order API
          const regRes = await api.get(`/orders/${orderId}`).catch(() => null);
          if (regRes && regRes.data?.order) {
            setOrder(regRes.data.order);
          } else {
            // Default sample workshop receipt if not in DB
            setOrder({
              orderNumber: 'CAKE-2410-8841',
              customerName: 'فاطمه موسوی',
              customerPhone: '09161314589',
              city: 'آبادان',
              fullAddress: 'آبادان، خیابان امیری، فرعی چهارم، پلاک ۱۲',
              deliveryDate: new Date().toLocaleDateString('fa-IR'),
              deliveryTimeSlot: '۱۶:۰۰ الی ۱۹:۰۰',
              status: 'در حال پخت با عشق',
              items: [
                {
                  productName: 'کیک خامه‌ای کارامل و نوتلا اروند',
                  quantity: 1,
                  weight: 2,
                  filling: 'موز، گردو و کارامل لوتوس',
                  customMessage: 'تولدت مبارک مامان عزیزم ❤️',
                  ribbonColor: 'طلایی متالیک',
                  price: 890000,
                },
              ],
              specialNotes:
                'خامه بسیار کم‌شیرین باشد و تزیین با گل رز طبیعی انجام شود. مادر عزیز لطفاً کیک را در طبقه بالای یخچال خنک نگه دارید.',
              totalPrice: 890000,
              discountAmount: 0,
              deliveryFee: 25000,
              finalPrice: 915000,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching order for print:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderForPrint();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-amber-400 font-vazir">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-semibold">در حال آماده‌سازی فیش کارگاه...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-stone-900 text-stone-100 font-vazir">
        <div className="text-center space-y-4">
          <p className="text-lg">سفارش مورد نظر یافت نشد.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl"
          >
            بازگشت به سفارشات
          </button>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const addressText = order.fullAddress || order.address?.fullAddress || 'آدرس پستی ثبت نشده';
  const cityName = order.city || order.address?.city || 'آبادان';
  const deliveryDateText =
    typeof order.deliveryDate === 'string' && order.deliveryDate.includes('T')
      ? new Date(order.deliveryDate).toLocaleDateString('fa-IR')
      : order.deliveryDate || 'امروز';

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-vazir p-4 sm:p-8 flex flex-col items-center selection:bg-amber-200">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print w-full max-w-3xl mb-6 flex items-center justify-between bg-stone-900 text-white p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎂</span>
          <span className="text-sm font-bold text-amber-400">
            برگه آماده‌سازی کارگاه پخت مادر
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 transition-colors"
          >
            <ArrowRightIcon className="w-4 h-4" />
            <span>بازگشت</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>چاپ برگه کارگاهی (Print)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div
        id="workshop-printable-receipt"
        className="w-full max-w-3xl bg-white border-2 border-stone-800 p-8 sm:p-10 shadow-lg rounded-xl print:shadow-none print:border-none print:p-0 print:max-w-none text-stone-950"
      >
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-stone-800 pb-5 mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">🍰</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              کارگاه شیرینی و کیک خانگی مادر
            </h1>
          </div>
          <p className="text-xs text-stone-600 font-semibold">
            برگه اختصاصی سرآشپز و بسته‌بندی کارگاهی | شعبه آبادان و خرمشهر
          </p>

          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="px-3 py-1 rounded-md bg-stone-100 border border-stone-300 text-xs font-mono font-bold">
              شماره سفارش: {order.orderNumber}
            </span>
            <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              وضعیت: {order.status}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-300 mb-6 text-xs sm:text-sm">
          <div>
            <span className="text-stone-500 font-semibold block text-xs">نام مشتری گرامی:</span>
            <span className="font-bold text-base text-stone-900">{order.customerName}</span>
          </div>

          <div>
            <span className="text-stone-500 font-semibold block text-xs">تلفن تماس:</span>
            <span className="font-bold font-mono text-base text-stone-900" dir="ltr">
              {order.customerPhone}
            </span>
          </div>

          <div>
            <span className="text-stone-500 font-semibold block text-xs">شهر مقصد:</span>
            <span className="font-bold text-stone-900">{cityName}</span>
          </div>

          <div>
            <span className="text-stone-500 font-semibold block text-xs">زمان تحویل سفارش:</span>
            <span className="font-bold text-stone-900">
              {deliveryDateText} — ساعت {order.deliveryTimeSlot || 'عصرگاهی'}
            </span>
          </div>

          <div className="col-span-2 pt-2 border-t border-stone-200">
            <span className="text-stone-500 font-semibold block text-xs">آدرس دقیق تحویل:</span>
            <span className="font-semibold text-stone-800 leading-relaxed">{addressText}</span>
          </div>
        </div>

        {/* Cake Customization & Items Table */}
        <div className="mb-6">
          <h2 className="text-sm font-extrabold text-stone-900 mb-2">
            شرح اقلام و جزئیات پخت کارگاهی:
          </h2>
          <table className="w-full text-right text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-stone-200/90 border-y-2 border-stone-800 text-stone-900 font-bold">
                <th className="py-2.5 px-3 text-center w-10">ردیف</th>
                <th className="py-2.5 px-3">نام محصول و مشخصات فنی پخت</th>
                <th className="py-2.5 px-3 text-center w-16">تعداد</th>
                <th className="py-2.5 px-3 text-left w-32">مبلغ واحد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {items.map((item: any, idx: number) => (
                <tr key={idx} className="align-top">
                  <td className="py-3 px-3 text-center font-bold text-stone-700">
                    {formatPersianNumber(idx + 1)}
                  </td>
                  <td className="py-3 px-3 space-y-1.5">
                    <div className="font-extrabold text-base text-stone-950">
                      {item.productName}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-700">
                      {item.weight && (
                        <span>
                          <strong>وزن کیک:</strong> {formatPersianNumber(item.weight)} کیلوگرم
                        </span>
                      )}
                      {item.filling && (
                        <span>
                          <strong>فیلینگ درخواستی:</strong> {item.filling}
                        </span>
                      )}
                      {item.ribbonColor && (
                        <span>
                          <strong>رنگ روبان جعبه:</strong> {item.ribbonColor}
                        </span>
                      )}
                    </div>

                    {/* Prominent Cake Custom Message for Mother to write */}
                    {item.customMessage && (
                      <div className="mt-2 p-3 rounded-lg bg-amber-50 border-2 border-amber-400 text-stone-950">
                        <span className="text-xs font-bold text-amber-800 block mb-0.5">
                          ✍️ متن دست‌نویس خامه‌ای روی کیک (دقیقاً نوشته شود):
                        </span>
                        <span className="text-base font-black text-rose-900 block">
                          «{item.customMessage}»
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-base text-stone-900">
                    {formatPersianNumber(item.quantity)}
                  </td>
                  <td className="py-3 px-3 text-left font-bold text-stone-900 whitespace-nowrap">
                    {formatPersianCurrency(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Large Special Notes Box for مادر */}
        <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-amber-600 bg-amber-50/70">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">👩‍🍳</span>
            <h3 className="font-extrabold text-sm text-amber-950">
              دستور کار ویژه کارگاه (یادداشت اختصاصی برای مادر):
            </h3>
          </div>
          <p className="text-sm font-semibold text-stone-900 leading-relaxed">
            {order.specialNotes ||
              'پخت تازه در همان روز تحویل، استفاده از مواد اولیه درجه یک جنوب و کنترل خنک‌سازی پیش از بسته‌بندی.'}
          </p>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm p-4 rounded-xl bg-stone-100 border border-stone-300">
            <div className="flex justify-between text-stone-700">
              <span>مجموع اقلام:</span>
              <span className="font-bold">{formatPersianCurrency(order.totalPrice || 0)}</span>
            </div>
            {order.discountAmount ? (
              <div className="flex justify-between text-emerald-800">
                <span>تخفیف:</span>
                <span className="font-bold">-{formatPersianCurrency(order.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-stone-700">
              <span>هزینه پیک کارگاهی:</span>
              <span className="font-bold">
                {order.deliveryFee === 0
                  ? 'رایگان'
                  : formatPersianCurrency(order.deliveryFee || 25000)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-300">
              <span>مبلغ نهایی:</span>
              <span>{formatPersianCurrency(order.finalPrice || order.totalPrice || 0)}</span>
            </div>
          </div>
        </div>

        {/* Footer Stamps & Signature Lines */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t-2 border-stone-800 text-center text-xs">
          <div>
            <span className="font-bold block text-stone-700 mb-8">تایید پخت و کیفیت (مادر):</span>
            <div className="border-b border-stone-400 w-32 mx-auto" />
          </div>
          <div>
            <span className="font-bold block text-stone-700 mb-8">کنترل تزیین و روبان:</span>
            <div className="border-b border-stone-400 w-32 mx-auto" />
          </div>
          <div>
            <span className="font-bold block text-stone-700 mb-8">امضای پیک اختصاصی:</span>
            <div className="border-b border-stone-400 w-32 mx-auto" />
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-8 text-center text-[11px] text-stone-500 font-medium">
          با عشق و آرزوی سلامتی و شادکامی برای شما • آبادان و خرمشهر • تلفن پشتیبانی: ۰۹۱۲۳۴۵۶۷۸۹
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #workshop-printable-receipt {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
