'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  onClick?: () => void;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className = '',
  shimmerColor = 'rgba(251, 191, 36, 0.45)',
  shimmerSize = '0.1em',
  borderRadius = '1.25rem',
  shimmerDuration = '2.5s',
  background = 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #881337 100%)',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-7 py-3.5 text-white font-extrabold shadow-2xl transition-all duration-300 ${className}`}
      style={{
        borderRadius,
        background,
        boxShadow: '0 10px 30px -8px rgba(225, 29, 72, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      }}
      {...(props as any)}
    >
      {/* Sparkle / Shimmer Border Effect (VibeFarsi / Magic UI Style) */}
      <div
        className="pointer-events-none absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 320deg, ${shimmerColor} 340deg, #f59e0b 360deg)`,
        }}
      />

      {/* Button Surface Mask */}
      <div
        className="absolute inset-[1.5px] -z-10 rounded-[inherit] transition-colors duration-300"
        style={{
          background,
        }}
      />

      {/* Light sweep gleam */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm text-sm sm:text-base">
        {children}
      </span>
    </motion.button>
  );
};
