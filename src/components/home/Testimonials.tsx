"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star, Quote, ExternalLink } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GOOGLE_REVIEWS_URL } from '@/lib/serverUtils'

interface TestimonialsProps {
  testimonials?: unknown[]
}

// Fallback testimonial for when no testimonials are provided
const fallbackTestimonial = {
  id: 'fallback-1',
  name: 'John Smith',
  location: 'Birmingham',
  rating: 5,
  testimonial: 'I had a fantastic experience purchasing my car from ASM Performance Cars. The team was knowledgeable and helped me find the perfect vehicle for my needs. The process was smooth and transparent throughout.',
  date: '3 months ago',
  source: 'local'
}

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
  
  return (
    <Card className="h-full border-zinc-700 shadow-lg overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-4">
          {testimonial.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={
                  testimonial.image.asset
                    ? urlForImage(testimonial.image).width(100).height(100).url()
                    : testimonial.image
                }
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
              {getInitials(testimonial.name)}
            </div>
          )}
          
          <div>
            <h4 className="font-bold text-lg">{testimonial.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              {testimonial.date && (
                <span className="ml-2 text-xs text-gray-500 self-center">{testimonial.date}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 w-6 h-6 text-red-200 dark:text-red-800 opacity-50" />
          <p className="pt-3 text-gray-700 dark:text-gray-300 italic">
            "{testimonial.testimonial}"
          </p>
        </div>
        
        {testimonial.carPurchased && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
            {testimonial.carImage && (
              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={urlForImage(testimonial.carImage).url()}
                  alt={testimonial.carPurchased}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vehicle Purchased</p>
              <p className="text-sm font-medium">{testimonial.carPurchased}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
  // State to track if we're on the client side to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false)
  
  // Use provided testimonials or fallback to a default testimonial
  const displayTestimonials = testimonials.length > 0 ? testimonials : [fallbackTestimonial]
  
  // Count Google reviews to determine if we need the "See more" button
  const googleReviewCount = testimonials.filter(item => item.source === 'google').length
  const hasMoreGoogleReviews = googleReviewCount > 0 && testimonials.length > displayTestimonials.length
  
  const [api, setApi] = useState<any>(null)
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(1)
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!api) return
    
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it — hear from our satisfied customers about their experiences with ASM Performance Cars.
          </p>
        </div>
        
        <div className="opacity-0 animate-fade-in">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {displayTestimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial._id || testimonial.id || `testimonial-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-8 gap-4">
              <CarouselPrevious className="static transform-none bg-red-600 hover:bg-red-700 text-white" />
              <span className="text-sm text-gray-300">
                {isClient ? `${current} / ${count}` : ''}
              </span>
              <CarouselNext className="static transform-none bg-red-600 hover:bg-red-700 text-white" />
            </div>
          </Carousel>
          
          {/* "See more reviews" button - only appears when we have Google reviews and we're client-side */}
          {isClient && googleReviewCount > 0 && (
            <div className="mt-10 text-center">
              <a 
                href={GOOGLE_REVIEWS_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 hover:bg-gray-100 transition-colors px-6 py-3 rounded-full font-medium"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.28 12c0-.74-.07-1.45-.2-2.13H12v4.03h5.75a4.9 4.9 0 01-2.13 3.23v2.67h3.45c2.02-1.86 3.18-4.6 3.18-7.8z" fill="#4285F4" />
                  <path d="M12 23c2.88 0 5.3-.96 7.07-2.6l-3.45-2.67c-.96.64-2.18 1.02-3.62 1.02-2.78 0-5.14-1.88-5.98-4.4H2.48v2.76A10.97 10.97 0 0012 23z" fill="#34A853" />
                  <path d="M6.02 14.35c-.22-.65-.34-1.34-.34-2.05s.12-1.4.34-2.05V7.49H2.48A10.97 10.97 0 001 12c0 1.77.43 3.44 1.18 4.93l3.84-2.58z" fill="#FBBC05" />
                  <path d="M12 5.55c1.57 0 2.97.54 4.08 1.59l3.06-3.06C17.17 2.27 14.76 1.3 12 1.3 8.13 1.3 4.75 3.6 2.98 7.05l3.54 2.76c.84-2.52 3.2-4.4 5.98-4.4z" fill="#EA4335" />
                </svg>
                See What Our Customers Are Saying on Google
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
          
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .container > div:first-child {
          animation-delay: 0s;
        }
        .container > div:last-child {
          animation-delay: 0.2s;
        }
      `}</style>
    </section>
  )
}