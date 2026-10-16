'use client';

import React from 'react';

interface GlowBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'rose' | 'amber' | 'emerald';
  className?: string;
}

export const GlowBadge: React.FC<GlowBadgeProps> = ({
  children,
  icon,
  variant = 'rose',
  className = '',
}) => {
  const styles = {
    rose: {
      bg: 'bg-roseBakery-50/90 border-roseBakery-200 text-roseBakery-700',
      dot: 'bg-roseBakery-500 shadow-[0_0_10px_2px_rgba(244,63,94,0.5)]',
    },
    amber: {
      bg: 'bg-amberWarm-50/90 border-amberWarm-200 text-amberWarm-800',
      dot: 'bg-amberWarm-500 shadow-[0_0_10px_2px_rgba(245,158,11,0.5)]',
    },
    emerald: {
      bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]',
    },
  }[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-black shadow-sm backdrop-blur-md transition-all hover:scale-105 ${styles.bg} ${className}`}
    >
      <span className={`size-2 rounded-full animate-ping shrink-0 ${styles.dot}`} />
      {icon}
      <span>{children}</span>
    </div>
  );
};
