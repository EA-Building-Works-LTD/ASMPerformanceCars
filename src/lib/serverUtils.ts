import { FormattedGoogleReview } from './googleReviews';

// Maximum number of reviews to display
const MAX_REVIEWS = 10;

/**
 * This function fetches Google reviews directly from the server
 * It avoids CORS issues that can happen with client-side requests
 * Uses the new Places API structure
 */
export async function fetchGoogleReviewsFromServer(): Promise<FormattedGoogleReview[]> {
  try {
    // Get API keys from environment variables
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!PLACE_ID || !API_KEY) {
      console.error('Missing Google API credentials in environment variables');
      return [];
    }
    
    // Use the new Places API endpoint structure - now via places.googleapis.com
    const apiUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews,displayName`;
    
    // Make the server-side request with the new API headers
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        // Add these headers for the new Places API
        'X-Goog-FieldMask': 'reviews,displayName'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error(`Google Places API error response: ${response.status} ${response.statusText}`);
      // Try to get more details from the error
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return [];
    }
    
    // Parse the response - structure is different in the new API
    const data = await response.json();
    
    // Check if we have reviews in the result
    if (!data || !data.reviews || data.reviews.length === 0) {
      console.error('No reviews found in Google Places API response', {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : []
      });
      return [];
    }
    
    // Format reviews to match our application structure
    // Structure is different in the new Places API
    const reviews = data.reviews.map((review: unknown, index: number) => ({
      id: `google-${index}`,
      name: review.authorAttribution?.displayName || 'Anonymous',
      location: 'Google Review',
      testimonial: review.text?.text || '',
      rating: review.rating || 5,
      image: review.authorAttribution?.photoUri,
      source: 'google',
      date: review.relativePublishTimeDescription || ''
    }));
    
    // Limit to MAX_REVIEWS
    return reviews.slice(0, MAX_REVIEWS);
    
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return [];
  }
}

// Google Business Profile URL for "See more reviews" button
export const GOOGLE_REVIEWS_URL = 'https://g.page/r/CbeytkCdXqmdEAI/review'; 