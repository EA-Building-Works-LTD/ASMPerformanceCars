import { Metadata } from 'next'

/**
 * Creates a canonical URL for a specific page
 * 
 * @param path - The path of the page relative to the domain (should start with /)
 * @param params - Optional URL parameters to include
 * @returns The full canonical URL
 */
export function generateCanonicalUrl(path: string, params?: Record<string, string>): string {
  // Get the base URL from environment or use the production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asmperformancecars.co.uk'
  
  // Ensure path starts with a /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // Build the full canonical URL
  let canonicalUrl = `${baseUrl}${normalizedPath}`
  
  // Add URL parameters if provided
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })
    canonicalUrl += `?${searchParams.toString()}`
  }
  
  return canonicalUrl
}

/**
 * Adds a canonical URL to existing metadata
 * 
 * @param metadata - Existing metadata object to modify
 * @param path - The path of the page relative to the domain
 * @param params - Optional URL parameters to include
 * @returns Updated metadata object with canonical URL
 */
export function addCanonicalUrl(
  metadata: Metadata, 
  path: string, 
  params?: Record<string, string>
): Metadata {
  const canonicalUrl = generateCanonicalUrl(path, params)
  
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: canonicalUrl,
    },
  }
}

/**
 * Example usage in a page component:
 * 
 * export async function generateMetadata(): Promise<Metadata> {
 *   const baseMetadata = {
 *     title: 'Page Title',
 *     description: 'Page description'
 *   }
 *   
 *   return addCanonicalUrl(baseMetadata, '/path/to/page')
 * }
 * 
 * For a dynamic page:
 * 
 * export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
 *   const baseMetadata = {
 *     title: 'Dynamic Page',
 *     description: 'Dynamic page description'
 *   }
 *   
 *   return addCanonicalUrl(baseMetadata, `/dynamic/${params.slug}`)
 * }
 */ 