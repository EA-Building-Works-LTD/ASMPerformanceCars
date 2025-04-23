"use client"

import React, { useState, useEffect, Suspense } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import FAQSearch from '@/components/faq/FAQSearch'
import FAQCategories from '@/components/faq/FAQCategories'
import FAQSearchResults from '@/components/faq/FAQSearchResults'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchFaqs, FAQItem } from '@/lib/algolia-search'

function FAQContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '')
  const [searchResults, setSearchResults] = useState<FAQItem[]>([])
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Handle search functionality
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    setIsSearching(true)
    
    if (term) {
      // Update URL with search query
      router.push(`/faqs?q=${encodeURIComponent(term)}`)
      
      try {
        // Search using Algolia
        const results = await searchFaqs(term)
        setSearchResults(results)
      } catch (error) {
        console.error('Error searching FAQs:', error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
    }
    
    setIsSearching(false)
  }

  // Handle FAQ toggle
  const handleToggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  // Perform initial search if query parameter exists
  useEffect(() => {
    const query = searchParams?.get('q')
    if (query) {
      handleSearch(query)
    }
  }, [searchParams])

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Frequently Asked Questions" 
        subtitle="Find answers to your questions about modified cars, vehicle ownership, and more"
        backgroundImage="/images/car-faq-hero.jpg"
      />
      
      {/* Search Section */}
      <FAQSearch onSearch={handleSearch} />
      
      {/* Search Results */}
      {searchTerm && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Search Results for "{searchTerm}"
              </h2>
              <p className="text-gray-600">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                  : 'No results found'}
              </p>
            </div>
            
            <FAQSearchResults 
              results={searchResults}
              openFAQ={openFAQ}
              onToggleFAQ={handleToggleFAQ}
            />
          </div>
        </section>
      )}
      
      {/* Categories Section - Always show */}
      <FAQCategories />
      
      {/* SEO Section - hidden visually but good for search engines */}
      <section className="sr-only">
        <h2>Car FAQ Resources</h2>
        <p>
          Welcome to ASM Performance Cars' comprehensive FAQ section. Here you'll find answers
          to common questions about buying and selling vehicles, car insurance, electric and hybrid
          cars, vehicle modifications, and used car purchasing.
        </p>
        <p>
          Our FAQ resources have been compiled by automotive experts to provide you with
          accurate, up-to-date information on all aspects of vehicle ownership. Whether you're
          looking to understand the implications of modifying your car, what to look for when
          buying a used vehicle, or how to secure the best insurance coverage, we've got you covered.
        </p>
        <p>
          If you can't find the answer you're looking for, please don't hesitate to contact our
          team directly. We're always happy to provide personalised advice and support to our
          customers throughout their automotive journey.
        </p>
      </section>
    </>
  )
}

export default function FAQPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading FAQs...</p>
      </div>
    }>
      <FAQContent />
    </Suspense>
  )
} 