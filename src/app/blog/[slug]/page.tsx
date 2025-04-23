import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { client, urlForImage } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Metadata } from 'next'
import KeyTakeaways from '@/components/blog/KeyTakeaways'
import BlogAd from '@/components/blog/BlogAd'
import ResponsiveBlogAd from '@/components/blog/ResponsiveBlogAd'
import { addCanonicalUrl } from '@/components/shared/CanonicalUrl'
import TableOfContents from '@/components/blog/TableOfContents'
import PortableTextWrapper from '@/components/blog/PortableTextWrapper'
import AuthorBioPortableText from '@/components/blog/AuthorBioPortableText'

// Fetch active ads
async function getActiveAds() {
  return client.fetch(`
    *[_type == "blogAd" && isActive == true] {
      _id,
      title,
      adSize,
      adImage,
      adVideo,
      link,
      trackingId,
      displayLocation
    }
  `)
}

// Type for BlogAd
interface BlogAd {
  _id: string;
  title: string;
  adSize: string;
  adImage: any;
  adVideo?: any;
  link: string;
  trackingId?: string;
  displayLocation: string;
}

// Get a single blog post by slug
async function getPostBySlug(slug: string) {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage,
      body,
      publishedAt,
      keyTakeaways,
      "categories": categories[]->title,
      "author": author->{name, image, bio},
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      seo {
        metaTitle,
        metaDescription
      }
    }
  `, { slug })
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Use Promise.resolve to ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ASM Performance Cars',
      description: 'The blog post you are looking for does not exist or has been removed.',
    }
  }

  // Create title with branding
  const postTitle = post.seo?.metaTitle || post.title;
  const brandedTitle = `${postTitle} | ASM Performance Cars`;

  const baseMetadata: Metadata = {
    title: brandedTitle,
    description: post.seo?.metaDescription || `Read about ${post.title} on ASM Performance Cars`,
    openGraph: {
      title: brandedTitle,
      description: post.seo?.metaDescription,
      images: post.mainImage ? [urlForImage(post.mainImage).url()] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description: post.seo?.metaDescription,
      images: post.mainImage ? [urlForImage(post.mainImage).url()] : [],
    },
  }
  
  // Add canonical URL to the metadata
  return addCanonicalUrl(baseMetadata, `/blog/${resolvedParams.slug}`);
}

// Make params strictly a Promise type to satisfy Next.js PageProps
export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  // Always await the params
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const post = await getPostBySlug(slug);
  const ads = await getActiveAds() as BlogAd[];
  
  // Filter ads by display location
  const aboveBackLinkAd = ads.find((ad) => ad.displayLocation === 'above_back_link');
  const belowTakeawaysAd = ads.find((ad) => ad.displayLocation === 'below_takeaways');
  const midContentAd = ads.find((ad) => ad.displayLocation === 'mid_content');
  const aboveBioAd = ads.find((ad) => ad.displayLocation === 'above_bio');
  
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Function to render the content with a mid-content ad
  const renderContentWithMidAd = () => {
    if (!midContentAd || !post.body) {
      return (
        <PortableTextWrapper value={post.body} />
      );
    }
    
    // Determine a good position to place the mid-content ad (roughly in the middle)
    const blocks = post.body;
    if (!Array.isArray(blocks) || blocks.length <= 5) {
      // If content is short, just render normally and put ad at the end
      return (
        <>
          <PortableTextWrapper value={post.body} />
          <div className="mt-12">
            <BlogAd ad={midContentAd} />
          </div>
        </>
      );
    }

    // For longer content, split roughly in the middle
    const midPoint = Math.floor(blocks.length / 2);
    const firstHalf = blocks.slice(0, midPoint);
    const secondHalf = blocks.slice(midPoint);

    return (
      <>
        <PortableTextWrapper value={firstHalf} />
        <BlogAd ad={midContentAd} />
        <PortableTextWrapper value={secondHalf} />
      </>
    );
  };
  
  return (
    <Layout>
      <article className="container mx-auto px-4 pt-4 pb-10 md:pt-8 md:pb-16">
        {/* Ad above Back to Blog link - responsive (970x90 desktop, 393x90 mobile) */}
        {aboveBackLinkAd && (
          <div className="mb-4">
            <ResponsiveBlogAd desktopAd={aboveBackLinkAd} className="mt-0" />
          </div>
        )}
        
        {/* Back to blog link */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category: string) => (
                <Link 
                  key={category} 
                  href={`/blog/category/${category.toLowerCase()
                    .replace(/\s*&\s*/g, '-and-')
                    .replace(/\s+/g, '-')
                  }`}
                >
                  <Badge className="bg-red-600 hover:bg-red-700 text-white">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            {post.title}
          </h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-4 mb-6">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {post.author?.name || 'Unknown'}</span>
            </div>
            
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Unknown date'}</span>
            </div>
            
            {/* Reading time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.estimatedReadingTime || 5} min read</span>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        {post.mainImage && (
          <div className="max-w-4xl mx-auto mb-12 relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Key Takeaways - positioned after the image but before content */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <KeyTakeaways takeaways={post.keyTakeaways} />
        )}
        
        {/* Ad below key takeaways */}
        {belowTakeawaysAd && <BlogAd ad={belowTakeawaysAd} />}
        
        {/* Content with Table of Contents */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 relative">
          {/* Mobile ToC at the top */}
          {post.body && (
            <div className="md:hidden w-full mb-8">
              <TableOfContents content={post.body} />
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1 blog-content max-w-3xl mx-auto order-1 md:order-1">
            {post.body && renderContentWithMidAd()}
          </div>
          
          {/* Desktop ToC on the side - use inline styles for more reliable sticky behavior */}
          {post.body && (
            <div className="hidden md:block md:w-64 shrink-0 order-2 md:order-2" style={{ position: 'sticky', alignSelf: 'flex-start', top: '2rem', height: 'fit-content' }}>
              <TableOfContents content={post.body} />
            </div>
          )}
        </div>
        
        {/* Ad above author bio */}
        {aboveBioAd && <div className="max-w-3xl mx-auto"><BlogAd ad={aboveBioAd} /></div>}
        
        {/* Author bio */}
        {post.author && (
          <div className="max-w-3xl mx-auto mt-12 p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-zinc-900">
            <div className="flex items-start gap-4">
              {post.author.image ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-800">
                  <Image
                    src={urlForImage(post.author.image).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-xl font-bold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg mb-2">About {post.author.name}</h3>
                {post.author.bio && <AuthorBioPortableText value={post.author.bio} />}
              </div>
            </div>
          </div>
        )}
      </article>
    </Layout>
  )
} 