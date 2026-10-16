import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'کارگاه کیک و نان خانگی مادر | آبادان و خرمشهر',
    short_name: 'کیک مادر',
    description: 'سفارش آنلاین انواع کیک خانگی، نان سنتی جنوب و کلوچه تازه در شهرهای آبادان و خرمشهر با ارسال درب منزل',
    start_url: '/',
    display: 'standalone',
    background_color: '#2F1F15',
    theme_color: '#FAF6EE',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
