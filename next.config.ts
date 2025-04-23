import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Skip type checking and linting during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  distDir: '.next',
  images: {
    unoptimized: true, // Required for static export
    domains: ['cdn.sanity.io', 'ui-avatars.com', 'lh3.googleusercontent.com'],
  },
  
  // Redirects from the CSV file
  async redirects() {
    // Helper function to create both trailing and non-trailing slash versions
    const createRedirectPair = (source: string, destination: string) => {
      // Remove trailing slash if it exists
      const cleanSource = source.endsWith('/') ? source.slice(0, -1) : source;
      
      return [
        // Without trailing slash
        {
          source: cleanSource,
          destination,
          permanent: true,
        },
        // With trailing slash
        {
          source: `${cleanSource}/`,
          destination,
          permanent: true,
        }
      ];
    };

    // Create all redirects with both trailing and non-trailing slash versions
    const redirects = [
      // Blog redirects
      ...createRedirectPair('/9-fees-to-never-pay-a-car-dealership', '/blog/9-fees-to-never-pay-a-car-dealership'),
      ...createRedirectPair('/a-beginners-guide-to-modified-car-insurance-uk', '/blog/a-beginners-guide-to-modified-car-insurance-uk'),
      ...createRedirectPair('/about-us', '/about'),
      // Special case for path parameter
      {
        source: '/auto-brand/:path*',
        destination: '/modified-cars-for-sale',
        permanent: true,
      },
      ...createRedirectPair('/auto', '/modified-cars-for-sale'),
      ...createRedirectPair('/auto/1996-subaru-impreza-wrx-import', '/our-cars/modified-cars-for-sale/subaru-impreza-wrx'),
      ...createRedirectPair('/auto/2003-subaru-impreza-sti-jdm', '/our-cars/modified-cars-for-sale/subaru-impreza-sti-jdm'),
      ...createRedirectPair('/auto/2006-yamaha-raptor-yfm-700r-special-edition', '/modified-cars-for-sale'),
      ...createRedirectPair('/auto/2007-seat-leon-cupra-k1-r-tech-stage-2', '/our-cars/modified-cars-for-sale/2007-seat-leon-cupra-k1'),
      ...createRedirectPair('/auto/2014-seat-leon-cupra-280', '/our-cars/modified-cars-for-sale/seat-leon-cupra-280'),
      ...createRedirectPair('/auto/2016-bmw-m140i-5-door-automatic', '/our-cars/modified-cars-for-sale/bmw-1-series-m140i'),
      ...createRedirectPair('/auto/seat-leon-cupra-k1-white', '/our-cars/modified-cars-for-sale/2008-seat-leon-cupra-k1'),
      ...createRedirectPair('/auto/volkswagen-golf-gti-mk7', '/our-cars/modified-cars-for-sale/mk7-volkswagen-golf-gti'),
      ...createRedirectPair('/best-used-cars-to-buy-in-2024', '/blog/best-used-cars-to-buy-in-2025'),
      
      // Dealership redirects - special case with parameter
      {
        source: '/birmingham-car-dealerships/:dealership',
        destination: '/dealerships/:dealership',
        permanent: true,
      },
      {
        source: '/birmingham-car-dealerships/:dealership/',
        destination: '/dealerships/:dealership',
        permanent: true,
      },
      
      // More blog redirects
      ...createRedirectPair('/car-finance-uk-low-apr-interest-free-pcp-hp-explained', '/blog/car-finance-uk-low-apr-interest-free-pcp-hp-explained'),
      ...createRedirectPair('/car-insurance-write-off-categories-cat-s-cat-n-cars-explained', '/blog/car-insurance-write-off-categories-cat-s-cat-n-cars-explained'),
      ...createRedirectPair('/car-maintenance-essentials-for-high-performance-cars', '/blog/car-maintenance-essentials-for-high-performance-cars'),
      ...createRedirectPair('/cat-s-cars-explained-a-comprehensive-guide', '/blog/cat-s-cars-explained-a-comprehensive-guide'),
      
      // Category redirects
      ...createRedirectPair('/category/car-finance', '/blog/category/car-finance'),
      ...createRedirectPair('/category/hybrid-electric-cars', '/blog/category/hybrid-and-electric-cars'),
      ...createRedirectPair('/category/investment', '/blog'),
      ...createRedirectPair('/category/maintenance', '/blog'),
      ...createRedirectPair('/category/supercars-articles', '/blog/category/supercars'),
      ...createRedirectPair('/category/used-cars', '/blog/category/used-cars'),
      
      // Other page redirects
      ...createRedirectPair('/check-my-mot', '/mot-check'),
      ...createRedirectPair('/contact-us', '/contact'),
      ...createRedirectPair('/dealers/birmingham-car-dealerships', '/dealerships'),
      ...createRedirectPair('/eco-friendly-speed-a-look-at-hybrid-and-electric-performance-cars', '/blog/eco-friendly-speed-a-look-at-hybrid-and-electric-performance-cars'),
      ...createRedirectPair('/faqs/performance-cars', '/faqs/modified-cars-faqs'),
      ...createRedirectPair('/hidden-costs-of-buying-a-used-car', '/blog/hidden-costs-of-buying-a-used-car'),
      ...createRedirectPair('/how-to-check-a-used-cars-mot-history', '/blog/how-to-check-a-used-cars-mot-history'),
      ...createRedirectPair('/luxury-supercars-for-sale-in-the-uk-a-closer-look', '/blog/luxury-supercars-for-sale-in-the-uk-a-closer-look'),
      ...createRedirectPair('/modified-cars', '/our-cars/modified-cars-for-sale'),
      ...createRedirectPair('/performance-cars-as-investments-what-you-need-to-know', '/blog/performance-cars-as-investments-what-you-need-to-know'),
      ...createRedirectPair('/search-modified-cars', '/our-cars'),
      ...createRedirectPair('/supercars-for-sale', '/our-cars/luxury-supercars-for-sale'),
      
      // All supercar pages redirect to not-available - special case with parameter
      {
        source: '/supercars-for-sale/:slug',
        destination: '/supercars-for-sale/not-available',
        permanent: true,
      },
      {
        source: '/supercars-for-sale/:slug/',
        destination: '/supercars-for-sale/not-available',
        permanent: true,
      },
      
      ...createRedirectPair('/terms-of-use', '/terms-conditions'),
      ...createRedirectPair('/the-best-sports-cars-to-watch-in-2024', '/blog/the-best-sports-cars-to-watch-in-2024'),
      ...createRedirectPair('/the-complete-guide-to-category-n-cars', '/blog/the-complete-guide-to-category-n-cars'),
      ...createRedirectPair('/top-picks-for-best-hybrid-cars-of-the-year', '/blog/top-picks-for-best-hybrid-cars-of-the-year'),
      
      // Used cars redirects
      ...createRedirectPair('/used-audi-rs3-cars-for-sale', '/our-cars/used-cars-for-sale'),
      ...createRedirectPair('/used-audi-s1-cars-for-sale', '/our-cars/used-cars-for-sale'),
      ...createRedirectPair('/used-audi-s3-cars-for-sale', '/our-cars/used-cars-for-sale'),
      ...createRedirectPair('/used-audi-s4-cars-for-sale', '/our-cars/used-cars-for-sale'),
      ...createRedirectPair('/used-audi-s5-cars-for-sale', '/our-cars/used-cars-for-sale'),
      ...createRedirectPair('/used-audi-s6-cars-for-sale', '/our-cars/used-cars-for-sale'),
    ];

    // Flatten the array
    return redirects.flat();
  },
};

export default nextConfig;
