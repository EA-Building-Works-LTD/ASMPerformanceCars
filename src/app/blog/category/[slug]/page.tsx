import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/client'
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Layout } from '@/components/layout/Layout'
import { addCanonicalUrl } from '@/components/shared/CanonicalUrl'

// Define the post type
interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage?: any
  publishedAt: string
  estimatedReadingTime?: number
  authorName: string
  categories?: string[]
  excerpt?: string
}

// For the category metadata
interface Category {
  title: string
  description?: string
  slug: {
    current: string
  }
}

// Get all categories for static path generation
export async function generateStaticParams() {
  const categories = await client.fetch(`
    *[_type == "category"] {
      "slug": slug.current
    }
  `)
  
  return categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }))
}

// Fetch the category data
async function getCategory(slug: string) {
  return client.fetch(`
    *[_type == "category" && slug.current == $slug][0] {
      title,
      description,
      "slug": slug.current
    }
  `, { slug })
}

// Fetch posts for a specific category
async function getCategoryPosts(categoryTitle: string) {
  return client.fetch(`
    *[_type == "post" && $categoryTitle in categories[]->title] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      "categories": categories[]->title,
      "authorName": author->name,
      excerpt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }
  `, { categoryTitle })
}

// Generate metadata for the category page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategory(params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    }
  }
  
  const baseMetadata: Metadata = {
    title: `${category.title} Articles | ASM Performance Cars Blog`,
    description: category.description || `Read all articles about ${category.title} from ASM Performance Cars.`,
    openGraph: {
      title: `${category.title} Articles | ASM Performance Cars Blog`,
      description: category.description || `Read all articles about ${category.title} from ASM Performance Cars.`,
      url: `https://asmperformancecars.co.uk/blog/category/${params.slug}`,
      siteName: 'ASM Performance Cars',
      locale: 'en_GB',
      type: 'website',
    },
  }
  
  // Add canonical URL to the metadata
  return addCanonicalUrl(baseMetadata, `/blog/category/${params.slug}`);
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    notFound()
  }
  
  const posts = await getCategoryPosts(category.title)
  
  // Adjust reading time calculation using the same formula as main blog page
  const getAdjustedReadingTime = (post: BlogPost) => {
    // Special cases for blogs with known reading times
    if (post.title?.toLowerCase().includes('car finance uk')) {
      return '10 min read';
    }
    
    // Special case for Cat S Cars article
    if (post.title?.toLowerCase().includes('cat s cars explained')) {
      return '6 min read';
    }
    
    // For all other posts, use the WordPress standard (275 wpm)
    const rawTime = post.estimatedReadingTime || 5;
    const wordPressTime = Math.round(rawTime * 0.65);
    const cappedTime = Math.min(Math.max(wordPressTime, 2), 15);
    return `${cappedTime} min read`;
  };
  
  return (
    <Layout>
      {/* Hero Section with Category Title */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-800 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center text-center">
            <Button 
              variant="ghost" 
              asChild 
              className="text-zinc-400 hover:text-white mb-8 transition-colors self-start"
            >
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Tag className="w-4 h-4 text-red-500" />
              <span className="text-white text-sm font-medium">Category</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              {category.title}
            </h1>
            
            {category.description && (
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-6">
                {category.description}
              </p>
            )}
            
            <Badge className="bg-red-600 text-white">
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold">
                All {category.title} Articles
              </h2>
            </div>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-zinc-500">No articles found in this category.</p>
              <Button asChild className="mt-4 bg-red-600 hover:bg-red-700">
                <Link href="/blog">Browse All Articles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: BlogPost) => (
                <div
                  key={post._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100"
                >
                  <Link href={`/blog/${post.slug.current}`}>
                    <div className="relative h-56 overflow-hidden">
                      {post.mainImage ? (
                        <Image
                          src={urlForImage(post.mainImage).url()}
                          alt={post.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-400 to-zinc-600"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      
                      {/* Category badges */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                            {post.categories[0]}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-zinc-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getAdjustedReadingTime(post)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-zinc-600 mb-4 line-clamp-3">
                        {post.excerpt || "Read this article to learn more about performance vehicles."}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-800">
                            {post.authorName?.charAt(0) || 'A'}
                          </div>
                          <span className="text-sm">By {post.authorName}</span>
                        </div>
                        
                        <span className="text-red-600 text-sm font-medium flex items-center">
                          Read Article <ArrowRight className="ml-1 w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
} 