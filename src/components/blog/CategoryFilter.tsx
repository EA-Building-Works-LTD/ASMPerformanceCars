"use client"

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tag } from 'lucide-react'
import { BlogPost } from './BlogContent'

interface CategoryFilterProps {
  categories: string[]
  posts: BlogPost[]
  onFilterChange: (filteredPosts: BlogPost[]) => void
}

export function CategoryFilter({ categories, posts, onFilterChange }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-zinc-500 mr-2">
        <Tag className="w-4 h-4" />
        <span className="font-medium">Categories:</span>
      </div>
      
      {categories.map((category) => {
        // Create slugified version of the category for URL
        const categorySlug = category.toLowerCase()
          .replace(/\s*&\s*/g, '-and-') // Replace & with 'and'
          .replace(/\s+/g, '-')         // Replace spaces with hyphens
        
        return (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className="rounded-full border-zinc-300 hover:border-red-500 hover:text-red-600 transition-colors duration-200"
            asChild
          >
            <Link href={`/blog/category/${categorySlug}`}>
              {category}
            </Link>
          </Button>
        )
      })}
    </div>
  )
} 