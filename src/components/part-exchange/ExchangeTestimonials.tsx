"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  name: string
  quote?: string
  exchangedCar?: string
  purchasedCar?: string
  rating?: number
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
}

interface ExchangeTestimonialsProps {
  title: string
  subtitle?: string
  testimonials: Testimonial[]
}

export const ExchangeTestimonials: React.FC<ExchangeTestimonialsProps> = ({
  title,
  subtitle,
  testimonials = []
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Image */}
              <div className="relative md:col-span-2 h-64 md:h-auto">
                {testimonials[activeIndex].image?.asset?._ref ? (
                  <Image
                    src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${testimonials[activeIndex].image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                    alt={testimonials[activeIndex].image.alt || testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl font-bold">
                      {testimonials[activeIndex].name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-8 flex flex-col justify-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (testimonials[activeIndex].rating || 5)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl italic text-gray-700 mb-6">
                  "{testimonials[activeIndex].quote}"
                </blockquote>

                <div className="mb-4">
                  <p className="font-bold text-gray-900">{testimonials[activeIndex].name}</p>
                  {(testimonials[activeIndex].exchangedCar || testimonials[activeIndex].purchasedCar) && (
                    <p className="text-sm text-gray-600 mt-1">
                      {testimonials[activeIndex].exchangedCar && (
                        <span>Exchanged: {testimonials[activeIndex].exchangedCar}</span>
                      )}
                      {testimonials[activeIndex].exchangedCar && testimonials[activeIndex].purchasedCar && (
                        <span> | </span>
                      )}
                      {testimonials[activeIndex].purchasedCar && (
                        <span>Purchased: {testimonials[activeIndex].purchasedCar}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Pagination indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? 'bg-red-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 