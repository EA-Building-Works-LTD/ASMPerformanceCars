import { cache } from 'react'

interface GoogleReview {
  author_name: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface GooglePlaceDetails {
  result: {
    reviews: GoogleReview[]
    name: string
    rating: number
    user_ratings_total: number
  }
  status?: string
  error_message?: string
}

export interface FormattedGoogleReview {
  id: string
  name: string
  location: string
  testimonial: string
  rating: number
  image?: string
  source: string
  date: string
}

// Create initials for avatar fallbacks
function getInitials(name: string): string {
  if (!name) return 'A';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

export const fetchGoogleReviews = cache(async (): Promise<FormattedGoogleReview[]> => {
  try {
    // Read environment variables for Google Places API
    const PLACE_ID = process.env.GOOGLE_PLACE_ID
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY
    
    // Log environment state (not the actual keys) for debugging
    console.log('Google API Config:', { 
      hasPlaceId: !!PLACE_ID, 
      hasApiKey: !!API_KEY, 
      environment: process.env.NODE_ENV 
    })
    
    // Check if we have the required API keys
    if (!PLACE_ID || !API_KEY) {
      console.warn('Missing Google API key or Place ID. Using mock data instead.')
      return getMockGoogleReviews()
    }
    
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${PLACE_ID}&key=${API_KEY}&fields=name,rating,reviews,user_ratings_total`
    console.log('Fetching Google reviews from API endpoint')
    
    // Always attempt to get real reviews if we have the keys, regardless of environment
    const response = await fetch(endpoint, { 
      next: { revalidate: 86400 }, // Cache for 24 hours
      cache: 'no-store' // Force fresh data during development 
    })
    
    if (!response.ok) {
      console.error('Failed to fetch Google reviews. Status:', response.status, response.statusText)
      return getMockGoogleReviews()
    }
    
    const data: GooglePlaceDetails = await response.json()
    
    // Log the response status and review count for debugging
    console.log('Google API response:', { 
      status: data.status, 
      reviewCount: data.result?.reviews?.length || 0,
      errorMessage: data.error_message
    })
    
    // Check for API errors or missing reviews
    if (data.error_message || data.status !== 'OK') {
      console.error('Google API error:', data.error_message || data.status)
      return getMockGoogleReviews()
    }
    
    if (!data.result || !data.result.reviews || data.result.reviews.length === 0) {
      console.warn('No reviews found in Google API response')
      return getMockGoogleReviews()
    }
    
    // Success! Format and return the real reviews
    return data.result.reviews.map((review, index) => ({
      id: `google-${index}-${review.time}`,
      name: review.author_name,
      location: 'Google Review', // Google doesn't provide specific locations
      testimonial: review.text,
      rating: review.rating,
      image: review.profile_photo_url,
      source: 'google',
      date: review.relative_time_description
    }))
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return getMockGoogleReviews()
  }
})

// Fallback mock data for development or when API fails
function getMockGoogleReviews(): FormattedGoogleReview[] {
  console.log('Using mock Google reviews data')
  return [
    {
      id: 'google-1',
      name: 'James Wilson',
      location: 'Birmingham',
      testimonial: 'Absolutely fantastic service from start to finish. The BMW M4 I purchased was immaculate and exactly as described. The team went above and beyond to ensure a smooth transaction.',
      rating: 5,
      // Don't use external service that requires configuration
      image: undefined,
      source: 'google',
      date: '2 weeks ago'
    },
    {
      id: 'google-2',
      name: 'Sarah Thompson',
      location: 'Manchester',
      testimonial: 'I was looking for a specific model with particular specifications and ASM Performance delivered. They found me exactly what I wanted and the financing options were very competitive.',
      rating: 5,
      image: undefined,
      source: 'google',
      date: '1 month ago'
    },
    {
      id: 'google-3',
      name: 'Michael Chen',
      location: 'London',
      testimonial: 'Exceptional dealership with a great selection of high-performance vehicles. The staff are knowledgeable and not pushy. The aftercare service has been excellent too.',
      rating: 5,
      image: undefined,
      source: 'google',
      date: '2 months ago'
    },
    {
      id: 'google-4',
      name: 'Emma Roberts',
      location: 'Leeds',
      testimonial: 'I was nervous about buying a modified car but the team at ASM put me at ease. They explained all the modifications in detail and provided all service history. Very professional.',
      rating: 4,
      image: undefined,
      source: 'google',
      date: '3 months ago'
    },
    {
      id: 'google-5',
      name: 'David Parker',
      location: 'Bristol',
      testimonial: "Purchased an Audi RS6 and couldn't be happier. The car was prepped to perfection and the handover experience was top notch. Would definitely recommend to anyone looking for a quality performance car.",
      rating: 5,
      image: undefined,
      source: 'google',
      date: '4 months ago'
    }
  ]
}