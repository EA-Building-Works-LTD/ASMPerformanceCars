import { getServerSideSitemap } from 'next-sitemap';
import { client } from '@/sanity/lib/client';

// Configure this route as static for compatibility with Vercel deployment
export const dynamic = 'force-static';

// Add cache control for this route (revalidate every 4 hours)
export const revalidate = 14400;

export async function GET() {
  try {
    // Fetch all blog posts from Sanity
    const posts = await client.fetch(`
      *[_type == "post"] {
        _id,
        title,
        slug,
        publishedAt,
        _updatedAt
      }
    `);
    
    // Base URL for the site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk';
    
    // Create sitemap entries for each blog post
    const sitemapEntries = posts.map((post: unknown) => {
      // Create the full URL
      const url = `${baseUrl}/blog/${post.slug?.current || post._id}`;
      
      // Get the last modified date (use _updatedAt or publishedAt if available, or current date)
      const lastModified = post._updatedAt 
        ? new Date(post._updatedAt).toISOString()
        : post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : new Date().toISOString();
      
      return {
        loc: url,
        lastmod: lastModified,
        // Blog posts change less frequently
        changefreq: 'weekly',
        // Medium-high priority for blog posts
        priority: 0.7,
      };
    });
    
    // Return the sitemap XML
    return getServerSideSitemap(sitemapEntries);
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    // Return an empty sitemap if there's an error
    return getServerSideSitemap([]);
  }
} 