import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madarcake.ir';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/products/*', '/story', '/contact', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin/', '/admin/*', '/api/admin/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Applebot'],
        allow: ['/', '/llms.txt', '/llms-full.txt', '/products', '/story', '/contact'],
        disallow: ['/admin/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
