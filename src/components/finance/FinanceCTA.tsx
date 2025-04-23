"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

interface FinanceCTAProps {
  title: string
  subtitle?: string
  content?: any
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  backgroundColor?: 'red' | 'gray' | 'black'
}

export const FinanceCTA: React.FC<FinanceCTAProps> = ({
  title,
  subtitle,
  content,
  primaryButtonText = 'Find out more',
  primaryButtonUrl = '/our-cars/modified-cars-for-sale',
  secondaryButtonText = 'Calculate your payments',
  secondaryButtonUrl = '#calculator',
  backgroundColor = 'red'
}) => {
  return (
    <section className="relative bg-red-600 py-16 md:py-24 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-90"></div>
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
            {content && (
              <div className="prose prose-lg prose-invert max-w-2xl mx-auto">
                {content}
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              {primaryButtonText && primaryButtonUrl && (
                <a 
                  href={primaryButtonUrl} 
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 cursor-pointer"
                  >
                    {primaryButtonText}
                  </Button>
                </a>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <a 
                  href={secondaryButtonUrl} 
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-white text-white hover:bg-white/10 cursor-pointer"
                  >
                    {secondaryButtonText}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 