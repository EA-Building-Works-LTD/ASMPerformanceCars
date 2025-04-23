import { NextResponse } from 'next/server';
import { getFeaturedVehicles, urlForImage } from '@/sanity/lib/client';

// Define a basic type for vehicle
interface Vehicle {
  [key: string]: any;
}

export async function GET() {
  try {
    // Fetch featured vehicles from Sanity
    const vehicles = await getFeaturedVehicles();
    
    // Process image URLs to ensure they're properly formatted
    const processedVehicles = vehicles.map((vehicle: Vehicle) => ({
      ...vehicle,
      // Ensure we don't modify the original object structure
      // The frontend will use urlForImage to render the images
    }));
    
    return NextResponse.json(processedVehicles, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured vehicles' },
      { status: 500 }
    );
  }
} 