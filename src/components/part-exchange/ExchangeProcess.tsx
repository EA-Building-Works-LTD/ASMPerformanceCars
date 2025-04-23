"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ProcessStep {
  title: string
  description?: unknown[] // Portable Text content
  icon?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
}

interface ExchangeProcessProps {
  title: string
  subtitle?: string
  steps: ProcessStep[]
  ctaText?: string
  ctaUrl?: string
}

export const ExchangeProcess: React.FC<ExchangeProcessProps> = ({
  title,
  subtitle,
  steps = [],
  ctaText,
  ctaUrl
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="relative mt-16">
          {/* Process Timeline */}
          <div className="hidden md:block absolute left-1/2 top-0 h-[calc(100%-120px)] w-1 bg-red-600 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const imageUrl = step.icon?.asset?._ref
                ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${step.icon.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
                : ''
              
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className={`md:flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="md:w-1/2 p-6">
                    <div className={`md:max-w-md ${isEven ? 'md:ml-auto mr-4' : 'md:mr-auto ml-4'}`}>
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 ml-4">{step.title}</h3>
                      </div>
                      {step.description && (
                        <div className="text-gray-600 mt-2">
                          <PortableText value={step.description} components={portableTextComponents} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 top-0 w-5 h-5 bg-red-600 rounded-full transform -translate-x-1/2 mt-[calc(2rem+2px)]"></div>
                  
                  <div className="md:w-1/2 p-6">
                    {step.icon && (
                      <div className={`relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg ${isEven ? 'md:mr-auto' : 'md:ml-auto'} max-w-md`}>
                        <Image
                          src={imageUrl}
                          alt={step.icon.alt || step.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* CTA Button */}
          {ctaText && (
            <div className="mt-16 pt-12 text-center relative z-10">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg"
                onClick={() => {
                  if (ctaUrl?.startsWith('#')) {
                    const element = document.getElementById(ctaUrl.substring(1))
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  } else if (ctaUrl) {
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