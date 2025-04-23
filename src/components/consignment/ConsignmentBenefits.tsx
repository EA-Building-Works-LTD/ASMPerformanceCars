"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface Benefit {
  title: string
  description: any
  icon?: any
}

interface ConsignmentBenefitsProps {
  title: string
  subtitle?: string
  benefits: Benefit[]
  backgroundType?: 'white' | 'color'
  backgroundColor?: string
}

export const ConsignmentBenefits: React.FC<ConsignmentBenefitsProps> = ({
  title,
  subtitle,
  benefits,
  backgroundType = 'white',
  backgroundColor = 'bg-gray-100'
}) => {
  const bgColor = backgroundType === 'white' ? 'bg-white' : backgroundColor || 'bg-gray-100'
  const textColor = backgroundType === 'white' ? 'text-gray-900' : 'text-white'

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>{title}</h2>
          {subtitle && (
            <p className={`text-xl max-w-3xl mx-auto ${backgroundType === 'white' ? 'text-gray-600' : 'text-gray-200'}`}>
              {subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-lg ${backgroundType === 'white' ? 'bg-white shadow-lg' : 'bg-opacity-10 bg-white'}`}
            >
              <h3 className={`text-xl font-bold ${textColor} mb-3`}>{benefit.title}</h3>
              <div className={`prose ${backgroundType === 'white' ? 'text-gray-700' : 'text-gray-200'} prose-sm max-w-none`}>
                <PortableText value={benefit.description} components={portableTextComponents} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 