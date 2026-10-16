'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * BorderBeam component inspired by VibeFarsi / Magic UI
 * Adds an energetic beam of light that traces along the border of cards or buttons.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  duration = 6,
  colorFrom = '#f43f5e',
  colorTo = '#fbbf24',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-10 ${className}`}
      style={{
        maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: '2px',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
        className="absolute -inset-[150%] origin-center"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 290deg, ${colorFrom} 330deg, ${colorTo} 360deg)`,
        }}
      />
    </div>
  );
};
