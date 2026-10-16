import React from 'react';

export function StatusBadge({ status }: { status: string }) {
  let colorStyles = 'bg-stone-800 text-stone-300 border-stone-700';

  if (status === 'ثبت شد') {
    colorStyles = 'bg-blue-950/60 text-blue-400 border-blue-800/60';
  } else if (status === 'در حال پخت با عشق') {
    colorStyles = 'bg-amber-950/60 text-amber-400 border-amber-800/60 animate-pulse';
  } else if (status === 'آماده ارسال') {
    colorStyles = 'bg-purple-950/60 text-purple-300 border-purple-800/60';
  } else if (status === 'تحویل داده شد') {
    colorStyles = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
  } else if (status === 'لغو شده') {
    colorStyles = 'bg-rose-950/60 text-rose-400 border-rose-800/60';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorStyles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
