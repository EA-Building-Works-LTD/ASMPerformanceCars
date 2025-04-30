/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.asmperformancecars.co.uk',
          },
        ],
        destination: 'https://asmperformancecars.co.uk/:path*',
        permanent: true,
        statusCode: 301
      },
    ]
  },
  async rewrites() {
    return []
  },
  // Force HTTPS in production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          },
          {
            key: 'Link',
            value: '<https://asmperformancecars.co.uk>; rel="canonical"'
          }
        ],
      },
    ]
  },
  // Configure allowed image domains
  images: {
    domains: [
      'cdn.sanity.io',
      'lh3.googleusercontent.com'
    ],
  },
}

module.exports = nextConfig 