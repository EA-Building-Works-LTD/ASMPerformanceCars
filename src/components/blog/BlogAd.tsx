'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/client'

interface BlogAdProps {
  ad: {
    title: string
    adSize: string
    adImage: any
    adVideo?: {
      asset: {
        url?: string
        _ref?: string
        source?: {
          url: string
        }
      }
      caption?: string
    }
    link: string
    trackingId?: string
  }
  variant?: 'default' | 'footer'
  className?: string
}

// Size map for different ad formats
const sizeMap: Record<string, { width: number, height: number, aspectRatio: string, className: string }> = {
  '160x600': {
    width: 160, 
    height: 600, 
    aspectRatio: '160/600',
    className: 'w-[160px] h-[600px] mx-auto'
  },
  '250x250': {
    width: 250, 
    height: 250, 
    aspectRatio: '1/1',
    className: 'w-[250px] h-[250px] mx-auto'
  },
  '320x100': {
    width: 320, 
    height: 100, 
    aspectRatio: '320/100',
    className: 'w-full max-w-[320px] h-[100px] mx-auto'
  },
  '393x90': {
    width: 393, 
    height: 90, 
    aspectRatio: '393/90',
    className: 'w-full max-w-[393px] h-[90px] mx-auto'
  },
  '728x90': {
    width: 728, 
    height: 90, 
    aspectRatio: '728/90',
    className: 'w-full max-w-[728px] h-[90px] mx-auto'
  },
  '970x90': {
    width: 970, 
    height: 90, 
    aspectRatio: '970/90',
    className: 'w-full max-w-[970px] h-[90px] mx-auto'
  },
  'responsive_footer': {
    width: 970, 
    height: 90, 
    aspectRatio: '970/90',
    className: 'w-full max-w-[970px] md:h-[90px] h-[90px] mx-auto'
  }
};

// Helper function to safely get image URL from Sanity image object
const getSanityImageUrl = (image: any) => {
  try {
    // Check if image has a valid structure for urlForImage
    if (!image || typeof image !== 'object' || !('_type' in image)) {
      console.error('Invalid image structure:', image)
      return '/placeholder-ad.jpg' // Return a default placeholder
    }
    return urlForImage(image).url()
  } catch (error) {
    console.error('Error generating image URL:', error)
    return '/placeholder-ad.jpg' // Return a default placeholder
  }
}

const BlogAd = ({ ad, variant = 'default', className = '' }: BlogAdProps) => {
  const [videoError, setVideoError] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('/placeholder-ad.jpg')
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    // Handle video URL
    if (ad.adVideo) {
      // Different ways Sanity might structure the video URL
      const url = 
        // Case 1: Direct URL from file field in Sanity
        ad.adVideo.asset?.url ||
        // Case 2: Object with ref structure
        (ad.adVideo.asset?._ref && `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${ad.adVideo.asset._ref.replace('file-', '').replace('-mp4', '.mp4')}`) ||
        // Case 3: Nested structure
        ad.adVideo.asset?.source?.url || 
        null
        
      setVideoUrl(url)
    }
    
    // Handle image URL
    if (ad.adImage) {
      try {
        setImageUrl(getSanityImageUrl(ad.adImage))
      } catch (error) {
        console.error('Error setting image URL:', error)
      }
    }
  }, [ad.adVideo, ad.adImage])
  
  // Get size config based on ad size
  const sizeConfig = sizeMap[ad.adSize] || sizeMap['728x90'] // Default to standard banner if size not found
  
  const handleClick = () => {
    // Optional: Track ad click
    if (ad.trackingId) {
      try {
        // Simple tracking - could be replaced with more sophisticated analytics
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(`ad_clicked_${ad.trackingId}`, new Date().toISOString())
        }
      } catch (e) {
        // Silent fail for localStorage issues
      }
    }
  }
  
  const shouldUseVideo = videoUrl && !videoError
  
  // Handler for video errors
  const handleVideoError = () => {
    console.error('Video error occurred with source:', videoUrl)
    setVideoError(true)
  }
  
  // Adjust styling based on variant
  const containerClasses = variant === 'footer' 
    ? `relative max-w-full mx-auto overflow-hidden animate-fadeIn ${className}`
    : `relative max-w-full mx-auto my-3 overflow-hidden animate-fadeIn ${className}`;
    
  const linkClasses = variant === 'footer'
    ? "block transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 overflow-hidden rounded-md"
    : "block transition-all duration-300 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg rounded-lg overflow-hidden";
  
  return (
    <div className={containerClasses}>
      <Link 
        href={ad.link} 
        target="_blank" 
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={linkClasses}
      >
        <div className={`relative ${sizeConfig.className}`}>
          {shouldUseVideo ? (
            // Video content (prioritized)
            <video
              ref={videoRef}
              src={videoUrl}
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
              onError={handleVideoError}
            />
          ) : (
            // Image (fallback or primary if no video)
            <Image
              src={imageUrl}
              alt={ad.adImage?.alt || ad.title}
              fill
              sizes={`(max-width: ${sizeConfig.width}px) 100vw, ${sizeConfig.width}px`}
              className="object-cover"
              priority
            />
          )}
        </div>
      </Link>
    </div>
  )
}

export default BlogAd