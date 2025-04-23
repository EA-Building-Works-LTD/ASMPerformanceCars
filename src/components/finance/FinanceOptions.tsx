import React from 'react'
import { PortableText } from '@portabletext/react'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { portableTextComponents } from '@/lib/portableTextComponents'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface FinanceOption {
  title: string
  description: any
  icon?: {
    asset: {
      _ref: string
    }
  }
  highlights?: string[]
}

interface FinanceOptionsProps {
  title: string
  subtitle?: string
  options: FinanceOption[]
}

export const FinanceOptions: React.FC<FinanceOptionsProps> = ({
  title,
  subtitle,
  options
}) => {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                {option.icon?.asset?._ref ? (
                  <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                    <Image
                      src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${option.icon.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                      alt={option.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-red-600 text-xl font-bold">{option.title.charAt(0)}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{option.title}</h3>
              </div>
              
              <div className="prose prose-sm text-gray-600 mb-6 flex-grow">
                <PortableText value={option.description} components={portableTextComponents} />
              </div>
              
              {option.highlights && option.highlights.length > 0 && (
                <div className="mt-auto">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {option.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link href="/contact" className="inline-block">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg cursor-pointer">
              Get in touch
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 