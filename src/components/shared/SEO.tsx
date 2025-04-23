import { Metadata } from 'next'
import { urlForImage } from '@/sanity/lib/client'

// Default metadata values
const defaultMetadata = {
  title: 'ASM Performance Cars | Luxury & Modified Vehicles',
  description: 'Specialists in premium modified vehicles and luxury supercars. Discover your dream performance car with ASM Performance Cars.',
  keywords: ['modified cars', 'luxury vehicles', 'performance cars', 'supercars', 'UK car dealership'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://asmperformancecars.co.uk',
    siteName: 'ASM Performance Cars',
    images: [
      {
        url: 'https://asmperformancecars.co.uk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASM Performance Cars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@asmperformance',
  }
}

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  noIndex?: boolean
  noFollow?: boolean
  canonicalUrl?: string
}

// Sanity SEO object interface
interface SanitySEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  openGraphImage?: any
  altText?: string
  canonicalUrl?: string
  noIndex?: boolean
}

/**
 * Maps Sanity SEO object to our SEO props interface
 */
export function mapSanityToSEOProps(sanitySEO: unknown): SEOProps | undefined {
  if (!sanitySEO) return undefined
  
  // Type assertion to work with the Sanity SEO properties
  const seo = sanitySEO as SanitySEO
  const seoProps: SEOProps = {}
  
  // Map known Sanity fields to our SEO interface
  if (seo.metaTitle) {
    seoProps.title = seo.metaTitle
  }
  
  if (seo.metaDescription) {
    seoProps.description = seo.metaDescription
  }
  
  if (seo.keywords && Array.isArray(seo.keywords)) {
    seoProps.keywords = seo.keywords
  }
  
  if (seo.openGraphImage) {
    seoProps.image = {
      url: urlForImage(seo.openGraphImage).url(),
      alt: seo.altText
    }
  }
  
  if (seo.canonicalUrl) {
    seoProps.canonicalUrl = seo.canonicalUrl
  }
  
  if (seo.noIndex) {
    seoProps.noIndex = seo.noIndex
  }
  
  return seoProps
}

// Type guard to check if we're dealing with SEOProps
function isSEOProps(seo: SEOProps | SanitySEO): seo is SEOProps {
  return 'title' in seo || 'image' in seo || 'noFollow' in seo;
}

/**
 * Generates Next.js Metadata from a Sanity SEO object
 */
export function generateSEOMetadata(seo?: SEOProps | SanitySEO): Metadata {
  // If we receive a direct Sanity SEO object, map it to our format
  if (seo && ('metaTitle' in seo || 'metaDescription' in seo || 'openGraphImage' in seo)) {
    seo = mapSanityToSEOProps(seo) as SEOProps;
  }
  
  if (!seo) {
    return {}
  }
  
  // Ensure we're working with SEOProps
  if (!isSEOProps(seo)) {
    return {}
  }
  
  const metadata: Metadata = {}
  
  // Title and description
  if (seo.title) {
    metadata.title = seo.title
  }
  
  if (seo.description) {
    metadata.description = seo.description
  }

  // Keywords
  if (seo.keywords && seo.keywords.length > 0) {
    metadata.keywords = seo.keywords
  }

  // Robots directives
  const robotsDirectives: string[] = []
  if (seo.noIndex) robotsDirectives.push('noindex')
  if (seo.noFollow) robotsDirectives.push('nofollow')
  
  if (robotsDirectives.length > 0) {
    metadata.robots = robotsDirectives.join(', ')
  }

  // Canonical URL
  if (seo.canonicalUrl) {
    metadata.alternates = {
      canonical: seo.canonicalUrl
    }
  }

  // Open Graph image
  if (seo.image && seo.image.url) {
    metadata.openGraph = {
      images: [{
        url: seo.image.url,
        width: seo.image.width || 1200,
        height: seo.image.height || 630,
        alt: seo.image.alt || (seo.title || '')
      }]
    }
  }

  return metadata
} 