"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'

interface CallToActionProps {
  cta?: any
}

// Default CTA content if none is provided from Sanity
const defaultCta = {
  title: 'Ready to Purchase your Modified Car?',
  description: 'Whether you\'re looking for a modified car for sale, luxury supercar, or specialist advice, our team is ready to help you find the perfect vehicle to suit your needs.',
  primaryButtonText: 'View Our Modified Cars',
  primaryButtonLink: '/our-cars/modified-cars-for-sale',
  primaryButtonIcon: 'Car',
  secondaryButtonText: 'Contact Us',
  secondaryButtonLink: '/contact',
  secondaryButtonIcon: 'PhoneCall',
  stats: [
    { value: '100+', label: 'Modified Vehicles Sold' },
    { value: '10+', label: 'Years Experience' },
    { value: '100+', label: 'Happy Customers' },
    { value: '24/7', label: 'Customer Support' },
  ]
}

export const CallToAction = ({ cta }: CallToActionProps) => {
  // Use Sanity CTA or fallback to default
  const ctaData = cta || defaultCta
  
  // Dynamically get icons from Lucide
  const PrimaryIcon = ctaData.primaryButtonIcon ? (LucideIcons as any)[ctaData.primaryButtonIcon] || LucideIcons.Car : LucideIcons.Car
  const SecondaryIcon = ctaData.secondaryButtonIcon ? (LucideIcons as any)[ctaData.secondaryButtonIcon] || LucideIcons.PhoneCall : LucideIcons.PhoneCall
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {ctaData.backgroundImage ? (
          <Image
            src={urlForImage(ctaData.backgroundImage).url()}
            alt="Background"
            fill
            className="object-cover brightness-[0.25]"
            priority
          />
        ) : (
          <Image
            src="/images/Modifed car for sale CTA.jpg"
            alt="Performance & Luxury Cars"
            fill
            className="object-cover brightness-[0.25]"
            priority
          />
        )}
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {ctaData.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {ctaData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {ctaData.primaryButtonText && (
                <Button 
                  asChild
                  size="lg" 
                  className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Link href={ctaData.primaryButtonLink} className="flex items-center gap-2">
                    <PrimaryIcon className="w-5 h-5" />
                    {ctaData.primaryButtonText}
                  </Link>
                </Button>
              )}
              
              {ctaData.secondaryButtonText && (
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                  <Link href={ctaData.secondaryButtonLink} className="flex items-center gap-2">
                    <SecondaryIcon className="w-5 h-5" />
                    {ctaData.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
            
            {ctaData.stats && ctaData.stats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {ctaData.stats.map((stat: unknown, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-3xl md:text-5xl font-bold text-red-500">{stat.value}</span>
                      <span className="text-sm md:text-base mt-2 text-gray-300">{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 