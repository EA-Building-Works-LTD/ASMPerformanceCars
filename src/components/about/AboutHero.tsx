"use client"

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AboutHeroProps {
  title: string;
  subtitle?: string;
  backgroundType?: 'image' | 'color';
  backgroundColor?: string;
  backgroundImage?: {
    asset: {
      _ref: string
    } | {
      _id?: string
      url?: string
    }
    alt?: string
  } | string | null;
  ctaText?: string;
  ctaUrl?: string;
}

export default function AboutHero({
  title,
  subtitle,
  backgroundType = 'image',
  backgroundColor = 'bg-gray-900',
  backgroundImage,
  ctaText,
  ctaUrl = "#contact"
}: AboutHeroProps) {
  // Default background image if none provided
  const defaultImage = '/images/about-hero-bg.jpg';
  
  // Process image URL from different possible formats
  let imageUrl = defaultImage;
  
  if (backgroundImage) {
    if (typeof backgroundImage === 'string') {
      // If backgroundImage is already a URL string
      imageUrl = backgroundImage;
    } else if (typeof backgroundImage === 'object' && backgroundImage.asset) {
      if ('_ref' in backgroundImage.asset) {
        // If backgroundImage is an object with asset._ref (from Sanity)
        imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${backgroundImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
      } else if ('url' in backgroundImage.asset && backgroundImage.asset.url) {
        // If backgroundImage is an object with asset.url
        imageUrl = backgroundImage.asset.url;
      }
    }
  }
  
  // Get alt text safely
  const altText = backgroundImage && typeof backgroundImage === 'object' && backgroundImage.alt ? 
    backgroundImage.alt : 
    title || 'About Us';
  
  return (
    <section className={`relative h-[60vh] min-h-[500px] flex items-center ${backgroundType === 'color' ? backgroundColor : ''}`}>
      {/* Background Image */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black" style={{ opacity: 0.8 }}></div>
        </div>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          {title}
        </h1>
        
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
                const element = document.getElementById(ctaUrl.substring(1));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                window.location.href = ctaUrl;
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
  );
} 