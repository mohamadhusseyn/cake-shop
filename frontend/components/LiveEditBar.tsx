'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaintBrushIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useSiteContent } from '@/context/SiteContentContext';

export function LiveEditBar() {
  const pathname = usePathname();
  const { content } = useSiteContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('admin_token');
      setIsAdmin(!!token);
    } catch {
      setIsAdmin(false);
    }
  }, [pathname]);

  // Do not show on admin pages or if not admin
  if (!isAdmin || isDismissed || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-3 bg-[#1C1917]/95 text-stone-100 px-4 py-2.5 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <PaintBrushIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
              <span>حالت ویرایشگر {content.general.brandNameFa}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                المنتور
              </span>
            </span>
            <span className="text-[11px] text-stone-300">
              امکان ویرایش تمام متن‌ها و عناوین از پنل ادمین
            </span>
          </div>
        </div>

        <Link
          href="/admin/content"
          className="mr-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <span>ورود به ویرایشگر متن‌ها</span>
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors"
          title="بستن موقت این نوار"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
