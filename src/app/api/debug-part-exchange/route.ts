import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const query = groq`*[_type == "partExchangePage"][0]{
      title,
      description,
      seo {
        title,
        description,
        keywords
      },
      hero {
        title,
        subtitle,
        backgroundType,
        backgroundColor,
        backgroundImage,
        ctaText,
        ctaUrl
      },
      introduction {
        title,
        content,
        image,
        imagePosition
      },
      benefits {
        title,
        subtitle,
        benefits[] {
          title,
          description,
          icon
        },
        backgroundType,
        backgroundColor
      },
      process {
        title,
        subtitle,
        steps[] {
          title,
          description,
          icon
        },
        ctaText,
        ctaUrl
      },
      valuation {
        title,
        subtitle,
        description,
        image,
        ctaText,
        ctaUrl
      },
      testimonials {
        title,
        subtitle,
        testimonials[] {
          name,
          quote,
          exchangedCar,
          purchasedCar,
          rating,
          image
        }
      },
      faq {
        title,
        subtitle,
        faqs[] {
          question,
          answer
        }
      },
      cta {
        title,
        content,
        primaryButton {
          text,
          url
        },
        secondaryButton {
          text,
          url
        },
        backgroundColor
      }
    }`

    const data = await client.fetch(query)
    
    // Check if data exists
    const hasData = !!data
    
    // Generate a schema mismatch message to help debug
    const expectedFields = [
      'title',
      'description',
      'seo',
      'hero',
      'introduction',
      'benefits',
      'process',
      'valuation',
      'testimonials',
      'faq',
      'cta'
    ]
    
    const actualFields = data ? Object.keys(data) : []
    const missingFields = expectedFields.filter(field => !actualFields.includes(field))
    const extraFields = actualFields.filter(field => !expectedFields.includes(field))
    
    const schemaMismatch = {
      missingFields,
      extraFields,
      expectedSchema: expectedFields,
      actualSchema: actualFields,
    }

    return NextResponse.json({
      success: true,
      hasData,
      schemaMismatch,
      data,
    })
  } catch (error) {
    console.error('Error in debug-part-exchange route:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
} 