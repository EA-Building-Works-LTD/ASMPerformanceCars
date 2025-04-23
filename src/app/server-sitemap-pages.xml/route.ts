import { getServerSideSitemap } from 'next-sitemap';
import type { ISitemapField } from 'next-sitemap';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

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

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
    console.log(`Generating sitemap with base URL: ${baseUrl}`);
    
    // Find all page.tsx/page.js files
    const pages = await glob('src/app/**/page.{js,jsx,ts,tsx}');
    console.log(`Found ${pages.length} page files in the app directory`);
    
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
    const routes = pages
      .map(filePathToRoute)
      .filter(route => {
        if (!route) return false;
        return !excludePatterns.some(pattern => route.includes(pattern));
      });
    
    console.log(`After filtering, ${routes.length} valid routes remain for sitemap`);
    
    // Create sitemap entries with priorities
    const validEntries: ISitemapField[] = [];
    
    for (const route of routes) {
      // Set priority based on route depth and type
      let priority = 0.7;
      let changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
      
      // Replace dynamic parameters with appropriate values where possible
      let processedRoute = route;
      
      // Replace dynamic route segments with reasonable values for common patterns
      if (route.includes('/blog/')) {
        processedRoute = processedRoute.replace('/blog/slug', '/blog/sample-blog-post');
      } else if (route.includes('/our-cars/')) {
        processedRoute = processedRoute.replace('/our-cars/slug', '/our-cars/sample-car');
      } else if (route.includes('/category/')) {
        processedRoute = processedRoute.replace('/category/slug', '/category/sample-category');
      } else if (route.includes('/param')) {
        // Handle catch-all routes - exclude from sitemap as they're covered by individual routes
        console.log(`Skipping catch-all route: ${route}`);
        continue; // Skip this entry
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
      
      validEntries.push({
        loc: `${baseUrl}${processedRoute}`,
        lastmod: new Date().toISOString(),
        priority,
        changefreq,
      });
    }
    
    console.log(`Final sitemap contains ${validEntries.length} URLs`);
    
    // Log a few examples for debugging
    if (validEntries.length > 0) {
      console.log('Sample entries:');
      validEntries.slice(0, 3).forEach(entry => console.log(` - ${entry.loc}`));
      if (validEntries.length > 3) {
        console.log(' - ... and more');
      }
    }
    
    // Return the sitemap XML
    return getServerSideSitemap(validEntries);
  } catch (error) {
    console.error('Error generating pages sitemap:', error);
    // Return an empty sitemap if there's an error
    return getServerSideSitemap([]);
  }
} 