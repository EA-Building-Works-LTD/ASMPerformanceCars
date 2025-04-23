'use client'

import Image from 'next/image'
import { PortableTextReactComponents } from '@portabletext/react'
import dynamic from 'next/dynamic'

// Dynamically import the TableComponent to avoid SSR issues with client components
const TableComponent = dynamic(() => import('@/components/blog/TableComponent'), {
  ssr: false,
  loading: () => <div className="my-8 p-4 bg-gray-100 dark:bg-zinc-800 rounded">Loading table...</div>
})

export const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      
      const imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
      
      return (
        <div className="my-8 relative w-full h-64 md:h-96">
          <Image 
            src={imageUrl} 
            alt={value.alt || ''} 
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )
    },
    table: ({ value }) => {
      return <TableComponent value={value} />
    }
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href || '#'} 
          target={target}
          rel={rel}
          className="text-red-600 hover:underline"
        >
          {children}
        </a>
      )
    },
    internalLink: ({ value, children }) => {
      return (
        <a
          href={value?.slug?.current ? `/${value.slug.current}` : '#'}
          className="text-red-600 hover:underline"
        >
          {children}
        </a>
      )
    }
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-red-600 pl-4 italic my-6">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
  }
} 