import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madarcake.ir';

export const metadata: Metadata = {
  title: 'تماس با کارگاه کیک مادر | آدرس و شماره تلفن در آبادان و خرمشهر',
  description:
    'راه‌های ارتباط و تماس با کارگاه کیک و شیرینی خانگی مادر در آبادان و خرمشهر. مشاوره سفارش کیک‌های مجلسی، مراسم، استعلام قیمت و هماهنگی تحویل درب منزل.',
  keywords: [
    'شماره تماس کیک مادر',
    'آدرس قنادی خانگی آبادان',
    'تلفن سفارش کیک خرمشهر',
    'پشتیبانی سفارشات کیک جنوب',
    'کارگاه کیک محله بریم آبادان',
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'ارتباط با کارگاه کیک و نان خانگی مادر | آبادان و خرمشهر',
    description: 'مشاوره و ثبت سفارش تلفنی و اینترنتی انواع کیک و نان سنتی جنوب با مادر.',
    url: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
