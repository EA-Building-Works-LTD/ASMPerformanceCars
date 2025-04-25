import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Add this GET handler to allow direct browser testing
export async function GET(request: NextRequest) {
  try {
    // Verify this is coming with a secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Check the secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    // Revalidate all vehicle-related pages
    revalidatePath('/our-cars/used-cars-for-sale');
    revalidatePath('/our-cars/modified-cars-for-sale');
    revalidatePath('/our-cars/luxury-supercars-for-sale');
    revalidatePath('/our-cars');
    revalidatePath('/');
    
    console.log('GET revalidation completed successfully');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Revalidation triggered successfully via GET' 
    });
  } catch (error) {
    console.error('GET revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is coming from Sanity with a secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Check the secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    // Get the webhook data from the request body
    const body = await request.json();
    
    // Extract relevant information from the Sanity webhook payload
    const { _type, slug } = body;
    
    console.log('Revalidation triggered for:', { type: _type, slug });
    
    // Revalidate specific paths based on the content type
    if (_type === 'vehicle') {
      // Revalidate all used car pages
      revalidatePath('/our-cars/used-cars-for-sale');
      
      // If we have a slug, also revalidate that specific vehicle page
      if (slug?.current) {
        revalidatePath(`/our-cars/used-cars-for-sale/${slug.current}`);
      }
    }
    
    if (_type === 'modifiedVehicle') {
      revalidatePath('/our-cars/modified-cars-for-sale');
      
      if (slug?.current) {
        revalidatePath(`/our-cars/modified-cars-for-sale/${slug.current}`);
      }
    }
    
    if (_type === 'luxuryVehicle') {
      revalidatePath('/our-cars/luxury-supercars-for-sale');
      
      if (slug?.current) {
        revalidatePath(`/our-cars/luxury-supercars-for-sale/${slug.current}`);
      }
    }
    
    // Always revalidate the home page and main car listing page
    revalidatePath('/');
    revalidatePath('/our-cars');
    
    console.log('Revalidation completed successfully');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Revalidation triggered successfully' 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
} 