"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ConsignmentHeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  backgroundType?: 'image' | 'color'
  backgroundColor?: string
  backgroundImage?: {
    asset: {
      _ref: string
    } | {
      _id?: string
      url?: string
    }
    alt?: string
  } | string
}

export const ConsignmentHero: React.FC<ConsignmentHeroProps> = ({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaUrl = "#contact",
  backgroundType = 'image',
  backgroundColor = 'bg-gray-900',
  backgroundImage
}) => {
  // For debugging
  console.log("ConsignmentHero backgroundImage type:", typeof backgroundImage);
  console.log("ConsignmentHero backgroundImage value:", backgroundImage);
  
  let imageUrl = '/images/services/consignment-hero.jpg'
  
  if (backgroundImage) {
    if (typeof backgroundImage === 'string') {
      // If backgroundImage is already a URL string (from Sanity)
      imageUrl = backgroundImage
    } else if (backgroundImage.asset) {
      if ('_ref' in backgroundImage.asset) {
        // If backgroundImage is an object with asset._ref
        imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${backgroundImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
      } else if ('url' in backgroundImage.asset && backgroundImage.asset.url) {
        // If backgroundImage is an object with asset.url
        imageUrl = backgroundImage.asset.url
      }
    }
  }
  
  console.log("ConsignmentHero imageUrl after processing:", imageUrl);

  // Get alt text safely
  const altText = typeof backgroundImage === 'object' && 
                 backgroundImage !== null && 
                 'alt' in backgroundImage && 
                 backgroundImage.alt ? 
    backgroundImage.alt : 
    title || 'Consignment Car Sales';

  return (
    <section className={`relative h-[60vh] min-h-[500px] flex items-center ${backgroundType === 'color' ? backgroundColor : ''}`}>
      {backgroundType === 'image' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black" style={{ opacity: 0.9 }}></div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        )}
        {ctaText && (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg"
            onClick={() => {
              if (ctaUrl.startsWith('#')) {
                const element = document.getElementById(ctaUrl.substring(1))
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              } else {
                window.location.href = ctaUrl
              }
            }}
          >
            {ctaText}
          </Button>
        )}
      </div>

      {/* Bottom Wave Shape */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 140"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          width="100%"
          style={{ display: 'block', marginBottom: '-1px' }}
        >
          <path
            d="M0 0L48 5.33333C96 10.6667 192 21.3333 288 32C384 42.6667 480 53.3333 576 53.3333C672 53.3333 768 42.6667 864 26.6667C960 10.6667 1056 -10.6667 1152 5.33333C1248 21.3333 1344 74.6667 1392 100L1440 125L1440 140L0 140Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
} 