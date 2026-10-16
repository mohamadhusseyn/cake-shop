'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  SparklesIcon,
  ShoppingBagIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  FilmIcon,
  CubeTransparentIcon,
  ArrowDownIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { useSiteContent } from '@/context/SiteContentContext';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { GlowBadge } from '@/components/ui/GlowBadge';
import { RainbowButton } from '@/components/ui/RainbowButton';
import { BorderBeam } from '@/components/ui/BorderBeam';

interface LayerData {
  id: string;
  number: string;
  name: string;
  tagline: string;
  depth: string;
  thickness: string;
  icon: string;
  badgeColor: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  gradient: string;
  sliceGradient: string;
  story: string;
  motherSecret: string;
  sensoryScores: {
    sweetness: number;
    fluffiness: number;
    crunch: number;
    aroma: number;
  };
  ingredients: { name: string; origin: string; icon: string }[];
  pairWith: string;
  caloriesNote: string;
}

const CAKE_LAYERS: LayerData[] = [
  {
    id: 'layer-top-cream',
    number: '۱',
    name: 'تاج کیک: خامه ابریشمی و توت‌فرنگی تازه کارون',
    tagline: 'سبک مثل نسیم اروند، با ماندگاری لطیف روی زبان',
    depth: 'سطح فوقانی (۰ تا ۲ سانتی‌متر)',
    thickness: '۱۸ میلی‌متر خامه قنادی خالص',
    icon: '🍓',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
    accentBg: 'from-rose-500/10 via-pink-50/50 to-amber-50/20',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    gradient: 'from-rose-500 to-rose-600',
    sliceGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 45%, #FECDD3 100%)',
    story:
      'مادر معتقد است اولین تماس لب با کیک، باید حس ابریشمین و طراوت داشته باشد. خامه‌ای حیوانی بدون ذره‌ای پالم یا چربی گیاهی که با کمترین شکر ممکن و همراه با توت‌فرنگی‌های دست‌چین بهمن‌شیر فرم می‌گیرد.',
    motherSecret:
      '«زدن خامه حیوانی تازه فقط در دمای دقیق ۴ درجه سانتی‌گراد و خواباندن توت‌فرنگی‌ها به مدت یک ساعت در افشره گل سرخ محمدی پیش از چیدمان.»',
    sensoryScores: {
      sweetness: 50,
      fluffiness: 98,
      crunch: 15,
      aroma: 92,
    },
    ingredients: [
      { name: 'خامه حیوانی ارگانیک', origin: 'دامداری محلی روز خوزستان', icon: '🥛' },
      { name: 'توت‌فرنگی قرمز تازه', origin: 'باغات حاشیه بهمن‌شیر', icon: '🍓' },
      { name: 'عصاره گلبرگ گل محمدی', origin: 'گلاب دوآتشه کاشان', icon: '🌸' },
      { name: 'پودر قند طبیعی نیشکر', origin: 'مزارع نیشکر کارون', icon: '🌾' },
    ],
    pairWith: 'چای بهارنارنج داغ یا قهوه اسپرسو لایت',
    caloriesNote: 'فوق‌العاده سبک، کمتر از ۷۰ کیلوکالری در هر برش خامه',
  },
  {
    id: 'layer-filling-caramel',
    number: '۲',
    name: 'فیلینگ میانی: کارامل لوتوس دست‌ساز و گاناش بلژیکی',
    tagline: 'روان، براق، با طعم عمیق تافی کره‌ای و گاناش ۶۰٪',
    depth: 'عمق ۲ تا ۳.۵ سانتی‌متر',
    thickness: '۱۵ میلی‌متر لایه فیلینگ متمرکز',
    icon: '🍯',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentBg: 'from-amber-500/10 via-amber-100/40 to-yellow-50/30',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    gradient: 'from-amber-600 to-amber-700',
    sliceGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 60%, #78350F 100%)',
    story:
      'قلب تپنده طعم کیک؛ جایی که کارامل تافی دست‌ساز که ساعت‌ها با کره اعلا و شکر قهوه‌ای جوشیده با شکلات غلیظ نوتلا و بیسکویت کرانچ لوتوس ترکیب می‌شود تا هر گازی از کیک، انفجاری از لذت شکلاتی باشد.',
    motherSecret:
      '«سوزاندن کنترل‌شده شکر قهوه‌ای با کره محلی و افزودن یک پر نمک دریایی خلیج فارس برای ایجاد هارمونی کارامل شور شگفت‌انگیز.»',
    sensoryScores: {
      sweetness: 82,
      fluffiness: 65,
      crunch: 60,
      aroma: 95,
    },
    ingredients: [
      { name: 'شکلات تلخ ۶۰٪ اصل', origin: 'دانه کاکائو بلژیکی مرغوب', icon: '🍫' },
      { name: 'کره حیوانی دوغی', origin: 'تولید سنتی عشایر خوزستان', icon: '🧈' },
      { name: 'بیسکویت کرامبل لوتوس', origin: 'لوتوس بیسکوف کاراملیزه', icon: '🍪' },
      { name: 'نمک دانه درشت دریایی', origin: 'تصفیه‌شده سواحل نیلگون اروند', icon: '🧂' },
    ],
    pairWith: 'شیر قهوه کاراملی یا چای سیلان دارچینی',
    caloriesNote: 'انرژی‌بخش و نشاط‌آور ویژه عصرانه‌های صمیمی',
  },
  {
    id: 'layer-sponge-vanilla',
    number: '۳',
    name: 'بافت اسفنجی: کیک اسفنج پنبه‌ای با عطر هل و بهارنارنج',
    tagline: 'مانند ابر پنبه‌ای، مرطوب‌شده با شربت زعفران',
    depth: 'عمق ۳.۵ تا ۶ سانتی‌متر',
    thickness: '۲۵ میلی‌متر اسفنج پنبه‌ای دست‌بافت',
    icon: '🥞',
    badgeColor: 'bg-amberWarm-100 text-amberWarm-800 border-amberWarm-300',
    accentBg: 'from-amberWarm-400/10 via-cream-200/50 to-cream-100/40',
    borderColor: 'border-amberWarm-400',
    textColor: 'text-amberWarm-800',
    gradient: 'from-amberWarm-500 to-amberWarm-600',
    sliceGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)',
    story:
      'اسفنج کیک مادر، راز شهرت ۱۵ ساله اوست. کیکی که هیچ‌گاه خشک نمی‌شود؛ چرا که بلافاصله پس از خروج از فر سنتی، با افشره ملایم زعفران قائنات، دانه‌های کوبیده هل سبز هندی و وانیل ماداگاسکار سیراب می‌گردد.',
    motherSecret:
      '«زدن زرده و سفیده تخم‌مرغ محلی در دو ظرف کاملاً مجزا به مدت ۱۲ دقیقه تا رسیدن به حالت فوم برفی و عدم استفاده از حتی یک گرم بیکینگ‌پودر صنعتی.»',
    sensoryScores: {
      sweetness: 58,
      fluffiness: 99,
      crunch: 10,
      aroma: 97,
    },
    ingredients: [
      { name: 'آرد گندم دیم سبوس‌دار', origin: 'آسیاب سنگی دزفول', icon: '🌾' },
      { name: 'تخم‌مرغ تازه روز محلی', origin: 'مرغداری‌های خانگی اروندکنار', icon: '🥚' },
      { name: 'زعفران سرگل قائنات', origin: 'زعفران صادراتی درجه یک خراسان', icon: '✨' },
      { name: 'هل سبز اکبر بنفش', origin: 'کوبیده‌شده در هاون برنجی کارگاه', icon: '🌿' },
    ],
    pairWith: 'چای سیاه قندپهلوی دبش آبادانی',
    caloriesNote: 'فاقد هرگونه گلوتن سنگین صنعتی و فوق‌العاده زودهضم',
  },
  {
    id: 'layer-nuts-base',
    number: '۴',
    name: 'مغز و پایه کرانچ: گردوی برشته خوزستان، خلال پسته و خرمای برحی',
    tagline: 'تردی مقاومت‌ناپذیر با شهد غلیظ خرمای نخلستان‌های اروند',
    depth: 'پایه کیک (۶ تا ۸ سانتی‌متر)',
    thickness: '۲۰ میلی‌متر مغز خالص و پایه کره‌ای',
    icon: '🥜',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentBg: 'from-emerald-500/10 via-amberWarm-100/50 to-bakeryBrown-100/40',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-800',
    gradient: 'from-emerald-600 to-teal-700',
    sliceGradient: 'linear-gradient(135deg, #A7F3D0 0%, #34D399 40%, #059669 100%)',
    story:
      'پایه این کیک تداعی‌گر اصالت اقلیم جنوب است. گردوهای پرچرب نوبرانه که در فر ملایم برشته شده‌اند، خلال پسته رفسنجان و تکه‌های شهدین خرمای برحی، کرانچی شگفت‌انگیز را در زیر لایه‌های نرم کیک به رخ می‌کشند.',
    motherSecret:
      '«تفت دادن مغز گردو با چند قطره گلاب در تابه مسی قبل از اضافه کردن به لایه پایه، تا چربی مفید گردو آزاد شده و طعم گسی آن کاملاً از بین برود.»',
    sensoryScores: {
      sweetness: 65,
      fluffiness: 30,
      crunch: 98,
      aroma: 94,
    },
    ingredients: [
      { name: 'گردوی پرچرب نوبرانه', origin: 'باغات سردسیری خوزستان', icon: '🥜' },
      { name: 'خلال پسته سبز سوپرنگین', origin: 'پسته تازه قائنات و رفسنجان', icon: '💚' },
      { name: 'خرمای برحی عسلی', origin: 'نخلستان‌های سرفراز خرمشهر', icon: '🌴' },
      { name: 'کراست بیسکویتی کره‌ای', origin: 'پخته‌شده با آرد برشته و کره خالص', icon: '🍪' },
    ],
    pairWith: 'قهوه سنتی عربی (دله) یا دمنوش گل‌گاوزبان',
    caloriesNote: 'سرشار از امگا ۳، فسفر، منیزیم و مواد معدنی مغزها',
  },
];

