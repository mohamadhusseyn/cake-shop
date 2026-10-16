import { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madarcake.ir';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product =
    INITIAL_PRODUCTS.find((p) => p.id === params.id) || INITIAL_PRODUCTS[0];

  return {
    title: `${product.title} | سفارش آنلاین در آبادان و خرمشهر`,
    description: `${product.description} - پخت روزانه با دست‌پخت مادر، بدون مواد نگه‌دارنده و ارسال اختصاصی در آبادان و خرمشهر.`,
    keywords: [
      product.title,
      `${product.title} آبادان`,
      `${product.title} خرمشهر`,
      'سفارش کیک خانگی مادر',
      'کیک تولد تازه جنوب',
      'فیلینگ کیک سفارشی',
    ],
    alternates: {
      canonical: `${siteUrl}/products/${product.id}`,
    },
    openGraph: {
      title: `${product.title} | کارگاه کیک مادر`,
      description: product.description,
      url: `${siteUrl}/products/${product.id}`,
      type: 'article',
      images: product.images?.map((img) => ({
        url: img,
        width: 800,
        height: 600,
        alt: product.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | کارگاه کیک مادر`,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const product =
    INITIAL_PRODUCTS.find((p) => p.id === params.id) || INITIAL_PRODUCTS[0];

  // Specific Product JSON-LD Schema
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    category:
      product.category === 'cake'
        ? 'کیک خانگی'
        : product.category === 'bread'
        ? 'نان سنتی جنوب'
        : 'کلوچه سنتی',
    offers: {
      '@type': 'Offer',
      price: product.basePrice,
      priceCurrency: 'IRT',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Bakery',
        name: 'کارگاه کیک مادر',
        url: siteUrl,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    brand: {
      '@type': 'Brand',
      name: 'دست‌پخت مادر',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {children}
    </>
  );
}
