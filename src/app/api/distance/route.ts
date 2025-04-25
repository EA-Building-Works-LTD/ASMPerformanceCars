import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { validatePostcode } from '@/lib/validate-postcode'

// Rate limiter: 10 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 50, // Max 50 users per interval
  limit: 10,
})

// Function to extract UK postcodes from a string if present
function extractUKPostcode(address: string): string | null {
  // UK postcode regex
  const postcodeRegex = /[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}/i;
  const match = address.match(postcodeRegex);
  return match ? match[0] : null;
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting - get IP from headers or use a fallback
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous'
    const { success, limit, remaining, reset } = await limiter.check(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      )
    }
    
    // Parse request body
    const body = await request.json()
    const { pickupPostcode, dropOffAddress } = body
    
    // Validate inputs
    if (!pickupPostcode || !dropOffAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Don't require postcode validation - allow any address now
    // Instead of validating, we'll just use the addresses as-is for the distance calculation
    
    // Calculate direct distance from pickup to dropoff
    const directDistance = await calculateGoogleMapsDistance(pickupPostcode, dropOffAddress);
    
    // Calculate pricing based on the distance
    const totalDistance = Math.round(directDistance);
    const price = calculatePrice(totalDistance);
    
    // Return the result
    return NextResponse.json({
      success: true,
      distance: totalDistance,
      price: price,
      unit: 'miles',
      from: pickupPostcode,
      to: dropOffAddress,
    })
  } catch (error) {
    console.error('Distance calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    )
  }
}

// Function to calculate price based on distance
function calculatePrice(distance: number): number {
  const BASE_FEE = 60; // Base fee of £60
  
  if (distance <= 5) {
    return BASE_FEE; // Flat rate of £60 for distances up to 5 miles
  } else {
    // For distances over 5 miles: £60 base fee + (distance * £2 per mile)
    return BASE_FEE + (distance * 2);
  }
}

// Function to calculate direct distance from pickup to dropoff
async function calculateGoogleMapsDistance(origin: string, destination: string): Promise<number> {
  // Use API key from environment variables
  const apiKey = process.env.GOOGLE_MAPS_API_KEY_2025 || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_2025;
  
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }
  
  // URL encode the parameters
  const encodedOrigin = encodeURIComponent(origin)
  const encodedDestination = encodeURIComponent(destination)
  
  // Build the Google Maps Distance Matrix API URL
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&units=imperial&key=${apiKey}`
  
  // Call the Google Maps API
  const response = await fetch(url)
  const data = await response.json()
  
  // Check if the API returned valid results
  if (data.status !== 'OK' || !data.rows[0]?.elements[0] || data.rows[0].elements[0].status !== 'OK') {
    console.error('Google Maps API error:', data)
    throw new Error('Failed to calculate distance from Google Maps API')
  }
  
  // Extract the distance in miles
  const distanceText = data.rows[0].elements[0].distance.text
  const distanceValue = parseFloat(distanceText.replace(/[^0-9\.]/g, ''))
  
  return distanceValue
} 