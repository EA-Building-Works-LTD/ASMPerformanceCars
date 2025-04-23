"use client"

import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface FAQ {
  question: string
  answer: any
}

interface FinanceFAQProps {
  title: string
  subtitle?: string
  faqs: FAQ[]
}

export const FinanceFAQ: React.FC<FinanceFAQProps> = ({
  title,
  subtitle,
  faqs
}) => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button 
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0 text-gray-400">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="mt-3 prose prose-sm text-gray-600">
                  <PortableText value={faq.answer} components={portableTextComponents} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 