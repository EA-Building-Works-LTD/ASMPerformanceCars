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
    
    // Search for vehicles (including all vehicle types)
    const carsQuery = groq`*[_type in ["vehicle", "modifiedVehicle", "luxuryVehicle"] && (
      title match $searchPattern || 
      make match $searchPattern || 
      model match $searchPattern ||
      coalesce(pt::text(description), "") match $searchPattern ||
      coalesce(pt::text(extendedInfo), "") match $searchPattern
    )] {
      _id,
      _type,
      title,
      slug,
      price,
      priceOnApplication,
      year,
      mileage,
      make,
      model,
      "description": coalesce(pt::text(description), pt::text(extendedInfo), ""),
      "imageUrl": mainImage.asset->url
    }`
    
    // Search for blog posts
    const postsQuery = groq`*[_type == "post" && (
      title match $searchPattern || 
      pt::text(body) match $searchPattern ||
      pt::text(excerpt) match $searchPattern
    )] {
      _id,
      _type,
      title,
      slug,
      "description": pt::text(excerpt),
      publishedAt,
      "imageUrl": mainImage.asset->url
    }`
    
    // Search for pages (basic content pages)
    const pagesQuery = groq`*[_type == "page" && (
      title match $searchPattern || 
      pt::text(content) match $searchPattern
    )] {
      _id,
      _type,
      title,
      slug,
      "description": pt::text(content),
      "section": pageType
    }`
    
    // Run all queries in parallel
    const [cars, posts, pages] = await Promise.all([
      client.fetch(carsQuery, { searchPattern }),
      client.fetch(postsQuery, { searchPattern }),
      client.fetch(pagesQuery, { searchPattern })
    ])
    
    // Format results
    const formattedCars = cars.map((car: unknown) => {
      // Determine the correct URL path based on vehicle type
      let categoryPath = ''
      if (car._type === 'modifiedVehicle') {
        categoryPath = 'modified-cars-for-sale'
      } else if (car._type === 'luxuryVehicle') {
        categoryPath = 'luxury-supercars-for-sale'
      } else if (car._type === 'vehicle') {
        categoryPath = 'used-cars-for-sale'
      }
      
      return {
        id: car._id,
        type: 'car',
        title: car.title,
        description: car.description || 'No description available',
        link: `/our-cars/${categoryPath}/${car.slug?.current || car._id}`,
        price: car.priceOnApplication 
          ? 'Price on application' 
          : car.price ? `£${car.price.toLocaleString()}` : 'Price on request',
        year: car.year?.toString() || '',
        miles: car.mileage ? `${car.mileage} miles` : '',
        imageUrl: car.imageUrl,
        make: car.make,
        model: car.model
      }
    })
    
    const formattedPosts = posts.map((post: unknown) => ({
      id: post._id,
      type: 'post',
      title: post.title,
      description: post.description || 'No description available',
      link: `/blog/${post.slug?.current || post._id}`,
      date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : '',
      imageUrl: post.imageUrl
    }))
    
    const formattedPages = pages.map((page: unknown) => ({
      id: page._id,
      type: 'page',
      title: page.title,
      description: page.description || 'No description available',
      link: `/${page.slug?.current || ''}`,
      section: page.section || 'Page'
    }))
    
    // Combine all results
    const results = [...formattedCars, ...formattedPosts, ...formattedPages]
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
} 