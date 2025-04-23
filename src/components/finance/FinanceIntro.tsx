import React from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface FinanceIntroProps {
  title: string
  content: any
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  imagePosition?: 'left' | 'right'
  stats?: {
    value: string
    label: string
  }[]
}

export const FinanceIntro: React.FC<FinanceIntroProps> = ({
  title,
  content,
  image,
  imagePosition = 'right',
  stats
}) => {
  const imageUrl = image?.asset?._ref
    ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
    : null

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col md:flex-row items-center gap-12",
          imagePosition === 'left' ? 'md:flex-row-reverse' : ''
        )}>
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              <PortableText value={content} components={portableTextComponents} />
            </div>

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="flex-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={imageUrl}
                  alt={image?.alt || title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 