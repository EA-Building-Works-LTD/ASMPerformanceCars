import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRedirects, Redirect } from './sanity/lib/redirects'

// Store redirects in memory to avoid fetching on every request
let redirects: Redirect[] = []
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

async function getAndCacheRedirects() {
  const now = Date.now()
  
  // Refetch redirects if cache is expired
  if (now - lastFetchTime > CACHE_DURATION || redirects.length === 0) {
    redirects = await getRedirects()
    lastFetchTime = now
    console.log(`Fetched ${redirects.length} redirects from Sanity`)
  }
  
  return redirects
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip redirects for API routes, static files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Skip files with extensions (e.g., .jpg, .css)
  ) {
    return NextResponse.next()
  }
  
  try {
    const redirects = await getAndCacheRedirects()
    
    // Find matching redirect
    const matchedRedirect = redirects.find(redirect => 
      pathname === redirect.source || 
      pathname === `${redirect.source}/` // Handle trailing slash variations
    )
    
    if (matchedRedirect) {
      const url = matchedRedirect.destination
      
      // Check if it's an internal or external redirect
      if (url.startsWith('/') || url.startsWith(request.nextUrl.origin)) {
        // Internal redirect
        return NextResponse.redirect(new URL(url, request.url), {
          status: matchedRedirect.permanent ? 301 : 302
        })
      } else {
        // External redirect
        return NextResponse.redirect(url, {
          status: matchedRedirect.permanent ? 301 : 302
        })
      }
    }
  } catch (error) {
    console.error('Error in redirect middleware:', error)
  }
  
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
} 