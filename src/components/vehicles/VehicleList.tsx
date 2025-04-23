"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Calendar, Fuel, Gauge, Info } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'

// Define a proper type for vehicles
interface VehicleType {
  _id?: string;
  _type: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage?: any;
  year?: string;
  price?: number;
  priceOnApplication?: boolean;
  extendedInfo?: string;
  highlightedSpec?: string;
  featured?: boolean;
  badges?: string[];
  specifications?: {
    vehicle?: {
      engineSize?: string;
      fuelType?: string;
      transmission?: string;
      doors?: string;
      status?: string;
      year?: string;
    };
    history?: {
      mileage?: number;
    };
  };
  mileage?: number;
}

// Helper function to get the correct URL path based on vehicle type
function getVehicleUrl(vehicle: VehicleType) {
  // Check the vehicle type and return the appropriate URL path
  if (vehicle._type === 'modifiedVehicle') {
    return `/our-cars/modified-cars-for-sale/${vehicle.slug.current}`;
  } else if (vehicle._type === 'luxuryVehicle') {
    return `/our-cars/luxury-supercars-for-sale/${vehicle.slug.current}`;
  } else if (vehicle._type === 'vehicle') {
    return `/our-cars/used-cars-for-sale/${vehicle.slug.current}`;
  }
  
  // Fallback to the new URL structure using modified as default
  // This ensures we don't break if a vehicle type can't be determined
  return `/our-cars/modified-cars-for-sale/${vehicle.slug.current}`;
}

// Import StatusBadge from VehicleDetail
function StatusBadge({ status }: { status: string }) {
  let bgColor = ''
  let textColor = ''
  let displayText = status
  
  // Convert to lowercase for case-insensitive comparison
  const statusLower = status.toLowerCase()

  if (statusLower === 'in stock' || statusLower === 'available') {
    bgColor = 'bg-green-100 hover:bg-green-200'
    textColor = 'text-green-800'
    displayText = 'In Stock'
  } 
  else if (statusLower === 'sold') {
    bgColor = 'bg-red-100 hover:bg-red-200'
    textColor = 'text-red-800'
    displayText = 'Sold'
  } 
  else if (statusLower === 'pending collection' || statusLower === 'pending-collection') {
    bgColor = 'bg-yellow-100 hover:bg-yellow-200'
    textColor = 'text-yellow-800'
    displayText = 'Pending Collection'
  } 
  else if (statusLower === 'coming soon' || statusLower === 'coming-soon') {
    // Orange color for Coming Soon status
    bgColor = 'bg-red-600 hover:bg-red-700'
    textColor = 'text-white'
    displayText = 'Coming Soon'
  } 
  else if (statusLower === 'reserved') {
    bgColor = 'bg-purple-100 hover:bg-purple-200'
    textColor = 'text-purple-800'
    displayText = 'Reserved'
  } 
  else {
    bgColor = 'bg-gray-100 hover:bg-gray-200'
    textColor = 'text-gray-800'
  }

  return (
    <span className={`inline-flex items-center rounded-md ${bgColor} px-2.5 py-0.5 text-sm font-medium ${textColor} transition-colors`}>
      {displayText}
    </span>
  )
}

interface VehicleListProps {
  vehicles: VehicleType[]
}

const VehicleCard = ({ vehicle }: { vehicle: VehicleType }) => {
  // Create default badges from vehicle attributes if no badges provided
  const defaultBadges = []
  if (vehicle.featured) defaultBadges.push('Featured')
  if (vehicle._type === 'modifiedVehicle') defaultBadges.push('Modified')
  if (vehicle._type === 'luxuryVehicle') defaultBadges.push('Luxury')
  
  // Use optional chaining for badges access
  const displayBadges = vehicle.badges && vehicle.badges.length > 0 ? vehicle.badges : defaultBadges
  
  // Helper function to convert to title case
  const toTitleCase = (text: string) => {
    if (!text) return '';
    return text.replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  };
  
  // Get engine size, fuel type, transmission, and doors
  const engineSize = vehicle.specifications?.vehicle?.engineSize || '';
  const fuelType = vehicle.specifications?.vehicle?.fuelType || '';
  const transmission = vehicle.specifications?.vehicle?.transmission || '';
  const doors = vehicle.specifications?.vehicle?.doors || '';
  
  // Extract year and mileage
  const year = vehicle.year || vehicle.specifications?.vehicle?.year || '';
  const mileage = (vehicle.mileage || vehicle.specifications?.history?.mileage)?.toLocaleString() || '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      style={{ 
        height: '100%',
        width: '100%',
        display: 'block'
      }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-lg rounded-lg bg-black">
        <div className="relative h-64 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {/* Display status badge if available */}
            {vehicle.specifications?.vehicle?.status && (
              <StatusBadge status={vehicle.specifications.vehicle.status} />
            )}
            
            {/* Display other badges */}
            {displayBadges && displayBadges.map((badge: string, idx: number) => (
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
                  .width(800)
                  .height(600)
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
          <h3 className="text-xl font-bold mb-1">{toTitleCase(vehicle.title)}</h3>
          
          {/* Extended Info section */}
          {vehicle.extendedInfo && (
            <p className="text-sm text-gray-300 mb-2">{toTitleCase(vehicle.extendedInfo)}</p>
          )}
          
          {/* Highlighted specs section */}
          {vehicle.highlightedSpec && (
            <div className="flex flex-wrap gap-1 mb-3">
              {vehicle.highlightedSpec.split('|').map((spec: string, index: number) => (
                <span 
                  key={index}
                  className="inline-flex items-center bg-red-600/20 text-red-400 px-2 py-0.5 rounded-sm text-xs"
                >
                  {toTitleCase(spec.trim())}
                </span>
              ))}
            </div>
          )}
          
          {/* Vehicle details with icons in a more compact row */}
          <div className="grid grid-cols-3 gap-3 mt-2">
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
            {transmission && (
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-300">{toTitleCase(transmission)}</span>
              </div>
            )}
            {doors && (
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 3v18h14V3H5zm9 11h-4v-2h4v2z"
                  />
                </svg>
                <span className="text-xs text-gray-300">{doors}dr</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-0">
          <div className="w-full flex">
            <div className="flex-grow p-4 font-bold text-2xl text-white">
              {vehicle.priceOnApplication ? (
                <span>POA</span>
              ) : (
                <>£{vehicle.price?.toLocaleString()}</>
              )}
            </div>
            <Button asChild className="rounded-none h-auto py-4 px-6 bg-red-600 hover:bg-red-700">
              <Link href={getVehicleUrl(vehicle)}>
                View now
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export const VehicleList = ({ vehicles }: VehicleListProps) => {
  if (!vehicles || vehicles.length === 0) {
    return <p className="text-center py-12">No vehicles found.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle, index) => (
        <VehicleCard key={vehicle._id || index} vehicle={vehicle} />
      ))}
    </div>
  )
} 