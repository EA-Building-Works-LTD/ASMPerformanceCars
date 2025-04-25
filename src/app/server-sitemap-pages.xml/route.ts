import { getServerSideSitemap } from 'next-sitemap';
import type { ISitemapField } from 'next-sitemap';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configure this route as static for compatibility with Vercel deployment
export const dynamic = 'force-static';

// Add cache control for this route (revalidate every 12 hours)
export const revalidate = 43200;

// Helper function to convert filesystem path to route
function filePathToRoute(filePath: string): string {
  // Remove src/app prefix
  let route = filePath.replace(/^src[\\/]app/, '');
  
  // Remove file extension
  route = route.replace(/\.(js|jsx|ts|tsx)$/, '');
  
  // Handle route groups (folders starting with parentheses)
  route = route.replace(/[\\/]\([^\)]+\)[\\/]/g, '/');
  
  // Handle specific special cases for dynamic routes
  // 1. [...slug] - Catch-all routes
  route = route.replace(/\[\.\.\.([^\]]+)\]/g, 'param');
  // 2. [[...slug]] - Optional catch-all routes
  route = route.replace(/\[\[\.\.\.([^\]]+)\]\]/g, '');
  
  // Handle standard dynamic routes (remove the colon to generate proper Next.js URLs)
  route = route.replace(/[\\/]\[([^\]]+)\]/g, '/$1');
  
  // Handle page.tsx/page.js files
  route = route.replace(/[\\/]page$/, '');
  
  // Replace backslashes with forward slashes for Windows compatibility
  route = route.replace(/\\/g, '/');
  
  // Handle route.js/route.ts files (API routes - exclude these)
  if (route.endsWith('/route')) {
    return '';
  }
  
  // Handle root page
  if (route === '') {
    return '/';
  }
  
  // Remove any remaining square brackets that might cause issues
  route = route.replace(/\[|\]/g, '');
  
  return route;
}

// Fallback list of important static pages to use if dynamic discovery fails
const getStaticPages = () => {
  return [
    {
      path: '/',
      priority: 1.0,
      changefreq: 'daily' as const
    },
    {
      path: '/about',
      priority: 0.6,
      changefreq: 'monthly' as const
    },
    {
      path: '/contact',
      priority: 0.6,
      changefreq: 'monthly' as const
    },
    {
      path: '/services',
      priority: 0.8,
      changefreq: 'weekly' as const
    },
    {
      path: '/services/finance',
      priority: 0.7,
      changefreq: 'weekly' as const
    },
    {
      path: '/services/part-exchange',
      priority: 0.7,
      changefreq: 'weekly' as const
    },
    {
      path: '/services/consignment-car-sales',
      priority: 0.7,
      changefreq: 'weekly' as const
    },
    {
      path: '/services/car-transportation',
      priority: 0.7,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs',
      priority: 0.7,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs/car-buying-selling-faqs',
      priority: 0.6,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs/car-insurance-faqs',
      priority: 0.6,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs/hybrid-electric-cars-faqs',
      priority: 0.6,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs/modified-cars-faqs',
      priority: 0.6,
      changefreq: 'weekly' as const
    },
    {
      path: '/faqs/used-cars-faqs',
      priority: 0.6,
      changefreq: 'weekly' as const
    },
    {
      path: '/mot-check',
      priority: 0.6,
      changefreq: 'monthly' as const
    },
    {
      path: '/privacy-policy',
      priority: 0.4,
      changefreq: 'yearly' as const
    },
    {
      path: '/cookie-policy',
      priority: 0.4,
      changefreq: 'yearly' as const
    },
    {
      path: '/terms-conditions',
      priority: 0.4,
      changefreq: 'yearly' as const
    }
  ];
};

