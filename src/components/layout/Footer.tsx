"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { SEOContent } from '@/components/home/SEOContent'
import { FooterAd } from '@/components/layout/FooterAd'
import { toast } from '@/components/ui/use-toast'

interface FooterProps {
  seoContent?: any
}

export const Footer = ({ seoContent }: FooterProps) => {
  const pathname = usePathname()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Form validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to subscribe",
        variant: "destructive"
      })
      return
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      console.log('Submitting newsletter subscription:', { name, email });
      
      // Submit to Klaviyo API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })
      
      // Get response as text first to handle potential non-JSON responses
      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      // Success
      setIsSubmitted(true)
      setName('')
      setEmail('')
      
      toast({
        title: "Subscription successful!",
        description: "You have been added to our newsletter",
        variant: "default"
      })
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Determine which page we're on for the SEO content
  let route = '';
  if (pathname === '/') {
    route = 'home';
  } else if (pathname.includes('/our-cars/modified-cars-for-sale')) {
    route = 'modified';
  } else if (pathname.includes('/our-cars/luxury-supercars-for-sale')) {
    route = 'luxury';
  } else if (pathname.includes('/our-cars')) {
    route = 'used';
  }
  
  return (
    <>
      {seoContent && <SEOContent route={pathname} content={seoContent.content} title={seoContent.title} />}
      <footer className="bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Image 
                  src="/images/ASM Performance Cars Logo 2025 Dark Website Version.png" 
                  alt="ASM Performance" 
                  width={180} 
                  height={60} 
                  className="h-auto w-auto"
                  priority
                />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                ASM Performance Cars is a UK-based used car dealership specialising in modified cars, 
                luxury vehicles, and quality used cars. With a focus on exceptional service and 
                performance, we're your destination for automotive excellence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-900 hover:bg-red-600 rounded-full p-2 transition-colors duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-900 hover:bg-red-600 rounded-full p-2 transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-900 hover:bg-red-600 rounded-full p-2 transition-colors duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-900 hover:bg-red-600 rounded-full p-2 transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-red-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/our-cars" className="text-gray-400 hover:text-red-400 transition-colors">
                    Our Cars
                  </Link>
                </li>
                <li>
                  <Link href="/our-cars/modified-cars-for-sale" className="text-gray-400 hover:text-red-400 transition-colors">
                    Modified Cars For Sale
                  </Link>
                </li>
                <li>
                  <Link href="/our-cars/luxury-supercars-for-sale" className="text-gray-400 hover:text-red-400 transition-colors">
                    Luxury & Supercars For Sale
                  </Link>
                </li>
                <li>
                  <Link href="/our-cars/used-cars-for-sale" className="text-gray-400 hover:text-red-400 transition-colors">
                    Used Cars For Sale
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-red-400 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Services</h3>
              <ul className="space-y-2">
              <li>
                  <Link href="/mot-check" className="text-gray-400 hover:text-red-400 transition-colors">
                    Mot Check
                  </Link>
                </li>
                <li>
                  <Link href="/services/finance" className="text-gray-400 hover:text-red-400 transition-colors">
                    Car Finance
                  </Link>
                </li>
                <li>
                  <Link href="/services/part-exchange" className="text-gray-400 hover:text-red-400 transition-colors">
                    Part Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-red-400 transition-colors">
                    FAQs
                  </Link>
                </li>

                <li>
                  <Link href="/dealerships" className="text-gray-400 hover:text-red-400 transition-colors">
                    Dealerships Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">74 Co-operative St, Stafford ST16 3DA</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <a 
                    href="tel:+447306657000" 
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    suppressHydrationWarning
                  >
                    +44 7306 657 000
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <a 
                    href="mailto:info@asmperformancecars.co.uk" 
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    suppressHydrationWarning
                  >
                    info@asmperformancecars.co.uk
                  </a>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-gray-400">
                    <p>Mon-Sat: 9:00 AM - 18:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Advertisement */}
          <div className="mt-10 border-t border-gray-800">
            <FooterAd />
          </div>

          {/* Newsletter */}
          <div className="mt-8 pt-2">
            <div className="flex flex-col md:items-start justify-between">
              <div className="mb-6 lg:mb-4">
                <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400">Stay updated with the latest vehicles and offers</p>
              </div>
              
              {isSubmitted ? (
                <div className="bg-green-900/20 border border-green-700 text-green-400 rounded-lg p-4 w-full">
                  Thank you for subscribing! You'll receive our latest updates soon.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="w-full md:max-w-none space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full lg:w-1/3"
                    disabled={isLoading}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full lg:w-1/3"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 rounded-full w-full lg:w-1/3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : "Subscribe"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 border-t border-gray-800 pt-8 text-gray-400 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p suppressHydrationWarning>© {new Date().getFullYear()} ASM Performance Cars. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy-policy" className="hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/cookie-policy" className="hover:text-red-400 transition-colors">
                  Cookie Policy
                </Link>
                <Link href="/terms-conditions" className="hover:text-red-400 transition-colors">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 