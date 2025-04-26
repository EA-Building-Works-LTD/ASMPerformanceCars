import { client } from './client'

export interface Redirect {
  source: string
  destination: string
  permanent: boolean
  active: boolean
}

export async function getRedirects(): Promise<Redirect[]> {
  try {
    return client.fetch(`
      *[_type == "redirect" && active == true] {
        source,
        destination,
        permanent
      }
    `)
  } catch (error) {
    console.error("Error fetching redirects:", error)
    return []
  }
}

/**
 * Generates next.config.js compatible redirects configuration
 * This can be used for static exports or to supplement dynamic redirects
 */
export async function generateRedirectsConfig() {
  const redirects = await getRedirects()
  
  return redirects.map(redirect => ({
    source: redirect.source,
    destination: redirect.destination,
    permanent: redirect.permanent
  }))
} 