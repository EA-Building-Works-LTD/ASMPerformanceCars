"use client"

import React, { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import dynamic from 'next/dynamic'

interface LayoutProps {
  children: React.ReactNode
  seoContent?: any
}

// Dynamically import the CookieConsent component to avoid SSR issues
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })

export const Layout = ({ children, seoContent }: LayoutProps) => {
  // Add effect to handle mobile scrolling
  useEffect(() => {
    // Force redraw on scroll to prevent header from disappearing
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-position', `${window.scrollY}px`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer seoContent={seoContent} />
      <CookieConsent />
    </div>
  )
} 