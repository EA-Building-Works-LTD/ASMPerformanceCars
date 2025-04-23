"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { urlForImage } from '@/sanity/lib/client'
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  ChevronDown,
  Bookmark,
  Tag,
  Loader2,
  Heart,
  Star,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the blog post interface
export interface BlogPost {
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

interface BlogContentProps {
  regularPosts: BlogPost[];
}

// Sort options
type SortOption = "recent" | "popular" | "helpful";

export function BlogContent({ regularPosts }: BlogContentProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(regularPosts)
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const initialPostsCount = 6  // Show 6 posts initially
  const postsPerPage = 3       // Load 3 more posts at a time
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract all unique categories from posts
  const allCategories = Array.from(
    new Set(
      regularPosts
        .flatMap(post => post.categories || [])
        .filter(Boolean)
    )
  )
  
  useEffect(() => {
    console.log(`Total posts received: ${regularPosts.length}`);
  }, [regularPosts]);
  
  // Sort the filtered posts based on the selected sort option
  const sortPosts = (posts: BlogPost[], sortOption: SortOption) => {
    switch (sortOption) {
      case "recent":
        // Sort by publish date (newest first)
        return [...posts].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case "popular":
        // For "popular", we'll combine different factors:
        // 1. Posts with the most common categories (proxy for popularity)
        // 2. Then by publish date as a tiebreaker
        const categoryFrequency: Record<string, number> = {};
        
        // Count frequency of each category across all posts
        regularPosts.forEach(post => {
          post.categories?.forEach(category => {
            categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
          });
        });
        
        return [...posts].sort((a, b) => {
          // Calculate "popularity score" based on category frequency
          const aScore = a.categories?.reduce((sum, category) => sum + (categoryFrequency[category] || 0), 0) || 0;
          const bScore = b.categories?.reduce((sum, category) => sum + (categoryFrequency[category] || 0), 0) || 0;
          
          if (bScore !== aScore) {
            return bScore - aScore; // Higher score first
          }
          
          // Tiebreaker: newer posts first
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      case "helpful":
        // For "helpful", we'll use reading time as a proxy for depth/helpfulness
        // Longer articles first, then by recency as tiebreaker
        return [...posts].sort((a, b) => {
          // Get adjusted reading times that match what we display
          const getAdjustedReadingTime = (post: BlogPost) => {
            // Special cases for blogs with known reading times
            if (post.title?.toLowerCase().includes('car finance uk')) {
              return 10;
            }
            
            // Special case for Cat S Cars article
            if (post.title?.toLowerCase().includes('cat s cars explained')) {
              return 6;
            }
            
            // For all other posts, use the WordPress standard (275 wpm)
            // Original calculation likely used ~180 wpm, so we adjust by multiply by ~0.65
            const rawTime = post.estimatedReadingTime || 5;
            const wordPressTime = Math.round(rawTime * 0.65);
            return Math.min(Math.max(wordPressTime, 2), 15);
          };
          
          const aTime = getAdjustedReadingTime(a);
          const bTime = getAdjustedReadingTime(b);
          
          if (bTime !== aTime) {
            return bTime - aTime; // Longer read time first
          }
          
          // Tiebreaker: newer posts first
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      default:
        return posts;
    }
  };
  
  // Apply sorting and update state when sort option changes
  useEffect(() => {
    const sortedPosts = sortPosts(filteredPosts, sortBy);
    setFilteredPosts(sortedPosts);
    
    // Update URL with sort parameter, but don't scroll
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortBy === "recent") {
      // Remove sort param for default "recent" sort to keep URLs clean
      params.delete('sort');
    } else {
      params.set('sort', sortBy);
    }
    
    router.push(`/blog?${params.toString()}`, { scroll: false });
  }, [sortBy]);
  
  // Check for sort option in URL on initial load
  useEffect(() => {
    const sortParam = searchParams.get('sort') as SortOption | null;
    if (sortParam && ['recent', 'popular', 'helpful'].includes(sortParam)) {
      setSortBy(sortParam);
    }
  }, []);
  
  // Update displayed posts when filtered posts change
  useEffect(() => {
    // Reset pagination when filter changes
    setPage(1)
    // Show initial batch of posts
    setDisplayedPosts(filteredPosts.slice(0, initialPostsCount))
    // Update hasMore flag
    setHasMore(filteredPosts.length > initialPostsCount)
  }, [filteredPosts])
  
  // Check for category in URL on initial load and filter posts
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    
    if (categoryParam) {
      // Get posts with matching category
      const filtered = regularPosts.filter(post => 
        post.categories?.includes(categoryParam)
      )
      // Apply current sort
      const sortedAndFiltered = sortPosts(filtered, sortBy)
      setFilteredPosts(sortedAndFiltered)
    } else {
      // Apply current sort to all posts
      const sorted = sortPosts(regularPosts, sortBy)
      setFilteredPosts(sorted)
    }
  }, [regularPosts, searchParams, sortBy])
  
  // Handle filter change from CategoryFilter component
  const handleFilterChange = (filteredResults: BlogPost[]) => {
    const sortedResults = sortPosts(filteredResults, sortBy)
    setFilteredPosts(sortedResults)
  }
  
  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
  }
  
  // Load more posts
  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    
    try {
      // Calculate next batch of posts
      const nextPostsCount = initialPostsCount + (page * postsPerPage)
      const nextPosts = filteredPosts.slice(0, nextPostsCount)
      
      setDisplayedPosts(nextPosts)
      setPage(prevPage => prevPage + 1)
      setHasMore(nextPosts.length < filteredPosts.length)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get label for the current sort option
  const getSortLabel = () => {
    switch (sortBy) {
      case 'recent': return 'Most Recent';
      case 'popular': return 'Most Popular';
      case 'helpful': return 'Most Helpful';
      default: return 'Sort By';
    }
  }
  
  // Get icon for the current sort option
  const getSortIcon = () => {
    switch (sortBy) {
      case 'recent': return <Calendar className="w-4 h-4 mr-1.5" />;
      case 'popular': return <Heart className="w-4 h-4 mr-1.5" />;
      case 'helpful': return <Star className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  }
  
  // Reset sorting to default
  const resetSorting = () => {
    setSortBy("recent");
  };
  
  return (
    <section className="py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold">All Articles</h2>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-zinc-300 hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    {getSortIcon()}
                    {getSortLabel()}
                    <ChevronDown className="w-4 h-4 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => handleSortChange('recent')}
                    className={sortBy === 'recent' ? "bg-red-50 text-red-600" : ""}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Most Recent</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleSortChange('popular')}
                    className={sortBy === 'popular' ? "bg-red-50 text-red-600" : ""}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Most Popular</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleSortChange('helpful')}
                    className={sortBy === 'helpful' ? "bg-red-50 text-red-600" : ""}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    <span>Most Helpful</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Only show reset button when not using default sort (recent) */}
              {sortBy !== 'recent' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSorting}
                  className="rounded-full text-zinc-500 hover:text-red-600 h-9"
                  title="Reset to default sorting"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Categories Filter using CategoryFilter component */}
          <div className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
            <CategoryFilter 
              categories={allCategories} 
              onFilterChange={handleFilterChange}
              posts={regularPosts} 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post: BlogPost) => (
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

                  {/* Save button */}
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors">
                    <Bookmark className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Category badge */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <Badge 
                        className="bg-white/20 backdrop-blur-sm text-white border-0 cursor-pointer hover:opacity-90"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const category = post.categories?.[0]?.toLowerCase()
                            .replace(/\s*&\s*/g, '-and-') // Replace & with 'and'
                            .replace(/\s+/g, '-');        // Replace spaces with hyphens
                          router.push(`/blog/category/${category}`);
                        }}
                      >
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
                    <span>
                      {(() => {
                        // Use the WordPress standard of 275 words per minute (middle of 250-300 range)
                        
                        // Special cases for blogs with known reading times
                        if (post.title?.toLowerCase().includes('car finance uk')) {
                          return '10 min read';
                        }
                        
                        // Special case for Cat S Cars article
                        if (post.title?.toLowerCase().includes('cat s cars explained')) {
                          return '6 min read';
                        }
                        
                        // For all other posts, use the WordPress standard (275 wpm)
                        // Original calculation likely used ~180 wpm, so we adjust by multiply by ~0.65
                        const rawTime = post.estimatedReadingTime || 5;
                        const wordPressTime = Math.round(rawTime * 0.65);
                        const cappedTime = Math.min(Math.max(wordPressTime, 2), 15);
                        return `${cappedTime} min read`;
                      })()}
                    </span>
                  </div>
                </div>
                
                    <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                
                    <p className="text-zinc-600 mb-4 line-clamp-2">
                      {post.excerpt ||
                        "Discover insights and tips about performance vehicles, modifications, and automotive excellence."}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-500">
                        By {post.authorName}
                      </span>
                      <span className="text-red-600 group-hover:translate-x-1 transition-transform duration-200">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                    </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">
                No articles found in this category
              </h3>
              <p className="text-zinc-600 mb-8">
                Try selecting a different category or check back later!
              </p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-300 hover:border-red-600 hover:text-red-600 transition-colors"
              onClick={loadMorePosts}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Articles'
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
} 