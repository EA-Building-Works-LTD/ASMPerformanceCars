import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category') || '';
    
    // Build the GROQ query based on parameters
    let query = `*[_type == "post"]`;
    
    // Add category filter if specified
    if (category) {
      query += ` && count(categories[]->title[@ == "${category}"]) > 0`;
    }
    
    // Add ordering and pagination
    query += ` | order(publishedAt desc)[${skip}...${skip + limit}] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      "categories": categories[]->title,
      "authorName": author->name,
      "authorImage": author->image,
      excerpt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`;
    
    // Execute the query
    const posts = await client.fetch(query);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 