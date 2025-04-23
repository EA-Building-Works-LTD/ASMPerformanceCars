'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

interface SEOContentProps {
  route?: string
  title?: string
  content?: unknown[]
}

// Type definitions for Portable Text
type PortableTextChild = {
  _key?: string;
  _type?: string;
  marks?: string[];
  text?: string;
  [key: string]: any;
}

type PortableTextBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: PortableTextChild[];
  markDefs?: unknown[];
  [key: string]: any;
}

type PortableTextComponentProps = {
  children: React.ReactNode;
  value?: any;
  [key: string]: any;
}

const components = {
  block: {
    h1: ({children}: PortableTextComponentProps) => <h1 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">{children}</h1>,
    h2: ({children}: PortableTextComponentProps) => <h2 className="text-xl font-semibold text-gray-200 mt-6 mb-4">{children}</h2>,
    h3: ({children}: PortableTextComponentProps) => <h3 className="text-lg font-semibold text-gray-200 mt-6 mb-3">{children}</h3>,
    normal: ({children}: PortableTextComponentProps) => {
      if (!children || (Array.isArray(children) && children.length === 0)) {
        return null;
      }
      return <p className="text-base text-gray-400 mb-4 leading-relaxed">{children}</p>;
    },
  },
  marks: {
    link: ({value, children}: PortableTextComponentProps) => {
      if (!children || !value?.href) {
        return <span>{children}</span>;
      }
      
      const target = (value.href).startsWith('http') ? '_blank' : undefined
      return (
        <Link 
          href={value.href} 
          target={target}
          className="text-red-400 border-b border-red-400/30 hover:text-red-500 hover:border-red-500 transition-colors"
        >
          {children}
        </Link>
      )
    },
    strong: ({children}: PortableTextComponentProps) => <strong className="font-semibold text-gray-300">{children}</strong>,
    em: ({children}: PortableTextComponentProps) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({children}: PortableTextComponentProps) => <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>,
    number: ({children}: PortableTextComponentProps) => <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}: PortableTextComponentProps) => <li className="text-gray-400 pb-1">{children}</li>,
    number: ({children}: PortableTextComponentProps) => <li className="text-gray-400 pb-1">{children}</li>,
  },
}

export const SEOContent = ({ route, title, content }: SEOContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const currentRoute = route || pathname

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const isHomePage = currentRoute === '/'
  const isModifiedPage = currentRoute.includes('/our-cars/modified-cars-for-sale')

  const sectionTitle = title || (isModifiedPage ? 'Discover More About Our Modified Cars' : 'Learn about Modified Cars For Sale')

  // If no content is provided, don't render the component
  if (!content || !Array.isArray(content) || content.length === 0) return null

  // Make sure the content is properly formatted for PortableText
  const validContent = content.filter(block => 
    block && typeof block === 'object' && (block._type === 'block' || block.children)
  )

  if (validContent.length === 0) return null

  return (
    <section className="py-4 bg-black border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <button 
          onClick={toggleExpand}
          className="w-full flex items-center justify-between text-left group focus:outline-none"
          aria-expanded={isExpanded}
        >
          <h2 className="text-base font-medium text-gray-400 group-hover:text-red-500 transition-colors">
            {sectionTitle}
          </h2>
          <div className="rounded-full p-1 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-red-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-red-500" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-3"
            >
              <div className="space-y-2">
                <PortableText 
                  value={validContent}
                  components={components}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 