import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madarcake.ir';

export const metadata: Metadata = {
  title: 'داستان کارگاه کیک مادر | اصالت و عشق مادری در آبادان و خرمشهر',
  description:
    'داستان شکل‌گیری کارگاه کیک و نان خانگی مادر از یک فر کوچک در محله بریم آبادان تا سفره‌های پربرکت مردم خونگرم خوزستان. آشنایی با اصول پخت سالم و بدون نگهدارنده.',
  keywords: [
    'داستان کیک مادر',
    'کارگاه کیک خانگی آبادان',
    'قنادی سنتی خرمشهر',
    'پخت خانگی شیرینی جنوب',
    'اصالت دست‌پخت مادر',
  ],
  alternates: {
    canonical: `${siteUrl}/story`,
  },
  openGraph: {
    title: 'داستان کارگاه کیک مادر | از آشپزخانه خانگی تا قلب مردم جنوب',
    description: 'روایت ۲۵ سال اشتیاق مادر برای پخت کیک‌های اسفنجی و نان خرمایی در آبادان و خرمشهر.',
    url: `${siteUrl}/story`,
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
