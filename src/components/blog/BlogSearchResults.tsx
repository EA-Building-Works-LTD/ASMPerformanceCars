"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowRight, Clock, Calendar, Search, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { urlForImage } from '@/sanity/lib/client'
import { Badge } from '@/components/ui/badge'

// Type definition for blog post
interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  publishedAt: string
  estimatedReadingTime?: number
  authorName: string
  categories?: string[]
  mainImage?: any
}

interface BlogSearchResultsProps {
  initialQuery: string;
}

export function BlogSearchResults({ initialQuery }: BlogSearchResultsProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(!!initialQuery)
  const [results, setResults] = useState<BlogPost[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    router.push(`/blog/search?q=${encodeURIComponent(searchTerm.trim())}`)
  }
  
  // Search function using our API
  useEffect(() => {
    if (!initialQuery) {
      setResults([])
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setSearchTerm(initialQuery)
    
    const performSearch = async () => {
      try {
        const response = await fetch(`/api/blog-search?q=${encodeURIComponent(initialQuery)}`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        setResults(data.results || [])
        
        // Extract unique categories from results
        const categories = data.results.flatMap((post: BlogPost) => post.categories || [])
        setUniqueCategories([...new Set(categories)] as string[])
        
        setIsLoading(false)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setIsLoading(false)
      }
    }
    
    performSearch()
  }, [initialQuery])
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {initialQuery 
                ? `Search Results for "${initialQuery}"` 
                : 'Blog Search'
              }
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-0">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center overflow-hidden rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1 focus-within:ring-2 focus-within:ring-red-500/50 transition-all shadow-lg">
                  <Search className="ml-3 h-5 w-5 text-white/70" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for articles..."
                    className="bg-transparent border-none shadow-none text-white py-3 focus:ring-0 placeholder:text-white/70"
                  />
                  <Button 
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-zinc-800">Filter Results</h3>
                </div>
                
                {uniqueCategories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {uniqueCategories.map(category => {
                        const categorySlug = category.toLowerCase()
                          .replace(/\s*&\s*/g, '-and-') // Replace & with 'and'
                          .replace(/\s+/g, '-');        // Replace spaces with hyphens
                        return (
                          <Link 
                            key={category}
                            href={`/blog/category/${categorySlug}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-zinc-50 text-zinc-700"
                          >
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-sm">{category}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-red-600 rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-zinc-600">Searching for articles...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold mt-6 mb-2">No articles found</h3>
                  <p className="text-zinc-600 max-w-md mx-auto">
                    {initialQuery 
                      ? `We couldn't find any articles matching your search for "${initialQuery}".`
                      : 'Please enter a search term to find articles.'}
                  </p>
                  {initialQuery && (
                    <div className="mt-8">
                      <p className="text-zinc-600 mb-3">Try:</p>
                      <ul className="space-y-1 text-zinc-600 text-sm max-w-md mx-auto">
                        <li>• Using more general keywords</li>
                        <li>• Checking for typos or misspellings</li>
                        <li>• Searching for a different topic</li>
                      </ul>
                    </div>
                  )}
                  <div className="mt-8">
                    <Link href="/blog">
                      <Button variant="outline" className="rounded-full">
                        Browse All Articles
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-zinc-600">
                        {results.length} {results.length === 1 ? 'result' : 'results'} found
                      </p>
                    </div>
                    
                    <div className="grid gap-6">
                      {results.map((post) => (
                        <Link href={`/blog/${post.slug.current}`} key={post._id}>
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-zinc-100 flex flex-col md:flex-row">
                            {post.mainImage && (
                              <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                                <Image
                                  src={urlForImage(post.mainImage).url()}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="p-6 flex flex-col flex-1">
                              <div className="mb-auto">
                                {post.categories && post.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {post.categories.map(category => (
                                      <Link
                                        key={category}
                                        href={`/blog/category/${category.toLowerCase()
                                          .replace(/\s*&\s*/g, '-and-') // Replace & with 'and'
                                          .replace(/\s+/g, '-')         // Replace spaces with hyphens
                                        }`}
                                      >
                                        <Badge
                                          variant="outline"
                                          className="bg-red-50 border-red-200 text-red-600 text-xs hover:bg-red-100 transition-colors"
                                        >
                                          {category}
                                        </Badge>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                                
                                <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                                  {post.title}
                                </h2>
                                
                                <p className="text-zinc-600 mb-4 line-clamp-2">
                                  {post.excerpt || "Read this article to learn more about performance vehicles and automotive excellence."}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{post.estimatedReadingTime || 5} min read</span>
                                  </div>
                                </div>
                                
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform duration-200">
                                  <ArrowRight className="h-5 w-5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 