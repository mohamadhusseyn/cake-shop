'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, FireIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { toPersianDigits } from '@/store/cartStore';
import { WaitlistModal } from './WaitlistModal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { GlowBadge } from '@/components/ui/GlowBadge';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 1,
    hours: 14,
    minutes: 35,
    seconds: 40,
  });
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Remaining capacity calculation: 5 slots remaining out of 16
  const remainingSlots = 5;
  const totalSlots = 16;
  const progressPercentage = Math.round(((totalSlots - remainingSlots) / totalSlots) * 100);

  useEffect(() => {
    // Target time
    const target = new Date();
    target.setHours(target.getHours() + 38);
    target.setMinutes(target.getMinutes() + 25);

    const interval = setInterval(() => {
      const difference = target.getTime() - new Date().getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'روز', value: timeLeft.days },
    { label: 'ساعت', value: timeLeft.hours },
    { label: 'دقیقه', value: timeLeft.minutes },
    { label: 'ثانیه', value: timeLeft.seconds },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.2)"
          className="p-6 md:p-10 border-amberWarm-300/40 relative overflow-hidden shadow-2xl bg-white/80"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-roseBakery-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-amberWarm-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* VibeFarsi GlowBadge */}
            <GlowBadge
              variant="amber"
              icon={<FireIcon className="w-4 h-4 text-amberWarm-600 animate-bounce" />}
              className="mb-4"
            >
              نوبت پخت داغ روزانه: پنج‌شنبه و جمعه (ارسال ویژه آبادان و خرمشهر)
            </GlowBadge>

            <h3 className="text-xl md:text-3xl font-extrabold text-bakeryBrown-900 mb-2">
              زمان باقی‌مانده تا شروع فرآیند پخت و بسته‌بندی
            </h3>
            <p className="text-sm md:text-base text-bakeryBrown-600 max-w-xl mb-8">
              کیک‌ها و نان‌ها برای حفظ حداکثر طراوت، درست چند ساعت قبل از توزیع پخته می‌شوند. سفارش خود را پیش از اتمام ظرفیت ثبت فرمایید.
            </p>

            {/* Flip / Glass Cards Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mb-8 w-full max-w-xl">
              {timeUnits.map((unit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl glass-card border border-white/80 shadow-md bg-white/70"
                >
                  <div className="h-10 sm:h-14 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={unit.value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-2xl sm:text-4xl font-extrabold text-roseBakery-600 font-mono tracking-tight"
                      >
                        {toPersianDigits(unit.value.toString().padStart(2, '0'))}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-bakeryBrown-600 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full max-w-lg mb-8 bg-cream-100/90 p-4 rounded-2xl border border-cream-200">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-bakeryBrown-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-amberWarm-600" />
                  ظرفیت باقیمانده کارگاه ثمین کیک:
                </span>
                <span className="text-roseBakery-600 font-extrabold">
                  فقط {toPersianDigits(remainingSlots)} از {toPersianDigits(totalSlots)} سهمیه سفارش
                </span>
              </div>

              <div className="w-full h-3.5 bg-cream-200/90 rounded-full overflow-hidden p-0.5 border border-cream-300">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amberWarm-400 via-roseBakery-400 to-roseBakery-600 shadow-sm"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-bakeryBrown-500 mt-2 text-right">
                {toPersianDigits(progressPercentage)}٪ از سهمیه این نوبت رزرو شده است.
              </p>
            </div>

            {/* Action Buttons with VibeFarsi ShimmerButton */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ShimmerButton
                onClick={() => {
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                رزرو فوری از منوی محصولات
              </ShimmerButton>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsWaitlistOpen(true)}
                className="px-6 py-3.5 rounded-2xl glass-button text-bakeryBrown-800 font-bold text-sm sm:text-base flex items-center gap-2"
              >
                <BellAlertIcon className="w-5 h-5 text-amberWarm-600" />
                <span>عضویت در نوبت رزرو بعدی</span>
              </motion.button>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        defaultCakeName="پخت اختصاصی آخر هفته (آبادان و خرمشهر)"
      />
    </>
  );
};
