"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

interface Benefit {
  title: string
  description?: unknown[] // Portable Text content
  icon?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
}

interface ExchangeBenefitsProps {
  title: string
  subtitle?: string
  benefits: Benefit[]
  backgroundType?: 'color' | 'white'
  backgroundColor?: string
}

export const ExchangeBenefits: React.FC<ExchangeBenefitsProps> = ({
  title,
  subtitle,
  benefits = [],
  backgroundType = 'white',
  backgroundColor = 'bg-gray-100'
}) => {
  const bgClass = backgroundType === 'white' ? 'bg-white' : backgroundColor

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, index) => {
            const imageUrl = benefit.icon?.asset?._ref
              ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${benefit.icon.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
              : ''

            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white transition-transform hover:scale-105"
              >
                <div className="mb-4">
                  {benefit.icon ? (
                    <div className="relative w-16 h-16 mx-auto">
                      <Image
                        src={imageUrl}
                        alt={benefit.icon.alt || benefit.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <CheckCircle className="w-14 h-14 text-red-600 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                {benefit.description && (
                  <div className="text-gray-600 prose-sm">
                    <PortableText value={benefit.description} components={portableTextComponents} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 