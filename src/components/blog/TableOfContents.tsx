'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, List } from 'lucide-react'

interface TableOfContentsProps {
  content: any[]
}

// Create a normalized ID from text - MUST match the blog page implementation
function createHeadingId(text: string): string {
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // Remove special chars
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
  
  // Special case for problematic headings (optional)
  // If you know specific headings that cause issues, you can handle them here
  const specialCases: Record<string, string> = {
    'car insurance writeoff categories and their impact on resale value': 
      'car-insurance-writeoff-categories',
    // Add more special cases as needed
  };
  
  return specialCases[id] || id;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<{id: string, text: string}[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const headingElementsRef = useRef<Map<string, HTMLElement>>(new Map())

  // Scan for headings on the page
  useEffect(() => {
    const allPageHeadings = document.querySelectorAll('h2[id]')
    const headingMap = new Map<string, HTMLElement>()
    
    allPageHeadings.forEach((el) => {
      headingMap.set(el.id, el as HTMLElement)
    })
    
    headingElementsRef.current = headingMap
  }, [])

  // Extract headings from content
  useEffect(() => {
    if (!content || !Array.isArray(content)) return
    
    // Get all blocks that look like headings
    const h2Blocks = content.filter(block => 
      block._type === 'block' && 
      (block.style === 'h2' || block.style === 'heading' || block.style === 'heading-two')
    )
    
    if (h2Blocks.length === 0) return
    
    const extractedHeadings = h2Blocks.map(heading => {
      // Create slug from heading text
      let text = ''
      
      try {
        if (heading.children && Array.isArray(heading.children)) {
          text = heading.children
            .map((child: any) => child.text || '')
            .join('')
        } else {
          text = String(heading.children || '')
        }
      } catch (err) {
        text = "Untitled section"
      }
      
      // Standardize ID generation
      const id = createHeadingId(text)
      
      return { id, text }
    })
    
    if (extractedHeadings.length > 0) {
      setHeadings(extractedHeadings)
    }
  }, [content])

  // Set up scroll spy for active heading
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      // Find the section that is currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const id = headings[i].id
        const element = document.getElementById(id) || headingElementsRef.current.get(id)
        
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(id)
          break
        }
      }
    }

    // Initial check
    handleScroll()
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headings])

  // Handle smooth scrolling with offset
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    
    // Close mobile menu if open
    if (isOpen) setIsOpen(false)
    
    try {
      // Try to find the element using different strategies
      let element = document.getElementById(id)
      
      // If direct ID not found, use the cached map
      if (!element) {
        element = headingElementsRef.current.get(id) || null
      }
      
      // If still not found, try text-based matching
      if (!element) {
        // Get heading text for the missing id
        const headingText = headings.find(h => h.id === id)?.text || "unknown"
        
        // Try to find by heading text content
        const headingElements = Array.from(document.querySelectorAll('h2'))
        const matchingHeading = headingElements.find(el => 
          el.textContent?.trim() === headingText.trim() ||
          el.textContent?.includes(headingText)
        )
        
        if (matchingHeading) {
          element = matchingHeading as HTMLElement
        }
        
        if (!element) return
      }
      
      // Calculate offset (accounting for fixed header if present)
      const headerOffset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      
      // Scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update URL without jumping
      history.pushState(null, '', `#${element.id}`)
      
      // Set active ID to the actual element ID (which might differ from the ToC ID)
      setActiveId(element.id)
    } catch (error) {
      // Silent error handling
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Mobile version - dropdown */}
      <div className="md:hidden sticky top-4 z-30 mb-6">
        <div 
          className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-3"
        >
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-red-600" />
              <span className="font-medium">In this article</span>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 transition-transform", 
              isOpen ? "transform rotate-180" : ""
            )} />
          </div>
          
          {isOpen && (
            <ul className="mt-3 space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              {headings.map(heading => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={cn(
                      "block py-1 px-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors",
                      activeId === heading.id ? "text-red-600 font-medium" : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={(e) => handleLinkClick(e, heading.id)}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Desktop version - sidebar */}
      <div className="hidden md:block" style={{ position: 'sticky', top: '80px' }}>
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-800 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <List className="w-4 h-4 text-red-600" />
            <span>In this article</span>
          </h3>
          <ul className="space-y-2">
            {headings.map(heading => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block py-1.5 border-l-2 pl-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors",
                    activeId === heading.id 
                      ? "border-red-600 text-red-600 font-medium" 
                      : "border-transparent text-gray-700 dark:text-gray-300"
                  )}
                  onClick={(e) => handleLinkClick(e, heading.id)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
} 