// Process a route and assign SEO priority and change frequency
function processRoute(route: string): { route: string; priority: number; changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' } {
  let priority = 0.7;
  let changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
  
  // Replace dynamic route segments with reasonable values for common patterns
  let processedRoute = route;
  
  if (route.includes('/blog/')) {
    processedRoute = processedRoute.replace('/blog/slug', '/blog/sample-blog-post');
  } else if (route.includes('/our-cars/')) {
    processedRoute = processedRoute.replace('/our-cars/slug', '/our-cars/sample-car');
  } else if (route.includes('/category/')) {
    processedRoute = processedRoute.replace('/category/slug', '/category/sample-category');
  }
  
  if (processedRoute === '/') {
    priority = 1.0;
    changefreq = 'daily';
  } else if (processedRoute.startsWith('/our-cars')) {
    priority = 0.9;
    changefreq = 'daily';
  } else if (processedRoute.startsWith('/services')) {
    priority = 0.8;
    changefreq = 'weekly';
  } else if (processedRoute.startsWith('/faqs')) {
    priority = 0.7;
    changefreq = 'weekly';
  } else if (processedRoute.startsWith('/blog')) {
    priority = 0.7;
    changefreq = 'weekly';
  } else if (['/about', '/contact'].includes(processedRoute)) {
    priority = 0.6;
    changefreq = 'monthly';
  }
  
  return {
    route: processedRoute,
    priority,
    changefreq
  };
}

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
    console.log(`Generating sitemap with base URL: ${baseUrl}`);
    
    // Try multiple glob patterns to find pages in different environments
    const patterns = [
      'src/app/**/page.{js,jsx,ts,tsx}',   // Development environment
      '.next/server/app/**/page.js',        // Production - .next server directory
      'app/**/page.{js,jsx,ts,tsx}'         // Production - app directory directly
    ];
    
    let allPages: string[] = [];
    
    // Try each pattern to find pages
    for (const pattern of patterns) {
      try {
        const pages = await glob(pattern);
        if (pages.length > 0) {
          console.log(`Found ${pages.length} pages using pattern: ${pattern}`);
          allPages = [...allPages, ...pages];
        }
      } catch (err) {
        console.log(`Error with pattern ${pattern}:`, err);
      }
    }
    
    console.log(`Found a total of ${allPages.length} pages across all patterns`);
    
    // These patterns should be excluded from the sitemap
    const excludePatterns = [
      '/api/',
      '/admin/',
      '/_',
      '/404',
      '/500',
      '/server-sitemap',
      '/sitemap-index.xml',
    ];
    
    // Convert file paths to routes and filter out excluded routes
    let routes = allPages
      .map(filePathToRoute)
      .filter(route => {
        if (!route) return false;
        return !excludePatterns.some(pattern => route.includes(pattern));
      });
    
    console.log(`After filtering, ${routes.length} valid routes remain for sitemap`);
    
    // If no routes were found, use the static list as fallback
    if (routes.length === 0) {
      console.log('No routes found, using static page list as fallback');
      routes = getStaticPages().map(page => page.path);
    }
    
    // Create sitemap entries with priorities
    const sitemapEntries: ISitemapField[] = [];
    
    // Add all valid routes to the sitemap
    for (const route of routes) {
      // Skip dynamic catch-all routes
      if (route.includes('/param')) {
        console.log(`Skipping catch-all route: ${route}`);
        continue;
      }
      
      // Process the route to get priority and changefreq
      const { route: processedRoute, priority, changefreq } = processRoute(route);
      
      // Only add valid routes
      if (processedRoute && processedRoute.length > 0) {
        sitemapEntries.push({
          loc: `${baseUrl}${processedRoute}`,
          lastmod: new Date().toISOString(),
          priority,
          changefreq,
        });
      }
    }
    
    // If somehow we still have no entries, fall back to just the homepage
    if (sitemapEntries.length === 0) {
      console.log('No valid entries found, adding homepage as fallback');
      sitemapEntries.push({
        loc: `${baseUrl}/`,
        lastmod: new Date().toISOString(),
        priority: 1.0,
        changefreq: 'daily',
      });
    }
    
    console.log(`Final sitemap contains ${sitemapEntries.length} URLs`);
    
    // Return the sitemap XML
    return getServerSideSitemap(sitemapEntries);
  } catch (error) {
    console.error('Error generating pages sitemap:', error);
    // Return a sitemap with at least the homepage as a fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
    return getServerSideSitemap([{
      loc: `${baseUrl}/`,
      lastmod: new Date().toISOString(),
      priority: 1.0,
      changefreq: 'daily',
    }]);
  }
} 