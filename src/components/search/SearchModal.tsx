"use client"

import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { X, Search, Car, Newspaper, ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'

// Type-safe motion components
type MotionDivProps = HTMLMotionProps<"div"> & React.HTMLAttributes<HTMLDivElement>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

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

// Enhanced search modal with better keyboard navigation
export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [focusedResultIndex, setFocusedResultIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])
  
  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
      
      // Reset search when modal opens
      setSearchTerm('')
      setResults([])
      setFocusedResultIndex(-1)
    }
  }, [isOpen])
  
  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusedResultIndex(prev => {
            const nextIndex = Math.min(prev + 1, results.length - 1)
            resultRefs.current[nextIndex]?.focus()
            return nextIndex
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedResultIndex(prev => {
            // If we're at the first result, move focus back to the search input
            if (prev === 0) {
              inputRef.current?.focus()
              return -1
            }
            // Otherwise move to the previous result
            const nextIndex = Math.max(prev - 1, 0)
            resultRefs.current[nextIndex]?.focus()
            return nextIndex
          })
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, results.length])
  
  // Reset result refs when results change
  useEffect(() => {
    resultRefs.current = resultRefs.current.slice(0, results.length)
  }, [results])
  
  // Perform site-wide search using our API
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      
      // Only show top 5 results in modal
      setResults(data.results?.slice(0, 5) || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Debounced search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm)
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with improved aria markup */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            onClick={onClose} 
            role="presentation"
          >
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            />
          </div>
          
          {/* Modal with proper ARIA attributes */}
          <div 
            className="fixed top-24 inset-x-0 mx-auto z-50 w-full max-w-3xl" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="search-modal-title"
          >
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full h-full"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden mx-4">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-100 flex items-center">
                  <h2 id="search-modal-title" className="sr-only">Search</h2>
                  <div className="relative flex-1 mx-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" aria-hidden="true" />
                    <Input
                      type="text"
                      ref={inputRef}
                      placeholder="What would you like to search?"
                      className="pl-10 pr-4 h-12 rounded-full border-gray-200 focus:border-red-500 focus:ring-red-500 w-full text-base"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setFocusedResultIndex(-1)
                      }}
                      aria-label="Search"
                      aria-autocomplete="list"
                      aria-controls="search-results"
                      aria-expanded={results.length > 0}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="ml-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
                  </Button>
                </div>
                
                {/* Search Results */}
                <div 
                  className="max-h-[60vh] overflow-y-auto" 
                  id="search-results"
                  ref={resultsRef}
                  role={results.length > 0 ? "listbox" : undefined}
                  aria-label="Search results"
                >
                  {isLoading ? (
                    <div className="py-8 text-center" aria-live="polite">
                      <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto" aria-hidden="true"></div>
                      <p className="text-gray-600 mt-3">Searching...</p>
                    </div>
                  ) : searchTerm && results.length === 0 ? (
                    <div className="py-10 text-center" aria-live="polite">
                      <p className="text-gray-600">No results found for "{searchTerm}"</p>
                      <p className="text-gray-500 text-sm mt-1">Try different keywords or browse our categories</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {results.map((result, index) => (
                        <Link 
                          key={result.id} 
                          href={result.link} 
                          onClick={onClose}
                          ref={(el) => { resultRefs.current[index] = el }}
                          className={`p-4 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center block ${
                            focusedResultIndex === index ? 'bg-gray-50' : ''
                          }`}
                          role="option"
                          aria-selected={focusedResultIndex === index}
                          tabIndex={0}
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {result.imageUrl ? (
                              <Image 
                                src={result.imageUrl} 
                                alt=""
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : result.type === 'car' ? (
                              <Car className="w-8 h-8 text-gray-600" aria-hidden="true" />
                            ) : result.type === 'post' ? (
                              <Newspaper className="w-8 h-8 text-gray-600" aria-hidden="true" />
                            ) : (
                              <FileText className="w-8 h-8 text-gray-600" aria-hidden="true" />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              {result.type === 'car' ? (
                                <><Car className="w-3 h-3 mr-1" aria-hidden="true" /> Vehicle</>
                              ) : result.type === 'post' ? (
                                <><Newspaper className="w-3 h-3 mr-1" aria-hidden="true" /> Blog Post</>
                              ) : (
                                <><FileText className="w-3 h-3 mr-1" aria-hidden="true" /> {result.section || 'Page'}</>
                              )}
                            </div>
                            <h4 className="font-medium text-gray-900">{result.title}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {result.type === 'car' ? result.price : result.type === 'post' ? result.date : ''}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  ) : searchTerm && (
                    <div className="py-6 px-4" aria-live="polite">
                      <p className="text-gray-600 text-center">Type to search for vehicles, blog posts, and more</p>
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                {results.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <Link 
                      href={`/search?q=${encodeURIComponent(searchTerm)}`} 
                      onClick={onClose}
                      className="focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded-full block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
                      >
                        View all results
                        <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </MotionDiv>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 