import React from 'react';
import { INITIAL_PRODUCTS } from '@/lib/api';

export const SEOStructuredData: React.FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smincake.ir';

  // 1. Bakery / LocalBusiness Schema
  const bakerySchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${baseUrl}/#bakery`,
    name: 'کارگاه تخصصی ثمین کیک (Smin Cake)',
    alternateName: [
      'ثمین کیک',
      'Smin Cake',
      'Smin Cake Bakery',
      'کارگاه ثمین کیک آبادان',
      'ثمین کیک خرمشهر',
      'قنادی خانگی ثمین کیک آبادان و خرمشهر',
      'کیک و نان سنتی ثمین',
    ],
    description:
      'سفارش آنلاین انواع کیک خانگی، نان خرمایی اصیل جنوب و کلوچه تازه با دست‌پخت مادر در کارگاه ثمین کیک (Smin Cake). پخت روزانه با مواد اولیه مرغوب و ارسال اختصاصی در شهرهای آبادان و خرمشهر.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    ],
    telephone: '+989161314589',
    priceRange: '$$',
    servesCuisine: [
      'کیک خانگی',
      'نان خرمایی جنوب',
      'شیرینی سنتی خوزستان',
      'کلوچه زعفرانی',
      'Persian Bakery',
      'Pastry',
    ],
    currenciesAccepted: 'IRT, IRR',
    paymentAccepted: 'Cash, Credit Card, Online Payment, کارت به کارت',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خیابان امیری و محله بریم',
      addressLocality: 'آبادان',
      addressRegion: 'خوزستان',
      postalCode: '6314812345',
      addressCountry: 'IR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.3392,
      longitude: 48.3043,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'آبادان',
      },
      {
        '@type': 'City',
        name: 'خرمشهر',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'منطقه آزاد اروند',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'خوزستان',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '08:00',
        closes: '22:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'منوی کیک و شیرینی خانگی کارگاه مادر',
      itemListElement: INITIAL_PRODUCTS.map((prod, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: prod.title,
          description: prod.description,
          image: prod.images?.[0],
          url: `${baseUrl}/products/${prod.id}`,
          offers: {
            '@type': 'Offer',
            price: prod.basePrice,
            priceCurrency: 'IRT',
            availability: prod.available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            priceValidUntil: '2027-12-31',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: prod.rating,
            reviewCount: prod.reviewCount,
          },
        },
      })),
    },
  };

  // 2. WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'ثمین کیک (Smin Cake)',
    description:
      'سفارش آنلاین کیک و نان تازه خانگی در آبادان و خرمشهر با دست‌پخت مادر در ثمین کیک',
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // 3. FAQPage Schema for AI Engines and Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'هزینه ارسال کیک و نان خانگی به شهرهای آبادان و خرمشهر چقدر است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'هزینه ارسال اختصاصی با پیک کارگاهی در محدوده شهرهای آبادان و خرمشهر ۲۵,۰۰۰ تومان می‌باشد و برای سفارش‌های بالای ۱ میلیون تومان به صورت کاملاً رایگان تحویل داده می‌شود.',
        },
      },
      {
        '@type': 'Question',
        name: 'چقدر قبل از مراسم باید سفارش کیک تولد را ثبت کنیم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'برای کیک‌های خامه‌ای و سفارشی به دلیل لزوم پخت روز و تازگی مواد اولیه، حداقل ۲۴ ساعت قبل سفارش خود را ثبت نمایید. نان خرمایی و کلوچه‌ها در صورت فعال بودن سهمیه همان روز تحویل داده می‌شوند.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا امکان نوشتن متن دلخواه و انتخاب رنگ روبان جعبه وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله، در فرآیند ثبت سفارش می‌توانید متن دست‌نویس خامه‌ای روی کیک (مثلاً تبریک تولد یا سالگرد) و رنگ روبان کادویی جعبه را کاملاً سفارشی انتخاب نمایید.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا در کیک‌ها و نان‌های کارگاه مادر از مواد نگه‌دارنده یا اسانس استفاده می‌شود؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'خیر، هیچ‌گونه مواد افزودنی شیمیایی، اسانس یا نگه‌دارنده استفاده نمی‌شود. تمام محصولات با کره حیوانی، آرد مرغوب، خرمای تازه خوزستان، گلاب دوآتشه و زعفران خالص پخته می‌شوند.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا امکان سفارش و ارسال به خرمشهر نیز وجود دارد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله، کارگاه کیک مادر اختصاصاً به هر دو شهر آبادان و خرمشهر با بسته‌بندی ایمن و خنک خدمات ارسال درب منزل ارائه می‌دهد.',
        },
      },
    ],
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'صفحه اصلی',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'منوی محصولات و سفارش کیک',
        item: `${baseUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'داستان دست‌پخت مادر',
        item: `${baseUrl}/story`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'تماس و ارتباط با کارگاه',
        item: `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
