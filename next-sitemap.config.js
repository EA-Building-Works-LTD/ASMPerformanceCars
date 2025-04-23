/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk',
  generateRobotsTxt: true,
  outDir: 'public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*', 
          '/admin/*', 
          '/_next/*',
          '/404',
          '/500'
        ]
      },
    ],
    additionalSitemaps: [
      // Add the sitemap index which references all our dynamic sitemaps
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk'}/sitemap-index.xml`,
    ],
  },
  exclude: [
    '/404',
    '/500',
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/server-sitemap-pages.xml',
    '/server-sitemap-cars.xml',
    '/server-sitemap-blogs.xml',
    '/sitemap-index.xml',
  ],
  // Since we're generating pages dynamically now, we don't need to generate a static sitemap
  // Setting generateIndexSitemap: false because we're using our own custom sitemap index
  generateIndexSitemap: false,
  // Change frequency and priority settings
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  // Additional options for more control
  autoLastmod: true,
  sitemapBaseFileName: 'static-sitemap',
  transform: async (config, path) => {
    // Custom priority for specific routes
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Customize priority based on path
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/our-cars')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/services')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/faqs')) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.startsWith('/blog')) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (['/about', '/contact'].includes(path)) {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
} 