'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  innerClassName?: string;
}

/**
 * RainbowButton component inspired by VibeFarsi / Magic UI
 * Vibrant multi-color animated border with smooth pastel bakery glow.
 */
export const RainbowButton: React.FC<RainbowButtonProps> = ({
  children,
  className = '',
  innerClassName = '',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-rose-500/20 ${className}`}
      {...(props as any)}
    >
      {/* Animated Rainbow Conic Gradient */}
      <span
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 0deg, #f43f5e 0deg, #fb923c 60deg, #fbbf24 120deg, #34d399 180deg, #38bdf8 240deg, #ec4899 300deg, #f43f5e 360deg)',
        }}
      />
      {/* Inner Button Body */}
      <span
        className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] bg-white/95 text-bakeryBrown-900 group-hover:bg-white transition-all duration-300 text-sm font-black shadow-inner backdrop-blur-sm ${innerClassName}`}
      >
        {children}
      </span>
    </motion.button>
  );
};
