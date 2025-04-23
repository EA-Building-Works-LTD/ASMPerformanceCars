"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/solid'

interface Testimonial {
  name: string
  quote: string
  soldCar?: string
  rating?: number
  image?: any
}

interface ConsignmentTestimonialsProps {
  title: string
  subtitle?: string
  testimonials: Testimonial[]
}

export const ConsignmentTestimonials: React.FC<ConsignmentTestimonialsProps> = ({
  title,
  subtitle,
  testimonials
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Only show pagination if we have multiple testimonials
  const showPagination = testimonials.length > 1
  
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }
  
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Current Testimonial */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
            <div className="absolute -top-5 left-10 h-10 w-10 transform rotate-45 bg-white"></div>
            
            <div className="flex flex-col items-center text-center">
              {/* Quote */}
              <p className="text-lg md:text-xl text-gray-700 italic mb-6">"{testimonials[activeIndex].quote}"</p>
              
              {/* Rating Stars */}
              {testimonials[activeIndex].rating && (
                <div className="flex mb-4">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              )}
              
              {/* Customer Info */}
              <div className="mt-4">
                <p className="font-bold text-lg text-gray-900">{testimonials[activeIndex].name}</p>
                {testimonials[activeIndex].soldCar && (
                  <p className="text-gray-600">Sold: {testimonials[activeIndex].soldCar}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {showPagination && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-3 h-3 rounded-full ${activeIndex === idx ? 'bg-red-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 