"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'

interface HeroProps {
  slides?: unknown[]
}

// Fallback slide if no slides are available from Sanity
const fallbackSlide = {
  id: 'fallback',
  title: 'Welcome to ASM Performance Cars',
  subtitle: 'Discover our collection of premium vehicles',
  textColor: 'white',
  overlayColor: 'rgba(0,0,0,0.4)',
  textAlignment: 'center',
  textPosition: 'middle',
  animation: 'fade',
  active: true,
}

export const Hero = ({ slides = [] }: HeroProps) => {
  // Use Sanity slides or fallback to a default slide
  const displaySlides = slides.length > 0 ? slides : [fallbackSlide]
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
      }, 6000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoplay, displaySlides.length])

  const handlePrev = () => {
    setAutoplay(false)
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
  }

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.8 } },
          exit: { opacity: 0, transition: { duration: 0.5 } },
        }
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
        }
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
          exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
        }
      case 'slideRight':
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
          exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
        }
      case 'zoomIn':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
          exit: { opacity: 0, scale: 1.1, transition: { duration: 0.5 } },
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.8 } },
          exit: { opacity: 0, transition: { duration: 0.5 } },
        }
    }
  }

  const getTextAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-left items-start'
      case 'right':
        return 'text-right items-end'
      default:
        return 'text-center items-center'
    }
  }

  const getTextPositionClass = (position: string) => {
    switch (position) {
      case 'top':
        return 'justify-start pt-24'
      case 'bottom':
        return 'justify-end pb-24'
      default:
        return 'justify-center'
    }
  }

  const slide = displaySlides[currentSlide]
  const textAlignmentClass = getTextAlignmentClass(slide.textAlignment)
  const textPositionClass = getTextPositionClass(slide.textPosition)
  const animationVariants = getAnimationVariants(slide.animation)

  return (
    <div className="relative h-[85vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide._id || slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 z-10" 
              style={{ backgroundColor: slide.overlayColor }}
            ></div>
            
            {/* Image */}
            <div className="absolute inset-0">
              {/* Desktop Image */}
              <div className="hidden md:block absolute inset-0">
                <div className="relative w-full h-full">
                  {slide.image ? (
                    <Image
                      src={urlForImage(slide.image).url()}
                      alt={slide.title}
                      fill
                      priority
                      quality={90}
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800"></div>
                  )}
                </div>
              </div>
              
              {/* Mobile Image */}
              <div className="block md:hidden absolute inset-0">
                <div className="relative w-full h-full">
                  {slide.mobileImage || slide.image ? (
                    <Image
                      src={urlForImage(slide.mobileImage || slide.image).url()}
                      alt={slide.title}
                      fill
                      priority
                      quality={85}
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className={`absolute inset-0 z-20 flex flex-col ${textPositionClass}`}>
              <div className="container mx-auto">
                <div className={`flex flex-col max-w-4xl ${textAlignmentClass} space-y-6 pl-16 md:pl-20`}>
                  <motion.h2
                    {...animationVariants}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`text-4xl md:text-6xl font-bold text-${slide.textColor}`}
                  >
                    {slide.title}
                  </motion.h2>
                  
                  <motion.div
                    {...animationVariants}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <p className={`text-xl md:text-2xl font-light mb-8 text-${slide.textColor} max-w-2xl`}>
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      {slide.buttonText && (
                        <Button 
                          asChild
                          className={`rounded-full ${slide.buttonStyle || 'bg-red-600 hover:bg-red-700 text-white'} px-8 py-6`}
                          size="lg"
                        >
                          <Link href={slide.buttonLink}>
                            {slide.buttonText}
                          </Link>
                        </Button>
                      )}
                      
                      {slide.secondaryButtonText && (
                        <Button 
                          asChild
                          variant="outline" 
                          className={`rounded-full border-2 ${slide.secondaryButtonStyle || `border-${slide.textColor} text-${slide.textColor} bg-transparent hover:bg-white/10`} px-8 py-6`}
                          size="lg"
                        >
                          <Link href={slide.secondaryButtonLink}>
                            {slide.secondaryButtonText}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Controls */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
          {displaySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAutoplay(false)
                setCurrentSlide(idx)
              }}
              className={`w-3 h-3 rounded-full ${
                currentSlide === idx ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Arrow Navigation */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
} 