import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import { CarDetailingPageData } from './types'
import { mockCarDetailingData } from './mockData'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Shield, Sparkles, Clock, Brush, Check, Car, Star, Droplet, Clipboard, ArrowRight, ChevronDown } from 'lucide-react'
import CarDetailingForm from '@/components/forms/CarDetailingForm'
import { CarDetailingPageClient } from '@/app/services/car-detailing/CarDetailingPageClient'

export const revalidate = 3600 // Revalidate every hour

// Helper function to get image URL with robust fallback handling
const getImageUrl = (image: unknown, fallbackPath: string): string => {
  try {
    // Case 1: No image data provided
    if (!image) return fallbackPath;
    
    // Case 2: Direct URL in asset
    if (image.asset?.url) {
      return image.asset.url;
    }
    
    // Case 3: Sanity image with proper _id format
    if (image.asset?._id && typeof image.asset._id === 'string' && image.asset._id.startsWith('image-')) {
      try {
        const urlResult = urlFor(image);
        // Check if urlResult exists and has a url method
        if (urlResult && typeof urlResult.url === 'function') {
          const url = urlResult.url();
          if (url) return url;
        }
      } catch (e) {
        console.error('Error processing Sanity image:', e);
      }
    }
    
    // Fallback to default path
    return fallbackPath;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return fallbackPath;
  }
};

// Deep merge function to combine Sanity data with mock data
function deepMerge(target: unknown, source: unknown): any {
  // If no source data is provided, use the target (mock) data
  if (!source) return target;
  
  // Create a new object to avoid mutating the target
  const output = { ...target } as any;
  
  // Loop through the keys in the source (Sanity) data
  Object.keys(source as object).forEach(key => {
    const typedKey = key as keyof any;
    const sourceValue = source[typedKey];
    
    // Skip null/undefined values from Sanity
    if (sourceValue === null || sourceValue === undefined) return;
    
    // For arrays from Sanity, replace the entire mock array
    if (Array.isArray(sourceValue)) {
      (output as any)[key] = sourceValue;
    }
    // For nested objects, recursively merge
    else if (
      typeof sourceValue === 'object' && 
      !Array.isArray(sourceValue) && 
      sourceValue !== null &&
      typeof (output as any)[key] === 'object' &&
      !Array.isArray((output as any)[key]) &&
      (output as any)[key] !== null
    ) {
      (output as any)[key] = deepMerge((output as any)[key], sourceValue);
    }
    // For primitive values or complete object replacements
    else {
      (output as any)[key] = sourceValue;
    }
  });
  
  return output;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data from Sanity for metadata
    const sanityData = await getCarDetailingPageData()
    
    // Merge Sanity data with mock data
    const mergedData = deepMerge(mockCarDetailingData, sanityData)
    
    // Use custom title and merged data for description
    const description = mergedData.seo?.description || mergedData.description
    const keywords = mergedData.seo?.keywords

    return {
      title: "Car Detailing Birmingham | ASM Performance Cars",
      description,
      keywords: keywords?.join(', '),
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    
    // Fallback to custom title
    return {
      title: "Car Detailing Birmingham | ASM Performance Cars",
      description: mockCarDetailingData.seo?.description,
      keywords: mockCarDetailingData.seo?.keywords?.join(', '),
    }
  }
}

async function getCarDetailingPageData(): Promise<CarDetailingPageData | null> {
  try {
    // Query that matches the schema structure in Sanity
    const query = groq`*[_type == "carDetailingPage"][0]{
      "title": title,
      "description": description,
      "seo": {
        "title": seo.title,
        "description": seo.description,
        "keywords": seo.keywords
      },
      "hero": {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "backgroundType": hero.backgroundType,
        "backgroundColor": hero.backgroundColor,
        "backgroundImage": hero.backgroundImage{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        },
        "ctaText": hero.ctaText,
        "ctaUrl": hero.ctaUrl
      },
      "introduction": {
        "title": introduction.title,
        "content": introduction.content,
        "image": introduction.image{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        },
        "imagePosition": introduction.imagePosition
      },
      "benefits": {
        "title": benefits.title,
        "subtitle": benefits.subtitle,
        "items": benefits.items[] {
          "title": title,
          "description": description,
          "icon": icon
        },
        "backgroundType": benefits.backgroundType,
        "backgroundColor": benefits.backgroundColor
      },
      "process": {
        "title": process.title,
        "subtitle": process.subtitle,
        "steps": process.steps[] {
          "stepNumber": stepNumber,
          "title": title,
          "description": description,
          "icon": icon
        },
        "ctaText": process.ctaText,
        "ctaUrl": process.ctaUrl
      },
      "services": {
        "title": services.title,
        "subtitle": services.subtitle,
        "items": services.items[] {
          "title": title,
          "description": description,
          "image": image{
            "asset": {
              "_id": asset._id,
              "url": asset->url
            },
            "alt": alt
          }
        }
      },
      "testimonials": {
        "title": testimonials.title,
        "subtitle": testimonials.subtitle,
        "items": testimonials.items[] {
          "name": name,
          "quote": quote,
          "carModel": carModel,
          "location": location,
          "rating": rating,
          "image": image
        }
      },
      "faq": {
        "title": faq.title,
        "subtitle": faq.subtitle,
        "faqs": faq.faqs[] {
          "question": question,
          "answer": answer
        }
      },
      "seoContent": {
        "enabled": seoContent.enabled,
        "title": seoContent.title,
        "content": seoContent.content
      },
      "cta": {
        "title": cta.title,
        "content": cta.content,
        "primaryButton": {
          "text": cta.primaryButton.text,
          "url": cta.primaryButton.url
        },
        "secondaryButton": {
          "text": cta.secondaryButton.text,
          "url": cta.secondaryButton.url
        },
        "backgroundColor": cta.backgroundColor
      }
    }`

    const data = await client.fetch<CarDetailingPageData>(query)
    return data
  } catch (error) {
    console.error('Error fetching car detailing page data:', error)
    return null
  }
}

// Helper function to render the appropriate icon
const renderIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'shield': return <Shield className="h-6 w-6 text-red-600" />;
    case 'sparkles': return <Sparkles className="h-6 w-6 text-red-600" />;
    case 'clock': return <Clock className="h-6 w-6 text-red-600" />;
    case 'brush': return <Brush className="h-6 w-6 text-red-600" />;
    case 'check': return <Check className="h-6 w-6 text-red-600" />;
    case 'car': return <Car className="h-6 w-6 text-red-600" />;
    case 'star': return <Star className="h-6 w-6 text-red-600" />;
    case 'spray': return <Sparkles className="h-6 w-6 text-red-600" />;
    case 'drop': 
    case 'droplet': return <Droplet className="h-6 w-6 text-red-600" />;
    case 'clipboard': return <Clipboard className="h-6 w-6 text-red-600" />;
    case 'pound': return <span className="h-6 w-6 flex items-center justify-center text-red-600 font-bold">£</span>;
    default: return <Brush className="h-6 w-6 text-red-600" />;
  }
};

// Helper function to render star ratings
const renderRating = (rating: number) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < (rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default async function CarDetailingPage() {
  // Fetch data from Sanity
  const sanityData = await getCarDetailingPageData()
  const pageData = deepMerge(mockCarDetailingData, sanityData)

  return <CarDetailingPageClient pageData={pageData} />
} 