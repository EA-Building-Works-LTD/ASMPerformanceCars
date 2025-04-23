// This file is renamed to sitemap.ts.bak to disable the built-in Next.js sitemap
// We are instead using next-sitemap with a sitemap-index.xml approach

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
  
  // Define your main routes
  const routes = [
    '',
    '/our-cars',
    '/our-cars/modified-cars-for-sale',
    '/our-cars/luxury-supercars-for-sale',
    '/our-cars/used-cars-for-sale',
    '/services',
    '/services/finance',
    '/services/part-exchange',
    '/services/consignment-car-sales',
    '/faqs',
    '/faqs/car-finance-faqs',
    '/faqs/car-maintenance-faqs',
    '/faqs/car-buying-selling-faqs',
    '/faqs/car-insurance-faqs',
    '/faqs/hybrid-electric-cars-faqs',
    '/faqs/modified-cars-faqs',
    '/faqs/used-cars-faqs',
    '/blog',
    '/about',
    '/contact',
    '/mot-check'
  ];

  // Map routes to sitemap entries
  return routes.map((route) => {
    // Customize priority based on importance
    let priority = 0.7;

    if (route === '') {
      priority = 1.0;
    } else if (route.startsWith('/our-cars')) {
      priority = 0.9;
    } else if (route.startsWith('/services')) {
      priority = 0.8;
    } else if (route.startsWith('/faqs')) {
      priority = 0.7;
    } else if (route.startsWith('/blog')) {
      priority = 0.7;
    } else if (['/about', '/contact'].includes(route)) {
      priority = 0.6;
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      priority: priority,
    };
  });
} 