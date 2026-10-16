import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LiveEditBar } from '@/components/LiveEditBar';
import { SEOStructuredData } from '@/components/SEOStructuredData';
import { SiteContentProvider } from '@/context/SiteContentContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smincake.ir';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF6EE',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ثمین کیک (Smin Cake) | سفارش آنلاین کیک خانگی و نان خرمایی در آبادان و خرمشهر',
    template: '%s | ثمین کیک آبادان (Smin Cake)',
  },
  description:
    'مرجع رسمی سفارش آنلاین انواع کیک خانگی، کیک تولد با فیلینگ نوتلا و کارامل، نان خرمایی اصیل جنوب و کلوچه سنتی با دست‌پخت مادر در کارگاه ثمین کیک (Smin Cake). پخت روزانه بدون مواد نگه‌دارنده با ارسال اختصاصی درب منزل در شهرهای آبادان و خرمشهر.',
  keywords: [
    'ثمین کیک',
    'Smin Cake',
    'smin cake',
    'کیک ثمین',
    'قنادی ثمین کیک',
    'کیک آبادان',
    'کیک خرمشهر',
    'سفارش کیک تولد آبادان',
    'کیک خانگی آبادان',
    'سفارش کیک خرمشهر',
    'نان خرمایی جنوب',
    'نان خرمایی آبادان',
    'کلوچه سنتی خوزستان',
    'شیرینی خانگی آبادان',
    'کارگاه ثمین کیک',
    'کیک اسفنجی پسته و هل',
    'کیک نوتلا کارامل اروند',
    'منطقه آزاد اروند',
    'قنادی خانگی آبادان',
    'سفارش کیک نامزدی خرمشهر',
    'سوغات نان خرمایی خوزستان',
    'نان تازه صبحانه تنوری',
    'کوکی شکلاتی خانگی آبادان',
  ],
  authors: [{ name: 'کارگاه ثمین کیک (Smin Cake)', url: siteUrl }],
  creator: 'کارگاه ثمین کیک (Smin Cake)',
  publisher: 'کارگاه ثمین کیک (Smin Cake)',
  applicationName: 'ثمین کیک (Smin Cake)',
  category: 'Food & Beverage',
  classification: 'قنادی و نانوایی سنتی خانگی',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'fa-IR': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: siteUrl,
    title: 'کارگاه کیک مادر | سفارش آنلاین کیک خانگی و نان سنتی جنوب',
    description:
      'عطر نان داغ، طعم کیک‌های تازه و نوستالژی کلوچه‌های محلی با دست‌پخت مادر در آبادان و خرمشهر. پخت روزانه با مواد اولیه ۱۰۰٪ ارگانیک.',
    siteName: 'کارگاه کیک و شیرینی خانگی مادر',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'کارگاه کیک خانگی مادر در آبادان و خرمشهر',
        type: 'image/jpeg',
      },
      {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'نان خرمایی اصیل جنوب دست‌پخت مادر',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'کارگاه کیک مادر | کیک خانگی و نان خرمایی آبادان و خرمشهر',
    description:
      'سفارش آنلاین انواع کیک خانگی با فیلینگ اختصاصی و پخت تازه روز در آبادان و خرمشهر.',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IR-06',
    'geo.placename': 'Abadan, Khorramshahr, Khuzestan, Iran',
    'geo.position': '30.3392;48.3043',
    ICBM: '30.3392, 48.3043',
    'apple-mobile-web-app-title': 'کیک مادر',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Generative Engine Optimization (GEO) & LLM standard link */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs Full Knowledge Base" />
        {/* Local Business & SEO JSON-LD Schemas */}
        <SEOStructuredData />
      </head>
      <body className="min-h-screen flex flex-col bg-cream-50 text-bakeryBrown-900 font-vazir antialiased selection:bg-roseBakery-200 selection:text-roseBakery-900">
        <SiteContentProvider>
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2F1F15',
                color: '#FDFBF7',
                borderRadius: '16px',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontFamily: 'Vazirmatn, sans-serif',
                fontSize: '14px',
                padding: '12px 18px',
                direction: 'rtl',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F43F5E',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />

          <Navbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
          <LiveEditBar />
        </SiteContentProvider>
      </body>
    </html>
  );
}
