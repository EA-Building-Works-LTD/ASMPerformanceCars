import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ results: [] })
  }
  
  try {
    const searchPattern = `*${query}*`
    
    // Search for blog posts
    const postsQuery = groq`*[_type == "post" && (
      title match $searchPattern || 
      pt::text(body) match $searchPattern ||
      pt::text(excerpt) match $searchPattern ||
      categories[]->title match $searchPattern
    )] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "excerpt": pt::text(excerpt),
      publishedAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 1500),
      "authorName": author->name,
      "categories": categories[]->title,
      "mainImage": mainImage
    }`
    
    // Run query
    const posts = await client.fetch(postsQuery, { searchPattern })
    
    return NextResponse.json({ results: posts })
  } catch (error) {
    console.error('Blog search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
} 