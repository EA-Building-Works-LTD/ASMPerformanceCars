'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Gauge, Fuel, Info, Check } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'

// Helper function to convert strings to title case
const toTitleCase = (str: string): string => {
  if (!str) return ''
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Helper function to get vehicle URL based on type
const getVehicleUrl = (vehicle: any): string => {
  const slug = vehicle.slug?.current || vehicle.slug
  
  if (!slug) return '#'
  
  if (vehicle._type === 'modifiedVehicle') {
    return `/our-cars/modified-cars-for-sale/${slug}`
  } else if (vehicle._type === 'luxuryVehicle') {
    return `/our-cars/luxury-supercars-for-sale/${slug}`
  } else {
    return `/our-cars/used-cars-for-sale/${slug}`
  }
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-green-600'
  const text = toTitleCase(status)
  
  switch (status.toLowerCase()) {
    case 'available':
    case 'in stock':
      bgColor = 'bg-green-600 hover:bg-green-700'
      break
    case 'sold':
      bgColor = 'bg-red-600 hover:bg-red-700'
      break
    case 'reserved':
      bgColor = 'bg-amber-600 hover:bg-amber-700'
      break
    case 'coming soon':
      bgColor = 'bg-blue-600 hover:bg-blue-700'
      break
    default:
      bgColor = 'bg-gray-600 hover:bg-gray-700'
  }
  
  return (
    <Badge className={`${bgColor} text-white`}>
      {text}
    </Badge>
  )
}

interface RelatedVehicleCardProps {
  vehicle: any
}

const RelatedVehicleCard = ({ vehicle }: RelatedVehicleCardProps) => {
  // Extract vehicle specs
  const year = vehicle.year || vehicle.specifications?.vehicle?.year || ''
  const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : ''
  const fuelType = vehicle.fuelType || vehicle.specifications?.vehicle?.fuelType || ''
  const engineSize = vehicle.engineSize || vehicle.specifications?.vehicle?.engineSize || ''
  const transmission = vehicle.transmission || vehicle.specifications?.vehicle?.transmission || ''
  const doors = vehicle.doors || vehicle.specifications?.vehicle?.doors || ''

  // Determine which badges to display
  const displayBadges = []
  if (vehicle.featured) displayBadges.push('Featured')
  if (vehicle._type === 'modifiedVehicle') displayBadges.push('Modified')
  if (vehicle._type === 'luxuryVehicle') displayBadges.push('Luxury')
  if (vehicle.badges && Array.isArray(vehicle.badges)) {
    displayBadges.push(...vehicle.badges)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      style={{ height: '100%', width: '100%' }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-lg rounded-lg bg-black">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {/* Display status badge if available */}
            {vehicle.specifications?.vehicle?.status && (
              <StatusBadge status={vehicle.specifications.vehicle.status} />
            )}
            
            {/* Display other badges */}
            {displayBadges.length > 0 && displayBadges.map((badge: string, idx: number) => (
              <Badge 
                key={idx} 
                variant={idx === 0 ? "default" : "outline"}
                className={
                  idx === 0 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-white text-white bg-black/30 backdrop-blur-sm hover:bg-black/40"
                }
              >
                {badge}
              </Badge>
            ))}
          </div>
          <Link href={getVehicleUrl(vehicle)}>
            {vehicle.mainImage ? (
              <Image
                src={urlForImage(vehicle.mainImage)
                  .width(400)
                  .height(300)
                  .url()}
                alt={vehicle.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </Link>
        </div>
        
        <CardContent className="flex-grow p-4 text-white">
          {/* Main title from vehicle */}
          <h3 className="text-lg font-bold mb-1 line-clamp-1">{toTitleCase(vehicle.title)}</h3>
          
          {/* Extended Info section */}
          {vehicle.extendedInfo && (
            <p className="text-xs text-gray-300 mb-2 line-clamp-1">{toTitleCase(vehicle.extendedInfo)}</p>
          )}
          
          {/* Vehicle details with icons in a grid layout */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">{year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">{mileage}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">{toTitleCase(fuelType)}</span>
            </div>
            {engineSize && (
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-300">{engineSize}L</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-0">
          <div className="w-full flex">
            <div className="flex-grow p-3 font-bold text-xl text-white">
              {vehicle.priceOnApplication ? (
                <span>POA</span>
              ) : vehicle.price ? (
                <>£{vehicle.price.toLocaleString()}</>
              ) : (
                <span>Contact us</span>
              )}
            </div>
            <Button asChild className="rounded-none h-auto py-3 px-4 bg-red-600 hover:bg-red-700 text-sm">
              <Link href={getVehicleUrl(vehicle)}>
                View Details
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

interface RelatedVehiclesProps {
  vehicles: any[]
  title?: string
}

export const RelatedVehicles = ({ 
  vehicles, 
  title = "You May Also Like" 
}: RelatedVehiclesProps) => {
  if (!vehicles || vehicles.length === 0) return null

  return (
    <div className="py-12 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <div className="w-20 h-1 bg-red-600 mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <RelatedVehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  )
} 