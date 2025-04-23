"use client"

import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

interface FAQ {
  question: string
  answer: any
}

interface ConsignmentFAQProps {
  title: string
  subtitle?: string
  faqs: FAQ[]
}

export const ConsignmentFAQ: React.FC<ConsignmentFAQProps> = ({
  title,
  subtitle,
  faqs
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  
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

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <span className="ml-6 flex-shrink-0 text-gray-500">
                    {openIndex === index ? (
                      <ChevronUpIcon className="h-6 w-6" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6" />
                    )}
                  </span>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="prose text-gray-700 max-w-none">
                      <PortableText value={faq.answer} components={portableTextComponents} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 