// Video Chapter Landmarks (matching cake-dive.mp4)
const VIDEO_STAGES = [
  {
    progress: 0.08,
    time: 0.8,
    title: 'مرحله ۱: ورود به بافت اسفنج پنبه‌ای',
    subtitle: 'مشاهده ماکروی حباب‌های هوای ابریشمی و عطر وانیل ماداگاسکار',
    tag: 'بافت اسفنج',
    icon: '🌾',
    metrics: { fluffiness: '۹۹٪', moisture: '۸۸٪', vanillaNote: 'اعلا' },
  },
  {
    progress: 0.35,
    time: 2.8,
    title: 'مرحله ۲: گرداب خامه فرم‌گرفته و کارامل',
    subtitle: 'طوفان روان خامه حیوانی ارگانیک با دانه‌های اصیل و قطرات کارامل لوتوس',
    tag: 'فیلینگ خامه و کارامل',
    icon: '🥛',
    metrics: { fluffiness: '۹۵٪', moisture: '۹۲٪', vanillaNote: 'طبیعی' },
  },
  {
    progress: 0.65,
    time: 5.4,
    title: 'مرحله ۳: عبور از تونل کیک به فضای کارگاه',
    subtitle: 'خروج از دنیای مینیاتوری کیک به آشپزخانه گرم و آفتاب‌گیر مادر',
    tag: 'کارگاه امیری آبادان',
    icon: '🏡',
    metrics: { fluffiness: '۱۰۰٪', moisture: 'پخت روز', vanillaNote: 'گلاب کاشان' },
  },
  {
    progress: 0.92,
    time: 8.5,
    title: 'مرحله ۴: چیدمان توت‌فرنگی تازه و تکمیل شاهکار',
    subtitle: 'کیک آماده پذیرایی در مهمانی‌ها، جشن‌های تولد و عصرانه‌های آبادان و خرمشهر',
    tag: 'محصول نهایی آماده تحویل',
    icon: '🍓',
    metrics: { fluffiness: 'کامل', moisture: 'آماده ارسال', vanillaNote: 'تضمین تازگی' },
  },
];

