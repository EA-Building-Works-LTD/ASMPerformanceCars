'use client'

import React, { useState, useEffect } from 'react'
import BlogAd from './BlogAd'

interface ResponsiveBlogAdProps {
  desktopAd: any
  mobileAd?: any  // Optional, will use desktop ad if not provided
  className?: string  // Optional class name for custom styling
  variant?: 'default' | 'footer'
}

const ResponsiveBlogAd = ({ desktopAd, mobileAd, className, variant = 'default' }: ResponsiveBlogAdProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < 768)
    
    // Update on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // If mobile ad is not provided, use desktop ad
  const activeAd = isMobile && mobileAd ? mobileAd : desktopAd
  
  if (!activeAd) return null
  
  return <div className={className}><BlogAd ad={activeAd} variant={variant} /></div>
}

export default ResponsiveBlogAd 