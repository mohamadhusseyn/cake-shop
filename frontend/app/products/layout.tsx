import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madarcake.ir';

export const metadata: Metadata = {
  title: 'منوی کامل کیک خانگی، نان خرمایی و کلوچه جنوب | آبادان و خرمشهر',
  description:
    'مشاهده منوی کامل و قیمت روز انواع کیک تولد اسفنجی، کیک خامه‌ای کارامل و نوتلا، نان خرمایی اصیل جنوب و کلوچه زعفرانی با دست‌پخت مادر. پخت روزانه و ارسال در آبادان و خرمشهر.',
  keywords: [
    'منوی کیک آبادان',
    'قیمت کیک تولد خرمشهر',
    'خرید نان خرمایی جنوب',
    'کلوچه سنتی آبادان',
    'سفارش آنلاین کیک عصرانه',
    'کیک پسته و هل',
    'سوغات نان خرمایی خوزستان',
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: 'منوی کامل کیک و نان خانگی مادر | آبادان و خرمشهر',
    description:
      'مشاهده قیمت و سفارش آنلاین انواع کیک تولد، نان خرمایی و کلوچه تازه با امکان سفارشی‌سازی فیلینگ و متن کیک.',
    url: `${siteUrl}/products`,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
