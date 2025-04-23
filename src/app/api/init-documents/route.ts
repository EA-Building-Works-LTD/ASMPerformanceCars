import { NextResponse } from 'next/server';
import { initializeUsedCarsPage, initializeLuxuryCarsPage } from '@/sanity/lib/client';

export async function GET() {
  try {
    // Initialize all singleton documents
    const usedCarsPageInitialized = await initializeUsedCarsPage();
    const luxuryCarsPageInitialized = await initializeLuxuryCarsPage();
    
    return NextResponse.json({
      success: true,
      message: 'Document initialization complete',
      results: {
        usedCarsPageInitialized,
        luxuryCarsPageInitialized
      }
    });
  } catch (error) {
    console.error('Error initializing documents:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize documents',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
 