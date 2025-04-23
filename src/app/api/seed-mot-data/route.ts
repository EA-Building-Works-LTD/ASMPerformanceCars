import { NextResponse } from 'next/server';
import { initializeMotCheckPage } from '@/sanity/lib/client';

export async function GET() {
  try {
    const result = await initializeMotCheckPage();
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: 'MOT check data initialized successfully'
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'MOT check data already exists'
      });
    }
  } catch (error) {
    console.error('Error initializing MOT check data:', error);
    
    const isPermissionError = error instanceof Error && 
      error.message.includes('Insufficient permissions');
    
    if (isPermissionError) {
      return NextResponse.json({
        success: false,
        message: 'Permission Error: Unable to create Sanity document',
        error: 'This endpoint needs to be accessed by a user with appropriate Sanity permissions. Please login to the Sanity Studio and create the document manually, or run this API from an environment with the correct API token.',
        instructions: 'To manually create this document, go to Sanity Studio, select "MOT Check Page" from the document types, and create a new document.'
      }, { status: 403 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize MOT check data',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 