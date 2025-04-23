'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { urlForImage } from '@/sanity/lib/client'

interface BlogSectionProps {
  posts: unknown[]
}

// Fallback posts if none are available from Sanity
const fallbackPosts = [
  {
    _id: 'fallback-1',
    title: 'The Evolution of Performance Tuning',
    slug: { current: 'evolution-of-performance-tuning' },
    mainImage: null,
    publishedAt: new Date().toISOString(),
    categories: ['Performance', 'Tuning'],
    authorName: 'ASM Performance',
    estimatedReadingTime: 8
  },
  {
    _id: 'fallback-2',
    title: 'Buyer\'s Guide: What to Look for in a Modified Vehicle',
    slug: { current: 'buyers-guide-modified-vehicles' },
    mainImage: null,
    publishedAt: new Date().toISOString(),
    categories: ['Buying Guide', 'Modified Cars'],
    authorName: 'ASM Performance',
    estimatedReadingTime: 6
  },
  {
    _id: 'fallback-3',
    title: 'Maintaining Your Performance Vehicle',
    slug: { current: 'maintaining-performance-vehicles' },
    mainImage: null,
    publishedAt: new Date().toISOString(),
    categories: ['Maintenance', 'Tips'],
    authorName: 'ASM Performance',
    estimatedReadingTime: 5
  }
]

export const BlogSection = ({ posts = [] }: BlogSectionProps) => {
  // Use provided posts or fallback to default posts
  const displayPosts = posts.length > 0 ? posts : fallbackPosts
  
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-red-500 text-red-500 bg-transparent hover:bg-red-950">Latest Insights</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">From Our Blog</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert advice, industry insights, and the latest news from the world of performance and luxury vehicles.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Link href={`/blog/${post.slug.current}`} className="block">
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-[1.02] transition-all duration-300">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-blue-700 dark:from-red-900 dark:to-blue-900"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  
                  {/* Category badge */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white">
                        {post.categories[0]}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.estimatedReadingTime || 5} min read</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 dark:text-white transition-colors duration-200">
                  {post.title}
                </h3>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">By {post.authorName}</span>
                  </div>
                  <span className="text-red-600 dark:text-red-500 group-hover:translate-x-1 transition-transform duration-200">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button 
            asChild
            size="lg" 
            className="rounded-full px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            <Link href="/blog" className="flex items-center gap-2">
              Explore All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 