"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { Button } from '@/components/ui/button'

interface ProcessStep {
  stepNumber: number
  title: string
  description: any
  icon?: any
}

interface ConsignmentProcessProps {
  title: string
  subtitle?: string
  steps: ProcessStep[]
  ctaText?: string
  ctaUrl?: string
}

export const ConsignmentProcess: React.FC<ConsignmentProcessProps> = ({
  title,
  subtitle,
  steps,
  ctaText,
  ctaUrl
}) => {
  // Sort steps by stepNumber to ensure they display in the correct order
  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber)
  
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

        <div className="relative mt-12">
          {/* Timeline Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-0 bottom-16 left-1/2 w-1 bg-red-600 transform -translate-x-1/2"></div>
          
          {/* Steps */}
          <div className="space-y-16">
            {sortedSteps.map((step, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center md:items-start`}
              >
                {/* Step Number Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full text-xl font-bold z-10 relative md:mx-auto mb-4">
                    {step.stepNumber}
                  </div>
                </div>
                
                {/* Content Box */}
                <div className={`w-full md:w-5/12 p-6 bg-white rounded-lg shadow-lg mt-6 md:mt-0 ${index % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto'}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <div className="prose text-gray-700 max-w-none">
                    <PortableText value={step.description} components={portableTextComponents} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          {ctaText && ctaUrl && (
            <div className="text-center mt-16 relative z-10">
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 