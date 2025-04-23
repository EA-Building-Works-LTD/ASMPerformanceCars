"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { Button } from '@/components/ui/button'

interface CTAButton {
  text?: string
  url?: string
}

interface ExchangeCTAProps {
  title: string
  content?: unknown[] // Portable Text content
  primaryButton?: CTAButton
  secondaryButton?: CTAButton
  backgroundColor?: string
}

export const ExchangeCTA: React.FC<ExchangeCTAProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  backgroundColor = 'bg-red-600'
}) => {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          
          {content && (
            <div className="mb-8 prose prose-invert max-w-none">
              <PortableText value={content} components={portableTextComponents} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {primaryButton?.text && (
              <Button
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={() => {
                  if (primaryButton.url) {
                    window.location.href = primaryButton.url
                  }
                }}
              >
                {primaryButton.text}
              </Button>
            )}
            
            {secondaryButton?.text && (
              <Button
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={() => {
                  if (secondaryButton.url) {
                    window.location.href = secondaryButton.url
                  }
                }}
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 