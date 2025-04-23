"use client"

import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface SaleMethod {
  method: string
  pros?: string[]
  cons?: string[]
  description?: any
}

interface ConsignmentComparisonProps {
  title: string
  subtitle?: string
  methods: SaleMethod[]
}

export const ConsignmentComparison: React.FC<ConsignmentComparisonProps> = ({
  title,
  subtitle,
  methods
}) => {
  const [activeMethodIndex, setActiveMethodIndex] = useState(0)
  
  return (
    <section className="py-16 bg-white">
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

        {/* Method Tabs */}
        <div className="flex flex-wrap justify-center mb-8 border-b">
          {methods.map((method, index) => (
            <button
              key={index}
              className={`px-6 py-3 text-lg font-medium transition-colors duration-200 ${
                activeMethodIndex === index
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-red-500'
              }`}
              onClick={() => setActiveMethodIndex(index)}
            >
              {method.method}
            </button>
          ))}
        </div>

        {/* Active Method Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {methods[activeMethodIndex].method}
          </h3>
          
          {methods[activeMethodIndex].description && (
            <div className="prose text-gray-700 max-w-none mb-8">
              <PortableText value={methods[activeMethodIndex].description} components={portableTextComponents} />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pros */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-green-800 mb-4">Advantages</h4>
              {methods[activeMethodIndex].pros && methods[activeMethodIndex].pros.length > 0 ? (
                <ul className="space-y-3">
                  {methods[activeMethodIndex].pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 mr-2 mt-1">
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      </span>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No specific advantages listed.</p>
              )}
            </div>
            
            {/* Cons */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-red-800 mb-4">Considerations</h4>
              {methods[activeMethodIndex].cons && methods[activeMethodIndex].cons.length > 0 ? (
                <ul className="space-y-3">
                  {methods[activeMethodIndex].cons.map((con, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 mr-2 mt-1">
                        <XMarkIcon className="h-5 w-5 text-red-600" />
                      </span>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No specific considerations listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 