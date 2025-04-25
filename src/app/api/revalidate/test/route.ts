import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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
    
    console.log('Test revalidation completed successfully');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Test revalidation triggered successfully' 
    });
  } catch (error) {
    console.error('Test revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
} 