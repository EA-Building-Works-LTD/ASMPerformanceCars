"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CarFront, Newspaper, CalendarDays, Filter, X, Search, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import Image from 'next/image'

type SearchResultItem = {
  id: string
  type: 'car' | 'post' | 'page'
  title: string
  description?: string
  link: string
  price?: string
  date?: string
  section?: string
  miles?: string
  year?: string
  imageUrl?: string
}

function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResultItem[]>([])
  const [filters, setFilters] = useState({
    cars: true,
    posts: true,
    pages: true,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  // Update search term when query changes
  useEffect(() => {
    setSearchTerm(query)
  }, [query])
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
  }
  
  // Search function using our API
  useEffect(() => {
    if (!query) {
      setResults([])
      setFilteredResults([])
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    
    const performSearch = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        setResults(data.results || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setIsLoading(false)
      }
    }
    
    performSearch()
  }, [query])
  
  // Apply filters when results or filters change
  useEffect(() => {
    setFilteredResults(
      results.filter(result => {
        if (result.type === 'car' && filters.cars) return true
        if (result.type === 'post' && filters.posts) return true
        if (result.type === 'page' && filters.pages) return true
        return false
      })
    )
  }, [results, filters])
  
  // Toggle a filter
  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }))
  }
  
  return (
    <main className="bg-gray-50 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Search form */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search our entire site..."
                  className="pl-10 pr-4 h-12 rounded-full border-gray-200 focus:border-red-500 focus:ring-red-500 w-full"
                />
              </div>
              <Button 
                type="submit"
                className="h-12 px-6 bg-red-600 hover:bg-red-700 rounded-full"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `Search results for "${query}"` : 'Search Results'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLoading 
              ? 'Searching...' 
              : filteredResults.length > 0 
                ? `Found ${filteredResults.length} results`
                : 'No results found'}
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Content Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="filter-cars"
                        checked={filters.cars}
                        onCheckedChange={() => toggleFilter('cars')}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label 
                        htmlFor="filter-cars" 
                        className="ml-2 text-sm text-gray-600"
                      >
                        Vehicles
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="filter-posts"
                        checked={filters.posts}
                        onCheckedChange={() => toggleFilter('posts')}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label 
                        htmlFor="filter-posts" 
                        className="ml-2 text-sm text-gray-600"
                      >
                        Blog Posts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="filter-pages"
                        checked={filters.pages}
                        onCheckedChange={() => toggleFilter('pages')}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label 
                        htmlFor="filter-pages" 
                        className="ml-2 text-sm text-gray-600"
                      >
                        Pages
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full flex items-center justify-center border-gray-200"
            >
              <Filter className="mr-2 h-4 w-4" /> Filter Results
            </Button>
          </div>
          
          {/* Mobile Filters Sidebar */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Content Type</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="mobile-filter-cars"
                            checked={filters.cars}
                            onCheckedChange={() => toggleFilter('cars')}
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label 
                            htmlFor="mobile-filter-cars" 
                            className="ml-2 text-sm text-gray-600"
                          >
                            Vehicles
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="mobile-filter-posts"
                            checked={filters.posts}
                            onCheckedChange={() => toggleFilter('posts')}
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label 
                            htmlFor="mobile-filter-posts" 
                            className="ml-2 text-sm text-gray-600"
                          >
                            Blog Posts
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="mobile-filter-pages"
                            checked={filters.pages}
                            onCheckedChange={() => toggleFilter('pages')}
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label 
                            htmlFor="mobile-filter-pages" 
                            className="ml-2 text-sm text-gray-600"
                          >
                            Pages
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <Button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="animate-spin w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching for "{query}"...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-gray-100">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">No results found</h3>
                <p className="mt-2 text-gray-500">
                  We couldn't find any matches for "{query}".
                </p>
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3">Try:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Using more general keywords</li>
                    <li>• Checking for typos or misspellings</li>
                    <li>• Adjusting the filters</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Link key={result.id} href={result.link}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-48 sm:h-auto relative bg-gray-100 flex items-center justify-center">
                          {result.imageUrl ? (
                            <Image 
                              src={result.imageUrl} 
                              alt={result.title} 
                              fill 
                              className="object-cover"
                            />
                          ) : result.type === 'car' ? (
                            <CarFront className="w-16 h-16 text-gray-400" />
                          ) : result.type === 'post' ? (
                            <Newspaper className="w-16 h-16 text-gray-400" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 text-xl font-bold">{result.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            {result.type === 'car' ? (
                              <span className="flex items-center">
                                <CarFront className="w-3 h-3 mr-1" /> Vehicle
                              </span>
                            ) : result.type === 'post' ? (
                              <span className="flex items-center">
                                <Newspaper className="w-3 h-3 mr-1" /> Blog Post
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" /> {result.section || 'Page'}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                          
                          {result.type === 'car' ? (
                            <div className="mt-auto">
                              <div className="text-red-600 font-semibold text-lg mb-1">{result.price}</div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {result.year && <span>{result.year}</span>}
                                {result.miles && <span>{result.miles}</span>}
                              </div>
                            </div>
                          ) : result.type === 'post' ? (
                            <div className="flex items-center text-sm text-gray-500 mt-auto">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              <time>{result.date}</time>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end text-sm text-gray-500 mt-auto">
                              <span className="text-red-600 hover:underline">View page</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// Export a server component that uses Suspense
import { Suspense } from 'react'

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-28 text-center">Loading search...</div>}>
      <SearchClient />
    </Suspense>
  )
} 