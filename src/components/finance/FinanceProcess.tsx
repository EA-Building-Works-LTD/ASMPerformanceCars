import React from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface ProcessStep {
  stepNumber: number
  title: string
  description: any
  icon?: {
    asset: {
      _ref: string
    }
  }
}

interface FinanceProcessProps {
  title: string
  subtitle?: string
  steps: ProcessStep[]
}

export const FinanceProcess: React.FC<FinanceProcessProps> = ({
  title,
  subtitle,
  steps
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-red-100 z-0"></div>
            
            {/* Steps */}
            <div className="space-y-12 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Step number circle - centered for all viewports */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg z-10 mx-auto md:mx-0">
                    {step.stepNumber}
                  </div>
                  
                  {/* Content - takes full width on mobile, half width on desktop */}
                  <div className={`flex-1 bg-gray-50 p-6 rounded-xl shadow-sm ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} md:w-[calc(50%-2rem)]`}>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <div className="prose prose-sm text-gray-600">
                      <PortableText value={step.description} components={portableTextComponents} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a href="#calculator" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Start Your Finance Application Today
          </a>
        </div>
      </div>
    </section>
  )
} 