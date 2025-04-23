"use client"

import React from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface ExchangeIntroProps {
  title: string
  content?: unknown[] // Portable Text content
  image?: {
    asset: {
      _ref: string
    } | {
      _id?: string
      url?: string
    }
    alt?: string
  } | string
  imagePosition?: 'left' | 'right'
}

export const ExchangeIntro: React.FC<ExchangeIntroProps> = ({
  title,
  content,
  image,
  imagePosition = 'right'
}) => {
  // For debugging
  console.log("ExchangeIntro image type:", typeof image);
  console.log("ExchangeIntro image value:", image);
  
  let imageUrl = '/images/services/part-exchange-intro.jpg'
  
  if (image) {
    if (typeof image === 'string') {
      // If image is already a URL string (from Sanity)
      imageUrl = image
    } else if (image.asset) {
      if ('_ref' in image.asset) {
        // If image is an object with asset._ref
        imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
      } else if ('url' in image.asset && image.asset.url) {
        // If image is an object with asset.url
        imageUrl = image.asset.url
      }
    }
  }
  
  console.log("ExchangeIntro imageUrl after processing:", imageUrl);

  const isImageRight = imagePosition === 'right'

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className={`flex flex-col ${isImageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}>
          <div className="lg:w-1/2">
            {content && (
              <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-li:text-gray-700">
                <PortableText value={content} components={portableTextComponents} />
              </div>
            )}
          </div>

          <div className="lg:w-1/2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageUrl}
                alt={(typeof image === 'object' && image.alt) ? image.alt : 'Part Exchange Introduction'}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 