"use client"

import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  question: string
  answer?: unknown[] // Portable Text content
}

interface ExchangeFAQProps {
  title: string
  subtitle?: string
  faqs: FAQ[]
}

export const ExchangeFAQ: React.FC<ExchangeFAQProps> = ({
  title,
  subtitle,
  faqs = []
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-4 md:p-6 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="flex-shrink-0 w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="flex-shrink-0 w-6 h-6 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 md:p-6 bg-white">
                  {faq.answer ? (
                    <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-li:text-gray-700">
                      <PortableText value={faq.answer} components={portableTextComponents} />
                    </div>
                  ) : (
                    <p className="text-gray-700">No answer provided.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 