"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BlogSearchForm() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }
  
  return (
    <form onSubmit={handleSearch}>
      <div className="relative flex items-center overflow-hidden rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1 focus-within:ring-2 focus-within:ring-red-500/50 transition-all shadow-xl">
        <Search className="ml-3 h-5 w-5 text-white/70" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for articles..."
          className="w-full bg-transparent py-3 px-3 text-white placeholder:text-white/70 focus:outline-none"
        />
        <Button 
          type="submit"
          variant="default" 
          className="rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
        >
          Search
        </Button>
      </div>
    </form>
  )
} 