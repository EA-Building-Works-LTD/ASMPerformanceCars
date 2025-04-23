"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { Button } from '@/components/ui/button'

interface ConsignmentCTAProps {
  title: string
  content?: any
  buttonText?: string
  buttonUrl?: string
  backgroundColor?: string
}

export const ConsignmentCTA: React.FC<ConsignmentCTAProps> = ({
  title,
  content,
  buttonText = "Contact Us",
  buttonUrl = "/contact",
  backgroundColor = 'bg-red-600'
}) => {
  const isDarkBackground = backgroundColor === 'bg-red-600' || backgroundColor === 'bg-gray-800'
  const textColor = isDarkBackground ? 'text-white' : 'text-gray-900'
  
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-6`}>{title}</h2>
          
          {content && (
            <div className={`prose max-w-none ${isDarkBackground ? 'text-gray-200' : 'text-gray-700'} mb-8`}>
              <PortableText value={content} components={portableTextComponents} />
            </div>
          )}
          
          {buttonText && buttonUrl && (
            <Button
              className={`${isDarkBackground ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-red-600 text-white hover:bg-red-700'} px-8 py-3 rounded-full text-lg shadow-lg`}
              onClick={() => {
                if (buttonUrl.startsWith('#')) {
                  const element = document.getElementById(buttonUrl.substring(1))
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                } else {
                  window.location.href = buttonUrl
                }
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
} 