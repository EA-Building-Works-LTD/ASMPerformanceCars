import React, { Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { getLatestPosts } from '@/sanity/lib/client'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import {
  ArrowRight,
  Clock,
  Calendar,
  Search,
  ChevronRight,
  Filter,
  TrendingUp,
  Bookmark,
  Star,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { urlForImage } from '@/sanity/lib/client'
import { BlogSearchForm } from '@/components/blog/BlogSearchForm'
import { BlogContent } from '@/components/blog/BlogContent'
import { NewsletterForm } from '@/components/blog/NewsletterForm'
import { Metadata } from 'next'
import { addCanonicalUrl } from '@/components/shared/CanonicalUrl'

// Define the post type based on the structure expected
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage?: any;
  publishedAt: string;
  estimatedReadingTime?: number;
  authorName: string;
  categories?: string[];
  excerpt?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata: Metadata = {
    title: 'Performance Car Blog | ASM Performance Cars',
    description: 'Expert advice, industry insights, and the latest news from the world of performance and luxury vehicles.'
  }
  
  return addCanonicalUrl(baseMetadata, '/blog')
}

function ClientBlogContent({ posts, featuredPost, secondaryFeatured, allPosts }: { 
  posts: BlogPost[], 
  featuredPost: BlogPost | null, 
  secondaryFeatured: BlogPost[],
  allPosts: BlogPost[] 
}) {
  return (
    <>
      {featuredPost && (
        <section className="py-20 bg-white relative">
          <div className="container mx-auto px-4">
            {/* Section Heading with Category Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1.5 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Featured Articles
                </h2>
              </div>
            </div>

            {/* Featured Post Layout - Improved to better utilize whitespace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              {/* Main Featured Post - 7 columns, full height design */}
              <div className="lg:col-span-7 group">
                <Link
                  href={`/blog/${featuredPost.slug.current}`}
                  className="block h-full"
                >
                  <div className="relative h-full bg-gradient-to-br from-zinc-50 to-white rounded-3xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-zinc-200 overflow-hidden group-hover:border-red-100">
                    {/* Absolute positioned large image */}
                    <div className="relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden group-hover:shadow-2xl mb-6">
                      <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-4 py-1.5 shadow-lg">
                        Featured
                      </Badge>

                      {featuredPost.mainImage ? (
                        <Image
                          src={urlForImage(featuredPost.mainImage).url()}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                    </div>

                    {/* Content section */}
                    <div className="flex flex-col h-[calc(100%-350px-24px)] justify-between">
                      <div>
                        {featuredPost.categories &&
                          featuredPost.categories.length > 0 && (
                            <Badge
                              variant="outline"
                              className="border-red-200 text-red-600 bg-red-50 mb-3"
                            >
                              {featuredPost.categories[0]}
                            </Badge>
                          )}

                        <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                          {featuredPost.title}
                        </h3>

                        <p className="text-zinc-600 mb-2 line-clamp-3">
                          {featuredPost.excerpt ||
                            "Discover the latest insights, tips, and trends in the world of performance and modified vehicles."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-zinc-300 overflow-hidden flex items-center justify-center text-xs font-bold text-zinc-800">
                                {featuredPost.authorName.charAt(0)}
                              </div>
                              <span className="text-sm font-medium">
                                By {featuredPost.authorName}
                              </span>
                            </div>
                            <div className="hidden md:flex items-center gap-1 text-xs text-zinc-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(
                                  new Date(featuredPost.publishedAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                          >
                            Read Article <ArrowRight className="ml-1 w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary Featured Posts & Trending - 5 columns */}
              <div className="lg:col-span-5 grid gap-6">
                {/* Quick Reads section - replacing trending topics */}
                <div className="bg-gradient-to-br from-zinc-50 to-white border border-zinc-200 p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-600 rounded-full">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-lg">Quick Reads</h4>
                  </div>

                  <div className="grid gap-4">
                    {/* Get all posts with shortest reading time, regardless of featured status */}
                    {posts
                      .sort((a: BlogPost, b: BlogPost) => {
                        // Use the same WordPress standard reading time calculation (275 wpm)
                        const getAdjustedReadingTime = (post: BlogPost) => {
                          // Special cases for blogs with known reading times
                          if (post.title?.toLowerCase().includes('car finance uk')) {
                            return 10;
                          }
                          
                          // For specific articles we want to prioritize in Quick Reads
                          if (post.title?.toLowerCase().includes('cat s cars explained')) {
                            return 6; // Ensure this appears with its correct time
                          }
                          
                          // For all other posts, use the WordPress standard (275 wpm)
                          const rawTime = post.estimatedReadingTime || 5;
                          const wordPressTime = Math.round(rawTime * 0.65);
                          return Math.min(Math.max(wordPressTime, 2), 15);
                        };
                        
                        return getAdjustedReadingTime(a) - getAdjustedReadingTime(b);
                      })
                      .slice(0, 3)
                      .map((post: BlogPost) => (
                        <Link
                          key={post._id}
                          href={`/blog/${post.slug.current}`}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 transition-colors"
                        >
                          <div className="relative min-w-[70px] h-[70px] rounded-lg overflow-hidden">
                            {post.mainImage ? (
                              <Image
                                src={urlForImage(post.mainImage).url()}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm line-clamp-2 mb-1">
                              {post.title}
                            </h5>
                            <div className="flex items-center text-zinc-500 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>
                                {post.estimatedReadingTime
                                  ? `${post.estimatedReadingTime} min read`
                                  : "Quick read"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Secondary Featured Posts */}
                {secondaryFeatured.map((post: BlogPost) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group bg-gradient-to-br from-zinc-50 to-white rounded-2xl p-4 hover:shadow-lg transition-all border border-zinc-200 flex flex-col overflow-hidden"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        {post.mainImage ? (
                          <Image
                            src={urlForImage(post.mainImage).url()}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-xs text-zinc-500 gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(
                                new Date(post.publishedAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {post.estimatedReadingTime
                                ? `${post.estimatedReadingTime} min`
                                : "5 min"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Content Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
            </div>
          </div>

          {/* Main content area with posts */}
          <BlogContent regularPosts={allPosts} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Stay Updated With Our Newsletter
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Subscribe to receive the latest news, expert advice, and
                exclusive offers on performance and luxury vehicles.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default async function BlogPage() {
  // Fetch all blog posts - using a large limit to ensure we get everything
  const posts = await getLatestPosts(100) // Get more posts for the blog page
  
  // If we have posts, split them for featured and regular sections
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const secondaryFeatured = posts.length > 2 ? [posts[1], posts[2]] : [];
  
  // Pass ALL posts to the BlogContent component for display in Latest Articles
  // This ensures all published blogs are shown, not just those after the featured ones
  const allPosts = posts;
  
  return (
    <Layout>
      {/* Hero Section with Glass Morphism */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-800 pt-24 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-red-500 animate-pulse">●</span>
              <span className="text-white text-sm font-medium">Performance Car Insights</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              <span className="inline-block">The ASM </span>
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Performance Blog</span>
            </h1>
            
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-10">
              Expert advice, industry insights, and the latest news from the world of 
              performance and luxury vehicles.
            </p>
            
            {/* Search Bar - Client Component */}
            <div className="relative w-full max-w-xl mb-8">
              <BlogSearchForm />
            </div>
            
            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="text-white/50 text-sm">Popular:</span>
              <Link href="/blog/search?q=performance+upgrades" className="text-white/80 hover:text-white text-sm hover:underline transition-colors">Performance Upgrades</Link>
              <span className="text-white/30">•</span>
              <Link href="/blog/search?q=modified+cars" className="text-white/80 hover:text-white text-sm hover:underline transition-colors">Modified Cars</Link>
              <span className="text-white/30">•</span>
              <Link href="/blog/search?q=luxury+vehicles" className="text-white/80 hover:text-white text-sm hover:underline transition-colors">Luxury Vehicles</Link>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full h-auto"
          >
            <path
              fill="#000000"
              fillOpacity="0.07"
              d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,202.7C1120,203,1280,181,1360,170.7L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
        </div>
      </section>

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading blog content...</p>
        </div>
      }>
        <ClientBlogContent 
          posts={posts} 
          featuredPost={featuredPost} 
          secondaryFeatured={secondaryFeatured} 
          allPosts={allPosts} 
        />
      </Suspense>
    </Layout>
  )
} 
