'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  TruckIcon,
  CheckBadgeIcon,
  FireIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ProductCard } from '@/components/ProductCard';
import { CakeDiveExperience } from '@/components/CakeDiveExperience';
import { INITIAL_PRODUCTS } from '@/lib/api';
import { useSiteContent } from '@/context/SiteContentContext';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { GlowBadge } from '@/components/ui/GlowBadge';
import { RainbowButton } from '@/components/ui/RainbowButton';
import { BorderBeam } from '@/components/ui/BorderBeam';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();

  // Scroll animations for the Hero effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const featuredProducts = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <div ref={containerRef} className="relative overflow-x-clip">
      {/* =========================================================================
          FLOATING PARTICLES BACKGROUND
      ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="particle-1 absolute top-[15%] right-[10%] w-6 h-6 rounded-full bg-amberWarm-300/30 blur-[2px]" />
        <div className="particle-2 absolute top-[35%] left-[8%] w-10 h-10 rounded-full bg-roseBakery-300/25 blur-[3px]" />
        <div className="particle-3 absolute top-[65%] right-[15%] w-8 h-8 rounded-full bg-cream-300/40 blur-[2px]" />
        <div className="particle-1 absolute top-[80%] left-[20%] w-5 h-5 rounded-full bg-roseBakery-400/20 blur-[1px]" />
        <div className="particle-2 absolute top-[50%] right-[3%] w-7 h-7 rounded-full bg-amberWarm-400/20 blur-[2px]" />
      </div>

      {/* =========================================================================
          SECTION 1: HERO WITH CAKE VISUAL & GRADIENT
      ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 pt-6 pb-20 cake-gradient-hero">
        {/* Animated Background Cake-Like Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amberWarm-300/40 via-roseBakery-200/40 to-cream-200/50 blur-3xl"
          />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-roseBakery-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-0 w-80 h-80 bg-amberWarm-200/30 rounded-full blur-3xl" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          {/* Top Pill Badge (VibeFarsi GlowBadge) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <GlowBadge variant="rose" icon={<SparklesIcon className="w-4 h-4 text-amberWarm-500 animate-spin" />}>
              {content.hero.pillBadge}
            </GlowBadge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-bakeryBrown-900 tracking-tight leading-[1.2] mb-6"
          >
            {content.hero.titlePrefix}{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-l from-roseBakery-600 via-roseBakery-500 to-amberWarm-600">
              {content.hero.titleHighlight}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-2 -left-8 text-3xl sm:text-4xl"
              >
                ✨
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-xl md:text-2xl text-bakeryBrown-700 font-medium max-w-2xl leading-relaxed mb-10"
          >
            {content.hero.subtitle}
          </motion.p>

          {/* CTA Buttons (VibeFarsi ShimmerButton) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/products" className="w-full sm:w-auto">
              <ShimmerButton className="w-full sm:w-auto">
                <ShoppingBagIcon className="w-5 h-5" />
                <span>{content.hero.primaryBtnText}</span>
              </ShimmerButton>
            </Link>

            <Link href="/story" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-button text-bakeryBrown-800 font-bold text-base flex items-center justify-center gap-2"
              >
                <HeartIcon className="w-5 h-5 text-roseBakery-500" />
                <span>{content.hero.secondaryBtnText}</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Down Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-14 text-bakeryBrown-400 flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              const el = document.getElementById('cake-dive-experience');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-xs font-semibold">{content.hero.scrollIndicatorText}</span>
            <ChevronDownIcon className="w-5 h-5 text-roseBakery-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: INTERACTIVE SCROLL-DRIVEN CAKE DIVE & EXPLODED 3D LAYERS
      ========================================================================= */}
      <CakeDiveExperience />

      {/* =========================================================================
          SECTION 3: COUNTDOWN TIMER & CAPACITY STATUS
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <CountdownTimer />
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED PRODUCTS GRID
      ========================================================================= */}
      <section id="products" className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-roseBakery-600 bg-roseBakery-50 px-3 py-1 rounded-full mb-3">
                <FireIcon className="w-4 h-4" />
                <span>{content.featured.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bakeryBrown-900">
                {content.featured.title}
              </h2>
              <p className="text-sm sm:text-base text-bakeryBrown-600 mt-2">
                {content.featured.subtitle}
              </p>
            </div>

            <Link href="/products">
              <motion.button
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 text-sm font-bold text-roseBakery-600 hover:text-roseBakery-700 pb-1 border-b-2 border-roseBakery-500/40"
              >
                <span>{content.featured.viewAllBtnText}</span>
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
              </motion.button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: STORY HIGHLIGHT ABOUT "ثمین کیک / دست‌پخت مادر"
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-cream-100 via-roseBakery-50/40 to-cream-200/60 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Photo Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl border border-white"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200">
                  <Image
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
                    alt={`فضای کارگاه ${content.general.brandNameFa}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bakeryBrown-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 right-6 left-6 text-white">
                    <p className="text-xs font-semibold text-roseBakery-300 mb-1">
                      {content.story.quoteLocation}
                    </p>
                    <p className="text-lg font-bold">
                      {content.story.quoteText}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 rounded-2xl glass-card p-4 shadow-xl border border-amberWarm-300/40 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amberWarm-400 text-white flex items-center justify-center font-black text-xl">
                  {content.story.experienceYears}
                </div>
                <div>
                  <p className="text-xs text-bakeryBrown-500 font-medium">تجربه پخت سنتی</p>
                  <p className="text-sm font-bold text-bakeryBrown-900">{content.story.experienceLabel}</p>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-roseBakery-100 text-roseBakery-700 text-xs font-bold">
                <HeartIcon className="w-4 h-4" />
                <span>{content.story.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-bakeryBrown-900 leading-tight">
                {content.story.title}
              </h2>

              <p className="text-base text-bakeryBrown-700 leading-relaxed">
                {content.story.paragraph1}
              </p>

              <p className="text-base text-bakeryBrown-700 leading-relaxed">
                {content.story.paragraph2}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-bakeryBrown-800">
                    {content.story.feature1}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-6 h-6 text-roseBakery-600 shrink-0" />
                  <span className="text-sm font-bold text-bakeryBrown-800">
                    {content.story.feature2}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/story">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-2xl glass-button text-bakeryBrown-900 font-bold text-sm flex items-center gap-2"
                  >
                    <span>{content.story.readMoreBtnText}</span>
                    <ArrowRightIcon className="w-4 h-4 rotate-180" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5.5: FREQUENTLY ASKED QUESTIONS (FAQ - Google & AI Overviews)
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-cream-50 via-cream-100/60 to-cream-50 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amberWarm-100 text-amberWarm-800 text-xs font-bold mb-3 border border-amberWarm-300/60">
              <SparklesIcon className="w-4 h-4 text-amberWarm-600" />
              <span>{content.faq.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-bakeryBrown-900 tracking-tight">
              {content.faq.title}
            </h2>
            <p className="text-sm sm:text-base text-bakeryBrown-600 mt-2 max-w-xl mx-auto">
              {content.faq.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {content.faq.items.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-2xl glass-card border border-roseBakery-200/50 p-5 transition-all open:shadow-lg open:border-roseBakery-400"
              >
                <summary className="flex items-center justify-between font-extrabold text-sm sm:text-base text-bakeryBrown-900 cursor-pointer list-none select-none">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-roseBakery-500 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDownIcon className="w-5 h-5 text-bakeryBrown-500 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-bakeryBrown-700 leading-relaxed pr-4 border-t border-cream-200/60 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BOTTOM WAVE & GUARANTEE
      ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden bg-cream-50">
        <div className="max-w-5xl mx-auto rounded-3xl glass-card p-8 md:p-12 text-center border border-roseBakery-200/50 shadow-xl relative overflow-hidden">
          <BorderBeam duration={10} colorFrom="#f43f5e" colorTo="#fbbf24" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-roseBakery-300/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🚚</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-bakeryBrown-900 mb-3">
              {content.guarantee.title}
            </h3>
            <p className="text-sm sm:text-base text-bakeryBrown-600 max-w-xl mx-auto mb-8 font-medium">
              {content.guarantee.subtitle}
            </p>
            <Link href="/products">
              <RainbowButton>
                <span>{content.guarantee.ctaText}</span>
                <span className="text-roseBakery-600">✨</span>
              </RainbowButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