export function CakeDiveExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const { content } = useSiteContent();

  const [mainMode, setMainMode] = useState<'video' | 'deconstruct'>('video');
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(9.5);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [deconstructMode, setDeconstructMode] = useState<'exploded' | 'dive' | 'assembled'>('exploded');

  // Floating Mini-Cinema PiP state (when user scrolls past the dive section)
  const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(false);
  const [miniPlayerDismissed, setMiniPlayerDismissed] = useState<boolean>(false);

  // Scroll bindings for the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // Track progress and scrub video
  useEffect(() => {
    if (mainMode !== 'video') return;

    const unsubscribe = smoothProgress.on('change', (latest) => {
      setCurrentProgress(latest);
      const video = videoRef.current;
      if (video && video.duration && !isPlayingAuto) {
        const clamped = Math.max(0, Math.min(latest, 0.999));
        video.currentTime = clamped * video.duration;
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isPlayingAuto, mainMode]);

  // Monitor when user scrolls below the CakeDive container to show Mini Player
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || miniPlayerDismissed) return;
      const rect = containerRef.current.getBoundingClientRect();
      // When the bottom of the dive container is above the viewport (user scrolled past it into products)
      const scrolledPast = rect.bottom < 100;
      // And user hasn't scrolled all the way to the very bottom footer
      setShowMiniPlayer(scrolledPast);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [miniPlayerDismissed]);

  // Sync mini-player video when shown
  useEffect(() => {
    if (showMiniPlayer && miniVideoRef.current) {
      miniVideoRef.current.play().catch(() => {});
    }
  }, [showMiniPlayer]);

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration || 9.5);
    }
  };

  // Toggle Auto Play
  const toggleAutoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingAuto) {
      video.pause();
      setIsPlayingAuto(false);
    } else {
      video.play().catch(() => {});
      setIsPlayingAuto(true);
    }
  };

  // Chapter Jump Helper
  const seekToStage = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentProgress(time / (video.duration || 9.5));
    }
  };

  // Jump back to full dive view
  const scrollToFullDive = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Active Stage derived from progress
  const activeStage =
    currentProgress < 0.25
      ? VIDEO_STAGES[0]
      : currentProgress < 0.55
      ? VIDEO_STAGES[1]
      : currentProgress < 0.8
      ? VIDEO_STAGES[2]
      : VIDEO_STAGES[3];

  const activeLayer = CAKE_LAYERS[activeLayerIndex];

  return (
    <>
      <div
        ref={containerRef}
        id="cake-dive-experience"
        className={`relative w-full ${
          mainMode === 'video' ? 'min-h-[380vh]' : 'min-h-fit py-20'
        } bg-gradient-to-b from-[#FAF6EE] via-[#FDFBF7] to-[#FAF6EE] text-bakeryBrown-900 transition-colors duration-500`}
      >
        {/* =========================================================================
            MODE 1: REALISTIC VIDEO SCROLL-DIVE (WARM CREAM & ROSE HARMONY)
        ========================================================================= */}
        {mainMode === 'video' ? (
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
            {/* Realistic Video Background (Scrubbed with Scroll) */}
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                src="/videos/cake-dive.mp4"
                playsInline
                muted
                loop
                preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover scale-[1.02] transition-transform duration-700"
              />

              {/* Warm Cream, Rose & Caramel Gradients (NO BLACK COLOR DISCONNECT!) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE] via-transparent to-[#FAF6EE]/75 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EE]/80 via-transparent to-[#FAF6EE]/90 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#FAF6EE]/15 to-[#FAF6EE]/60 pointer-events-none" />
            </div>

            {/* VibeFarsi Top HUD Navigation Bar (Warm Glassmorphism) */}
            <header className="relative z-30 pt-4 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GlowBadge variant="rose">
                  {content.general.brandNameFa} • غوطه‌وری در بافت کیک
                </GlowBadge>
                <span className="hidden md:inline-flex text-xs text-bakeryBrown-700 font-bold bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-rose-200/50 shadow-sm">
                  👇 با اسکرول کردن به پایین، وارد قلب کیک شوید
                </span>
              </div>

              {/* Mode Switcher Buttons (Video Cinematic vs 3D Exploded) */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-rose-200/80 shadow-lg">
                <button
                  onClick={() => setMainMode('video')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-roseBakery-600 to-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <FilmIcon className="w-3.5 h-3.5" />
                  <span>سینمایی واقع‌گرایانه</span>
                </button>

                <button
                  onClick={() => setMainMode('deconstruct')}
                  className="px-3.5 py-1.5 rounded-xl hover:bg-cream-100 text-bakeryBrown-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CubeTransparentIcon className="w-3.5 h-3.5 text-amberWarm-600" />
                  <span>تفکیک لایه‌های ۳D</span>
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className="px-3 py-1.5 rounded-xl bg-cream-100/80 hover:bg-cream-200 text-bakeryBrown-800 text-xs font-bold flex items-center gap-1 transition-all border border-cream-300/60"
                  title={isPlayingAuto ? 'توقف پخش' : 'پخش خودکار'}
                >
                  {isPlayingAuto ? (
                    <>
                      <PauseIcon className="w-3.5 h-3.5 text-roseBakery-600" />
                      <span className="hidden sm:inline">توقف</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">پخش خودکار</span>
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Center Dynamic HUD Stage Callout */}
            <main className="relative z-20 px-4 sm:px-8 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: Dynamic VibeFarsi Floating Stage Card */}
              <div className="md:col-span-7 lg:col-span-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.tag}
                    initial={{ opacity: 0, x: 30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(244, 63, 94, 0.2)"
                      className="bg-white/90 backdrop-blur-2xl border-2 border-rose-200/90 shadow-2xl text-bakeryBrown-900 relative"
                    >
                      <BorderBeam duration={7} colorFrom="#f43f5e" colorTo="#fbbf24" />

                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-roseBakery-50 text-roseBakery-700 border border-roseBakery-200 text-xs font-black">
                          <span>{activeStage.icon}</span>
                          <span>{activeStage.tag}</span>
                        </div>
                        <span className="text-[11px] font-mono font-black text-amberWarm-700 bg-amberWarm-50 px-2.5 py-0.5 rounded-full border border-amberWarm-200">
                          عمق غوطه‌وری: {Math.round(currentProgress * 100)}٪
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-bakeryBrown-900 leading-tight mb-2">
                        {activeStage.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-bakeryBrown-700 leading-relaxed mb-5 font-medium">
                        {activeStage.subtitle}
                      </p>

                      {/* Sensor Metric Grid (VibeFarsi / Cyber-Bakery Style) */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-cream-50/90 border border-cream-200 text-center mb-5 shadow-inner">
                        <div>
                          <span className="text-[10px] text-bakeryBrown-500 block font-bold">لطافت و پف</span>
                          <span className="text-xs sm:text-sm font-black text-emerald-600">
                            {activeStage.metrics.fluffiness}
                          </span>
                        </div>
                        <div className="border-x border-cream-200">
                          <span className="text-[10px] text-bakeryBrown-500 block font-bold">رطوبت اسفنج</span>
                          <span className="text-xs sm:text-sm font-black text-amberWarm-700">
                            {activeStage.metrics.moisture}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-bakeryBrown-500 block font-bold">اصالت عطر</span>
                          <span className="text-xs sm:text-sm font-black text-roseBakery-600">
                            {activeStage.metrics.vanillaNote}
                          </span>
                        </div>
                      </div>

                      {/* CTA Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {currentProgress > 0.75 ? (
                          <ShimmerButton
                            onClick={() => {
                              const el = document.getElementById('products');
                              el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto"
                          >
                            <ShoppingBagIcon className="w-5 h-5" />
                            <span>سفارش این کیک در فروشگاه ثمین کیک</span>
                          </ShimmerButton>
                        ) : (
                          <RainbowButton
                            onClick={() => {
                              window.scrollBy({ top: 450, behavior: 'smooth' });
                            }}
                          >
                            <span>ورود عمیق‌تر به بافت کیک</span>
                            <ArrowDownIcon className="w-4 h-4 animate-bounce text-roseBakery-600" />
                          </RainbowButton>
                        )}

                        <button
                          onClick={() => setMainMode('deconstruct')}
                          className="px-4 py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-cream-300/80 text-bakeryBrown-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <AdjustmentsHorizontalIcon className="w-4 h-4 text-amberWarm-600" />
                          <span>راز و مواد اولیه مادر</span>
                        </button>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Modern HUD Stage Indicators */}
              <div className="hidden md:flex md:col-span-5 lg:col-span-6 flex-col items-end gap-3 pointer-events-none">
                <div className="p-4 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-xl text-right max-w-xs space-y-2 pointer-events-auto">
                  <span className="text-[10px] font-black text-roseBakery-600 uppercase tracking-widest block">
                    مراحل پیشرفت کاوش در کیک:
                  </span>
                  <div className="space-y-1.5">
                    {VIDEO_STAGES.map((stg, i) => (
                      <button
                        key={i}
                        onClick={() => seekToStage(stg.time)}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                          activeStage.tag === stg.tag
                            ? 'bg-roseBakery-50 text-roseBakery-700 border border-rose-300 shadow-sm'
                            : 'text-bakeryBrown-600 hover:bg-cream-100'
                        }`}
                      >
                        <span className="truncate">{stg.tag}</span>
                        <span>{stg.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Bottom Scrubbing Timeline & Scroll Progress Bar */}
            <footer className="relative z-30 pb-6 px-4 sm:px-8 max-w-7xl mx-auto w-full">
              <div className="bg-white/85 backdrop-blur-xl p-4 rounded-3xl border border-rose-200/80 shadow-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-bakeryBrown-700 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-roseBakery-500 animate-ping" />
                    <span>خط زمانی غوطه‌وری در کیک ثمین</span>
                  </div>
                  <span className="font-mono text-amberWarm-700 font-black">
                    {Math.round(currentProgress * (videoDuration || 9.5))} ثانیه / ۹.۵ ثانیه
                  </span>
                </div>

                {/* Progress Scrub Bar */}
                <div
                  className="relative h-2.5 rounded-full bg-cream-200 overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = clickX / rect.width;
                    seekToStage(ratio * videoDuration);
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amberWarm-400 via-roseBakery-500 to-roseBakery-600 rounded-full transition-all duration-75"
                    style={{ width: `${currentProgress * 100}%` }}
                  />
                </div>

                {/* Landmark Dots */}
                <div className="flex items-center justify-between text-[11px] text-bakeryBrown-500 font-bold pt-1">
                  <span>سطح اسفنج</span>
                  <span>فیلینگ خامه</span>
                  <span>تونل کیک</span>
                  <span>تزیین با توت‌فرنگی</span>
                  <span className="text-roseBakery-600">ورود به فروشگاه ثمین</span>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          /* =========================================================================
              MODE 2: 3D DECONSTRUCTED LAYERS (WARM HARMONIOUS PALETTE)
          ========================================================================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header & Mode Switch */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  onClick={() => setMainMode('video')}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-roseBakery-600 to-rose-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-roseBakery-600/30 hover:scale-105 transition-all"
                >
                  <FilmIcon className="w-4 h-4" />
                  <span>بازگشت به تجربه سینمایی ویدیویی</span>
                </button>
              </div>

              <GlowBadge variant="amber" className="mb-4">
                شناسنامه تخصصی لایه‌ها و رازهای دست‌پخت مادر
              </GlowBadge>

              <h2 className="text-3xl sm:text-5xl font-black text-bakeryBrown-900 tracking-tight leading-[1.25]">
                {content.cakeDive.titlePrefix}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-roseBakery-600 via-amberWarm-600 to-amberWarm-700">
                  {content.cakeDive.titleHighlight}
                </span>
              </h2>

              <p className="text-sm sm:text-lg text-bakeryBrown-700 mt-4 leading-relaxed font-medium">
                روی هر لایه کلیک کنید تا بافت آن باز شده و فرمولاسیون اختصاصی مادر آشکار گردد.
              </p>

              {/* View Mode Controls */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setDeconstructMode('exploded')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    deconstructMode === 'exploded'
                      ? 'bg-roseBakery-600 text-white shadow-lg ring-2 ring-roseBakery-400'
                      : 'bg-white text-bakeryBrown-700 hover:bg-cream-100 border border-cream-300'
                  }`}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>نمای انفجاری ۳D</span>
                </button>

                <button
                  onClick={() => setDeconstructMode('dive')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    deconstructMode === 'dive'
                      ? 'bg-amberWarm-600 text-white shadow-lg ring-2 ring-amberWarm-400'
                      : 'bg-white text-bakeryBrown-700 hover:bg-cream-100 border border-cream-300'
                  }`}
                >
                  <span>شیرجه عمیق تک‌لایه‌ای</span>
                </button>

                <button
                  onClick={() => setDeconstructMode('assembled')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    deconstructMode === 'assembled'
                      ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                      : 'bg-white text-bakeryBrown-700 hover:bg-cream-100 border border-cream-300'
                  }`}
                >
                  <span>کیک کامل و آماده پذیرایی</span>
                </button>
              </div>
            </div>

            {/* Quick Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-4xl mx-auto">
              {CAKE_LAYERS.map((layer, idx) => {
                const isSelected = activeLayerIndex === idx;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayerIndex(idx)}
                    className={`p-3.5 rounded-2xl text-right transition-all flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-white border-roseBakery-500 shadow-xl ring-2 ring-roseBakery-500/30 scale-[1.02]'
                        : 'bg-white/80 border-cream-300 text-bakeryBrown-600 hover:border-rose-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isSelected ? 'bg-roseBakery-500 text-white font-black' : 'bg-cream-100 text-bakeryBrown-700'
                      }`}
                    >
                      {layer.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black text-roseBakery-600 uppercase block">
                        لایه {layer.number}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-bakeryBrown-900 truncate">
                        {layer.name.split(':')[0]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3D Visual + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 3D Stack */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 border border-rose-200/80 shadow-2xl flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-full max-w-md space-y-4">
                  {CAKE_LAYERS.map((layer, idx) => {
                    const isSelected = activeLayerIndex === idx;
                    return (
                      <motion.div
                        key={layer.id}
                        onClick={() => setActiveLayerIndex(idx)}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-roseBakery-500 bg-roseBakery-50/60 shadow-xl shadow-roseBakery-500/10'
                            : 'border-cream-200 bg-white hover:border-roseBakery-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{layer.icon}</span>
                            <div>
                              <span className="text-[10px] font-black text-roseBakery-600">
                                لایه {layer.number} • {layer.thickness}
                              </span>
                              <h4 className="text-sm sm:text-base font-extrabold text-bakeryBrown-900">
                                {layer.name}
                              </h4>
                            </div>
                          </div>
                          <span className="text-xs text-bakeryBrown-500 font-bold">{layer.depth}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLayer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-3xl bg-white/90 p-6 sm:p-8 border border-rose-200/80 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-cream-200">
                      <div>
                        <span className="text-xs font-black text-roseBakery-600">
                          لایه {activeLayer.number} از ۴
                        </span>
                        <h3 className="text-xl font-black text-bakeryBrown-900 mt-1">{activeLayer.name}</h3>
                        <p className="text-xs text-bakeryBrown-600 mt-0.5 font-medium">{activeLayer.tagline}</p>
                      </div>
                      <span className="text-3xl">{activeLayer.icon}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-bakeryBrown-700 leading-relaxed mb-6 font-medium">
                      {activeLayer.story}
                    </p>

                    <div className="p-4 rounded-2xl bg-amberWarm-50 border border-amberWarm-200 mb-6">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amberWarm-800 mb-1">
                        <HeartSolidIcon className="w-4 h-4 text-roseBakery-500" />
                        <span>راز دست‌پخت مادر:</span>
                      </div>
                      <p className="text-xs text-bakeryBrown-800 italic leading-relaxed font-medium">
                        {activeLayer.motherSecret}
                      </p>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                      <span className="text-xs font-bold text-bakeryBrown-600 mb-2 block">
                        مواد اولیه بومی و ارگانیک:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {activeLayer.ingredients.map((ing, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 flex items-center gap-2 text-xs"
                          >
                            <span>{ing.icon}</span>
                            <span className="font-bold text-bakeryBrown-800">{ing.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ShimmerButton
                      onClick={() => {
                        const el = document.getElementById('products');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      <span>سفارش کیک در فروشگاه ثمین کیک</span>
                    </ShimmerButton>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          PERSISTENT FLOATING PICTURE-IN-PICTURE (PiP) MINI CINEMA
          SOLVES USER'S COMPLAINT: "با اسکرول کردن دیگه امکان دیدن ویدیو ندارم چون ویدیو بالاس و من تو سایت پایینم"
      ========================================================================= */}
      <AnimatePresence>
        {showMiniPlayer && !miniPlayerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-6 z-50 w-72 sm:w-80 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-2xl border-2 border-rose-300 shadow-2xl p-2"
          >
            <BorderBeam duration={8} colorFrom="#f43f5e" colorTo="#fbbf24" />

            {/* Header of PiP */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-roseBakery-500 animate-ping" />
                <span className="text-[11px] font-black text-bakeryBrown-900">
                  {content.general.brandNameFa} • نمای زنده کیک
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={scrollToFullDive}
                  title="بازگشت به نمای تمام‌صفحه غوطه‌وری کیک"
                  className="p-1 rounded-lg hover:bg-cream-100 text-bakeryBrown-600 transition-colors"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMiniPlayerDismissed(true)}
                  title="بستن پنجره شناور"
                  className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Canvas */}
            <div
              onClick={scrollToFullDive}
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-cream-200 cursor-pointer group"
            >
              <video
                ref={miniVideoRef}
                src="/videos/cake-dive.mp4"
                playsInline
                muted
                loop
                autoPlay
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bakeryBrown-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  بزرگ‌نمایی و غوطه‌وری کامل
                </span>
              </div>
            </div>

            {/* Mini Footer Actions */}
            <div className="mt-2 px-1 flex items-center justify-between text-[11px]">
              <span className="text-bakeryBrown-600 font-medium">سفارش پخت تازه امروز</span>
              <button
                onClick={scrollToFullDive}
                className="font-bold text-roseBakery-600 hover:text-roseBakery-700 flex items-center gap-1"
              >
                <span>مشاهده لایه‌ها</span>
                <span>←</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
