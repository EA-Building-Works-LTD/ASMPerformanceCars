import { getServerSideSitemap } from 'next-sitemap';
import { getAllVehicles } from '@/sanity/lib/client';

// Configure this route as static for compatibility with Vercel deployment
export const dynamic = 'force-static';

// Add cache control for this route (revalidate every 4 hours)
export const revalidate = 14400;

export async function GET() {
  try {
    // Fetch all vehicles from Sanity
    const vehicles = await getAllVehicles();
    
    // Base URL for the site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
    
    // Create sitemap entries for each vehicle
    const sitemapEntries = vehicles.map((vehicle: any) => {
      // Determine the correct URL path based on vehicle type
      let categoryPath = '';
      
      if (vehicle._type === 'modifiedVehicle') {
        categoryPath = 'modified-cars-for-sale';
      } else if (vehicle._type === 'luxuryVehicle') {
        categoryPath = 'luxury-supercars-for-sale';
      } else if (vehicle._type === 'vehicle') {
        categoryPath = 'used-cars-for-sale';
      }
      
      // Get the vehicle slug
      const slug = vehicle.slug?.current || vehicle._id;
      
      // Create the full URL
      const url = `${baseUrl}/our-cars/${categoryPath}/${slug}`;
      
      // Get the last modified date (use _updatedAt, publishedAt, or current date)
      const lastModified = vehicle._updatedAt
        ? new Date(vehicle._updatedAt).toISOString()
        : vehicle.publishedAt
          ? new Date(vehicle.publishedAt).toISOString()
          : new Date().toISOString();
      
      return {
        loc: url,
        lastmod: lastModified,
        // Cars should be crawled frequently as inventory changes
        changefreq: 'daily',
        // High priority for car detail pages
        priority: 0.8,
      };
    });
    
    // Return the sitemap XML
    return getServerSideSitemap(sitemapEntries);
  } catch (error) {
    console.error('Error generating car sitemap:', error);
    // Return an empty sitemap if there's an error
    return getServerSideSitemap([]);
  }
} 