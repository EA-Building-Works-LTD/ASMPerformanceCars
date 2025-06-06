This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SEO Optimization

This project implements sitemaps and robots.txt for improved search engine optimization:

### Sitemap Generation

Sitemaps are implemented in three ways:

1. **Next.js 15's built-in sitemap**: Using the `src/app/sitemap.ts` file, which generates a sitemap automatically based on routes.

2. **next-sitemap package**: For more advanced features like splitting large sitemaps and additional customization options. This runs during the build process via the `postbuild` script.

3. **Dynamic server-side sitemaps**: For content that changes frequently or is stored in a database.
   - `/server-sitemap-cars.xml` - Dynamically generates sitemap entries for all car listings
   - `/server-sitemap-blogs.xml` - Dynamically generates sitemap entries for all blog posts

The main sitemap index references these additional sitemaps, ensuring that search engines can discover all your content, including newly added cars and blog posts.

### Robots.txt

The robots.txt file is also implemented in two ways:

1. **Next.js 15's built-in robots.txt**: Using the `src/app/robots.ts` file.

2. **next-sitemap package**: Generated as part of the build process.

### Environment Variables

Make sure to set the `NEXT_PUBLIC_SITE_URL` environment variable to your production domain in production environments.

### Testing Your Sitemap

To test your sitemap locally:

1. Run the development server: `npm run dev`
2. Access the main sitemap: `http://localhost:3000/sitemap.xml`
3. Access the car listings sitemap: `http://localhost:3000/server-sitemap-cars.xml`
4. Access the blog posts sitemap: `http://localhost:3000/server-sitemap-blogs.xml`

For production, simply replace `localhost:3000` with your domain name.

# ASM Performance Cars

## Form Submission with reCAPTCHA

The website uses Google reCAPTCHA v3 to protect forms from spam and abuse. This is an invisible verification system that runs in the background and doesn't require user interaction.

### Setting Up reCAPTCHA

1. **Get reCAPTCHA Keys**:
   - Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
   - Register a new site with the following settings:
     - reCAPTCHA type: **v3**
     - Domains: add your domains (e.g., `localhost`, `asmperformancecars.co.uk`)
     - Accept the terms of service
   - After creation, you'll receive a **Site Key** and **Secret Key**

2. **Configure Environment Variables**:
   - Run our setup script: `npm run setup-env`
   - When prompted, enter your reCAPTCHA keys
   - This will create or update your `.env.local` file

Alternatively, you can manually add these to your `.env.local` file:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Forms with reCAPTCHA Protection

The following forms are protected with reCAPTCHA:

- Contact Form
- MOT Check Form
- Newsletter Subscription

### Troubleshooting

If forms aren't submitting properly, check the browser console for errors. Common issues include:

- Missing environment variables
- Network connectivity problems
- Incorrect domain configuration in reCAPTCHA

In development mode, reCAPTCHA will show a warning but still work even without proper keys configured.
