"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortableText } from '@portabletext/react'
import { 
  Info, 
  Share2, 
  Facebook, 
  Linkedin,
  Copy,
  X,
  MessageCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon
} from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { EnquiryForm } from './EnquiryForm'
import { generateVehiclePDF } from '@/lib/pdf-generator'
import PartExchangeForm from '../forms/PartExchangeForm'
import { Input } from '@/components/ui/input'
import { ImageGallery } from './ImageGallery'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface Modification {
  category: string
  name: string
  description?: string
  brand?: string
  cost?: number
  images?: unknown[]
}

interface VehicleHistory {
  owners?: number
  serviceHistory?: string
  mot?: string
}

interface VehicleSpecifications {
  performance: {
    power: number
    originalPower?: number
    powerIncrease?: number
    stage?: string
    torque?: number
    acceleration?: number
    topSpeed?: number
  }
  vehicle: {
    make: string
    model: string
    year: number
    bodyType?: string
    transmission: string  // Used as gearbox in the UI
    fuelType: string
    engineSize?: string
    doors?: number
    color?: string
    status?: string
  }
  history: {
    mileage: number
    owners?: number
    serviceHistory?: string
    mot?: string
  }
  modifications: {
    items: Modification[]
    totalCost?: number
    warranty?: string
    dynoGraph?: any
  }
  features?: string[]
}

interface Vehicle {
  _id: string
  _type?: 'modifiedVehicle' | 'luxuryVehicle' | 'vehicle'
  title: string
  subtitle?: string
  extendedInfo?: string
  highlightedSpec?: string
  slug: { current: string }
  price: number
  description?: any
  mainImage: any
  galleryImages?: unknown[]
  gallery?: unknown[]  // Add gallery for compatibility
  badges?: string[]
  specifications?: VehicleSpecifications
  features?: string[]  // Add features property
  details?: {
    year: number
    mileage: number
    fuelType: string
    engineSize: string
  }
  rarity?: {
    limited: boolean
    limitedCount?: number
    editionNumber?: string
    specialEdition?: string
  }
  // ... other fields as needed
}

interface VehicleDetailProps {
  vehicle: Vehicle
}

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
    bgColor = 'bg-amber-500 hover:bg-amber-600'
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

export const VehicleDetail = ({ vehicle }: VehicleDetailProps) => {
  const [activeImage, setActiveImage] = useState(vehicle.mainImage)
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false)
  const [isPartExOpen, setIsPartExOpen] = useState(false)
  const [regNumber, setRegNumber] = useState('')
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const [fullScreenIndex, setFullScreenIndex] = useState(0)
  const [logoUrl, setLogoUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  
  // Extract gallery images
  const galleryImages = vehicle.galleryImages || []
  const allImages = [vehicle.mainImage, ...galleryImages].filter(Boolean)
  
  // Open fullscreen gallery with the current image
  const openFullScreenGallery = () => {
    setFullScreenIndex(allImages.indexOf(activeImage))
    setIsFullScreenOpen(true)
  }
  
  // Handle keyboard navigation for fullscreen gallery
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreenOpen) return
      
      if (e.key === 'ArrowLeft') {
        const currentIndex = allImages.indexOf(activeImage)
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length
        setActiveImage(allImages[prevIndex])
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allImages.indexOf(activeImage)
        const nextIndex = (currentIndex + 1) % allImages.length
        setActiveImage(allImages[nextIndex])
      } else if (e.key === 'Escape') {
        setIsFullScreenOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreenOpen, activeImage, allImages])
  
  // Swipe handlers for fullscreen gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isFullScreenOpen && setFullScreenIndex((prev) => (prev + 1) % allImages.length),
    onSwipedRight: () => isFullScreenOpen && setFullScreenIndex((prev) => (prev - 1 + allImages.length) % allImages.length),
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  // Share functionality
  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return

    const url = window.location.href
    const title = vehicle.title

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')
        break
      case 'copy':
        if (navigator?.clipboard) {
          navigator.clipboard.writeText(url)
        }
        break
    }
  }

  // Handle printing vehicle details
  const handlePrintDetails = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      if (typeof window === 'undefined') return;
      
      // Process main image URL
      const mainImageUrl = vehicle.mainImage ? urlForImage(vehicle.mainImage)
        .width(800)
        .url() : '';
      
      // Get all gallery images and process their URLs
      const galleryImages = vehicle.galleryImages || vehicle.gallery || [];
      const processedGalleryImages = galleryImages.map(img => 
        urlForImage(img as any)
          .width(800)
          .url()
      );

      // Get the absolute URL for the logo
      const logoUrl = new URL('/images/ASM Logo v2.png', window.location.origin).href;
      
      // Generate and download the PDF with all vehicle details
      await generateVehiclePDF({
        title: vehicle.title,
        price: vehicle.price.toString(),
        description: vehicle.description,
        images: processedGalleryImages,
        mainImage: mainImageUrl,
        specifications: vehicle.specifications || {},
        features: vehicle.features || [],
        highlightedSpec: vehicle.highlightedSpec,
        extendedInfo: vehicle.extendedInfo,
        logoUrl // Pass the logo URL
      });
    } catch (error) {
      console.error('Error in handlePrintDetails:', error);
    }
  }

  const handlePartExBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (regNumber.trim()) {
      setIsPartExOpen(true)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    setLogoUrl(new URL('/images/ASM Logo v2.png', window.location.origin).href)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setWhatsappUrl(`https://wa.me/447306657000?text=I'm interested in ${encodeURIComponent(vehicle.title)}. ${encodeURIComponent(window.location.href)}`)
  }, [vehicle.title])

  // Helper function to get breadcrumb items based on vehicle type
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: 'Home', href: '/' },
      { label: 'Our Cars', href: '/our-cars' }
    ];

    switch (vehicle._type) {
      case 'modifiedVehicle':
        return [
          ...baseItems,
          { label: 'Modified Cars For Sale', href: '/our-cars/modified-cars-for-sale' },
          { label: vehicle.title, href: '#', isCurrent: true }
        ];
      case 'luxuryVehicle':
        return [
          ...baseItems,
          { label: 'Luxury & Supercars For Sale', href: '/our-cars/luxury-supercars-for-sale' },
          { label: vehicle.title, href: '#', isCurrent: true }
        ];
      case 'vehicle':
        return [
          ...baseItems,
          { label: 'Used Cars For Sale', href: '/our-cars/used-cars-for-sale' },
          { label: vehicle.title, href: '#', isCurrent: true }
        ];
      default:
        return [...baseItems, { label: vehicle.title, href: '#', isCurrent: true }];
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="pt-2 sm:pt-4">
        <Breadcrumb items={getBreadcrumbItems()} className="mb-4" />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Left column - Images */}
        <div>
          {/* Main Image Preview with navigation arrows */}
          <div 
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-4 cursor-pointer bg-zinc-900"
          >
            {activeImage ? (
              <>
                <Image
                  src={urlForImage(activeImage)
                    .width(1200)
                    .height(800)
                    .url()}
                  alt={vehicle.title}
                  fill
                  priority
                  className="object-contain"
                  onClick={openFullScreenGallery}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {/* Navigation arrows for main image */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = allImages.indexOf(activeImage);
                    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                    setActiveImage(allImages[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = allImages.indexOf(activeImage);
                    const nextIndex = (currentIndex + 1) % allImages.length;
                    setActiveImage(allImages[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {vehicle.badges && vehicle.badges.map((badge: string, idx: number) => (
                <Badge 
                  key={idx} 
                  variant={idx === 0 ? "default" : "outline"}
                  className={
                    idx === 0 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-white text-white bg-black/30 backdrop-blur-sm hover:bg-black/40"
                  }
                >
                  {badge}
                </Badge>
              ))}
            </div>
            
            {/* Share buttons */}
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white/90">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                    <Facebook className="w-4 h-4 mr-2" />
                    <span>Share on Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                    <X className="w-4 h-4 mr-2" />
                    <span>Share on Twitter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')} className="cursor-pointer">
                    <Linkedin className="w-4 h-4 mr-2" />
                    <span>Share on LinkedIn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Share on WhatsApp</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Thumbnail grid */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image, idx) => (
                <button
                  key={idx}
                  className={`relative h-20 rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === image 
                      ? 'border-blue-600 opacity-100 ring-2 ring-blue-600/50' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={urlForImage(image)
                      .width(150)
                      .height(150)
                      .url()}
                    alt={`${vehicle.title} - view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Details */}
        <div>
          <div className="mb-5">
            {/* Status Badge moved above title */}
            {vehicle.specifications?.vehicle.status && (
              <div className="mb-3">
                <StatusBadge status={vehicle.specifications.vehicle.status} />
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold pr-3">{vehicle.title}</h1>
              <div className="text-2xl md:text-3xl font-bold text-red-600">£{vehicle.price?.toLocaleString()}</div>
            </div>
            
            {/* Extended model information */}
            {vehicle.extendedInfo && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{vehicle.extendedInfo}</p>
            )}
            
            {/* Highlighted specification */}
            {vehicle.highlightedSpec && (
              <div className="flex flex-wrap gap-2 mb-3">
                {vehicle.highlightedSpec.split('|').map((spec, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center bg-red-600/10 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {spec.trim()}
                  </span>
                ))}
              </div>
            )}
            
            {/* Existing subtitle */}
            {vehicle.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-400">{vehicle.subtitle}</p>
            )}
          </div>
          
          {/* Vehicle Overview Section */}
          {vehicle.specifications?.vehicle && (
            <div className="mb-8 bg-gray-50 dark:bg-zinc-900/60 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold capitalize flex items-center">
                  <Info className="w-5 h-5 mr-2 text-red-600" />
                  Specification
                </h2>
              </div>
              
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800">
                <div className="sm:pr-5">
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">MAKE</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.make}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">MODEL</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.model}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">YEAR</span>
                    </div>
                    <div className="w-2/3 font-semibold">{vehicle.specifications.vehicle.year}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">BODY TYPE</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.bodyType}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b sm:border-b-0 border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">ENGINE</span>
                    </div>
                    <div className="w-2/3 font-semibold">{vehicle.specifications.vehicle.engineSize}</div>
                  </div>
                </div>
                
                <div className="sm:pl-5">
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">GEARBOX</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.transmission}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">FUEL</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.fuelType}</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">MILEAGE</span>
                    </div>
                    <div className="w-2/3 font-semibold">{vehicle.specifications.history.mileage.toLocaleString()} miles</div>
                  </div>
                  
                  <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">POWER</span>
                    </div>
                    <div className="w-2/3 font-semibold">{vehicle.specifications.performance?.power}hp</div>
                  </div>
                  
                  <div className="flex items-center py-3">
                    <div className="w-1/3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">COLOR</span>
                    </div>
                    <div className="w-2/3 font-semibold uppercase">{vehicle.specifications.vehicle.color}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contact buttons */}
          <div className="grid grid-cols-1 gap-4 mb-8 bg-zinc-900 p-6 rounded-lg">
            <Button 
              size="lg" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
              onClick={() => setIsEnquiryFormOpen(true)}
            >
              ENQUIRE NOW VIA EMAIL
            </Button>
            
            {/* Enquiry Form */}
            <EnquiryForm 
              isOpen={isEnquiryFormOpen}
              onClose={() => setIsEnquiryFormOpen(false)}
              chosenVehicle={vehicle.title}
            />
            <div className="text-center text-gray-400 text-sm my-1">or call us on</div>
            <div className="text-center text-white text-2xl font-bold mb-4">07306 657 000</div>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="#" 
                className="text-center text-gray-300 text-sm border-b border-gray-700 hover:text-red-500 hover:border-red-500 transition-colors duration-200 pb-2 border-b-[0.5px]"
                onClick={handlePrintDetails}
              >
                <span>Print Details</span>
              </Link>
              <Link 
                href="#" 
                className="text-center text-gray-300 text-sm border-b border-gray-700 hover:text-red-500 hover:border-red-500 transition-colors duration-200 pb-2 border-b-[0.5px]"
              >
                <span>Request Finance Quote</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsPartExOpen(true)}
                className="text-center text-gray-300 text-sm border-b border-gray-700 hover:text-red-500 hover:border-red-500 transition-colors duration-200 pb-2 border-b-[0.5px]"
              >
                <span>Value Your Part Ex</span>
              </button>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-gray-300 text-sm border-b border-green-800 hover:text-green-500 hover:border-green-500 transition-colors duration-200 pb-2 border-b-[0.5px]"
              >
                <span>Enquire Via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for specifications, features, etc. */}
      <Tabs defaultValue="further-details" className="mb-12">
        <div className="bg-zinc-100 dark:bg-zinc-800/40 p-4 sm:p-6 rounded-xl shadow-sm">
          <TabsList className="w-full grid grid-cols-3 sm:flex sm:flex-row justify-start gap-1 bg-zinc-900 p-1 rounded-xl mb-4">
            <TabsTrigger 
              value="further-details" 
              className="capitalize data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300 py-2.5 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
            >
              Further Details
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="capitalize data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300 py-2.5 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
            >
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="finance" 
              className="capitalize data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300 py-2.5 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
            >
              Finance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="further-details" className="mt-6">
            {/* Description */}
            {vehicle.description && (
              <div className="mb-8">
                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                  <div className="border-b border-zinc-800 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                      Description
                    </h2>
                  </div>
                  <div className="px-6 py-5 prose dark:prose-invert prose-zinc max-w-none text-white">
                    <PortableText 
                      value={vehicle.description}
                      components={{
                        block: {
                          normal: ({children}) => <p className="text-white mb-4">{children}</p>,
                          h1: ({children}) => <h1 className="text-white text-2xl font-bold mb-4 mt-6">{children}</h1>,
                          h2: ({children}) => <h2 className="text-white text-xl font-bold mb-3 mt-5">{children}</h2>,
                          h3: ({children}) => <h3 className="text-white text-lg font-bold mb-3 mt-4">{children}</h3>,
                          h4: ({children}) => <h4 className="text-white text-base font-bold mb-2 mt-4">{children}</h4>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-300 my-4">{children}</blockquote>,
                        },
                        list: {
                          bullet: ({children}) => <ul className="list-disc pl-5 space-y-2 text-white mb-4">{children}</ul>,
                          number: ({children}) => <ol className="list-decimal pl-5 space-y-2 text-white mb-4">{children}</ol>,
                        },
                        listItem: {
                          bullet: ({children}) => <li className="text-white">{children}</li>,
                          number: ({children}) => <li className="text-white">{children}</li>,
                        },
                        marks: {
                          strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({children}) => <em className="italic text-white">{children}</em>,
                          link: ({children, value}) => <a href={value.href} className="text-red-500 hover:text-red-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {vehicle.specifications ? (
              <div className="grid grid-cols-1 gap-8">
                {/* History */}
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Vehicle History
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {vehicle.specifications.history.mileage && (
                          <div className="bg-zinc-800 rounded-lg p-4 transition-transform hover:scale-105">
                            <p className="text-gray-400 text-sm mb-1">Mileage</p>
                            <p className="text-white text-xl font-semibold">{vehicle.specifications.history.mileage.toLocaleString()} miles</p>
                          </div>
                        )}
                        
                        {vehicle.specifications.history.owners !== undefined && (
                          <div className="bg-zinc-800 rounded-lg p-4 transition-transform hover:scale-105">
                            <p className="text-gray-400 text-sm mb-1">Previous Owners</p>
                            <p className="text-white text-xl font-semibold">{vehicle.specifications.history.owners}</p>
                          </div>
                        )}
                        
                        {vehicle.specifications.history.serviceHistory && (
                          <div className="bg-zinc-800 rounded-lg p-4 transition-transform hover:scale-105">
                            <p className="text-gray-400 text-sm mb-1">Service History</p>
                            <p className="text-white text-xl font-semibold capitalize">{vehicle.specifications.history.serviceHistory.replace(/-/g, ' ')}</p>
                          </div>
                        )}
                        
                        {vehicle.specifications.history.mot && (
                          <div className="bg-zinc-800 rounded-lg p-4 transition-transform hover:scale-105">
                            <p className="text-gray-400 text-sm mb-1">MOT Expiry</p>
                            <p className="text-white text-xl font-semibold">{new Date(vehicle.specifications.history.mot).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Details */}
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Specification Details
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Make</span>
                            <span className="text-white font-medium">{vehicle.specifications.vehicle.make}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Model</span>
                            <span className="text-white font-medium">{vehicle.specifications.vehicle.model}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Year</span>
                            <span className="text-white font-medium">{vehicle.specifications.vehicle.year}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Body Type</span>
                            <span className="text-white font-medium capitalize">{vehicle.specifications.vehicle.bodyType}</span>
                          </div>
                          <div className="flex items-center justify-between pb-3">
                            <span className="text-gray-400">Engine</span>
                            <span className="text-white font-medium">{vehicle.specifications.vehicle.engineSize}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Gearbox</span>
                            <span className="text-white font-medium capitalize">{vehicle.specifications.vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Fuel</span>
                            <span className="text-white font-medium capitalize">{vehicle.specifications.vehicle.fuelType}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Power</span>
                            <span className="text-white font-medium">{vehicle.specifications.performance?.power}hp</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Color</span>
                            <span className="text-white font-medium capitalize">{vehicle.specifications.vehicle.color}</span>
                          </div>
                          {vehicle.specifications.performance?.stage && (
                            <div className="flex items-center justify-between pb-3">
                              <span className="text-gray-400">Stage</span>
                              <span className="text-white font-medium capitalize">{vehicle.specifications.performance.stage.replace('-', ' ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-lg p-8 text-center">
                <p className="text-gray-400">No specifications available for this vehicle.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Performance - Only show for luxury and modified vehicles */}
              {vehicle.specifications?.performance && vehicle._type !== 'vehicle' && (
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Performance
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {vehicle.specifications.performance.power && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Horsepower</span>
                            <span className="text-white font-medium">{vehicle.specifications.performance.power}hp</span>
                          </div>
                        )}
                        
                        {vehicle.specifications.performance.torque && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Torque</span>
                            <span className="text-white font-medium">{vehicle.specifications.performance.torque} lb-ft</span>
                          </div>
                        )}
                        
                        {vehicle.specifications.performance.acceleration && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">0-60 mph</span>
                            <span className="text-white font-medium">{vehicle.specifications.performance.acceleration}s</span>
                          </div>
                        )}
                        
                        {vehicle.specifications.performance.topSpeed && (
                          <div className="flex items-center justify-between pb-3">
                            <span className="text-gray-400">Top Speed</span>
                            <span className="text-white font-medium">{vehicle.specifications.performance.topSpeed} mph</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rarity Section - Only for Luxury Vehicles */}
              {vehicle._type === 'luxuryVehicle' && vehicle.rarity && (
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Rarity & Edition
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {vehicle.rarity.limited && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Limited Edition</span>
                            <span className="text-white font-medium">Yes</span>
                          </div>
                        )}
                        
                        {vehicle.rarity.limitedCount && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Production Count</span>
                            <span className="text-white font-medium">{vehicle.rarity.limitedCount} units</span>
                          </div>
                        )}
                        
                        {vehicle.rarity.editionNumber && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Edition Number</span>
                            <span className="text-white font-medium">{vehicle.rarity.editionNumber}</span>
                          </div>
                        )}
                        
                        {vehicle.rarity.specialEdition && (
                          <div className="flex items-center justify-between pb-3">
                            <span className="text-gray-400">Special Edition</span>
                            <span className="text-white font-medium">{vehicle.rarity.specialEdition}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Extended Info Section - For Used Cars */}
              {vehicle._type === 'vehicle' && vehicle.extendedInfo && (
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Additional Information
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="text-white">{vehicle.extendedInfo}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlighted Specs Section - For Used Cars */}
              {vehicle._type === 'vehicle' && vehicle.highlightedSpec && (
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Highlighted Specifications
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-2">
                        {vehicle.highlightedSpec.split('|').map((spec, index) => (
                          <div key={index} className="flex items-center gap-2 py-2">
                            <span className="text-red-600 flex-shrink-0">•</span>
                            <span className="text-white">{spec.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modification Summary - Only show for modified and luxury vehicles */}
              {vehicle.specifications?.modifications && vehicle._type !== 'vehicle' && (
                <div>
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Modification Summary
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {vehicle.specifications.modifications.totalCost && (
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-gray-400">Total Modification Cost</span>
                            <span className="text-white font-medium">£{vehicle.specifications.modifications.totalCost.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {vehicle.specifications.modifications.warranty && (
                          <div className="flex items-center justify-between pb-3">
                            <span className="text-gray-400">Warranty</span>
                            <span className="text-white font-medium capitalize">{vehicle.specifications.modifications.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {vehicle.specifications?.features && vehicle.specifications.features.length > 0 && (
                <div className="md:col-span-2">
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Key Features
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.specifications.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 py-2">
                            <span className="text-red-600 flex-shrink-0">•</span>
                            <span className="text-white">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modifications List - Only show for modified and luxury vehicles */}
              {vehicle.specifications?.modifications?.items && vehicle.specifications.modifications.items.length > 0 && vehicle._type !== 'vehicle' && (
                <div className="md:col-span-2 mt-6">
                  <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3"></span>
                        Modifications
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Group modifications by category */}
                        {Object.entries(
                          vehicle.specifications.modifications.items.reduce((acc: Record<string, Modification[]>, mod: Modification) => {
                            if (!acc[mod.category]) acc[mod.category] = [];
                            acc[mod.category].push(mod);
                            return acc;
                          }, {})
                        ).map(([category, mods]) => (
                          <div key={category} className="mb-6">
                            <h4 className="text-lg font-semibold text-white mb-3 capitalize border-b border-zinc-800 pb-2">
                              {category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {mods.map((mod, idx) => (
                                <div key={idx} className="bg-zinc-800 p-4 rounded-lg transition-transform hover:scale-105">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-white capitalize">{mod.name}</h5>
                                    {mod.brand && <span className="text-sm text-gray-400 capitalize">{mod.brand}</span>}
                                  </div>
                                  {mod.description && (
                                    <p className="text-gray-300 text-sm mb-2 first-letter:capitalize">{mod.description}</p>
                                  )}
                                  {mod.cost && (
                                    <p className="text-sm text-red-400 font-medium">Cost: £{mod.cost.toLocaleString()}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="finance" className="mt-6">
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Finance Options</h3>
              <p className="text-gray-300">Finance information coming soon. Please contact us for current finance options.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Selling Your Car Banner */}
      <div className="relative mb-12 overflow-hidden">
        <div className="bg-black rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 selling-title">Selling Your Car</h2>
              <div className="w-20 h-1 bg-red-600 mb-6"></div>
              <p className="text-gray-300 mb-8">
                If you have a luxury vehicle that you would like us to consider in part exchange against any of 
                our stock, enter the registration number below to contact us and see if we can get you paired with 
                your dream car
              </p>
              
              <form onSubmit={handlePartExBannerSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    type="text"
                    placeholder="YOUR REG..."
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="bg-white text-black h-12 text-lg uppercase font-medium"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-gray-500 hover:bg-gray-600 h-12 px-8 text-white"
                >
                  SUBMIT
                </Button>
              </form>
            </div>
            
            {/* Right image */}
            <div className="hidden md:block w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
              <Image
                src="/images/porsche-911-gt3-rs.jpg"
                alt="Luxury Car Part Exchange"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enquire Form Dialog */}
      <EnquiryForm
        isOpen={isEnquiryFormOpen}
        onClose={() => setIsEnquiryFormOpen(false)}
        chosenVehicle={vehicle.title}
      />

      {/* Part Exchange Form Dialog */}
      <PartExchangeForm
        isOpen={isPartExOpen}
        onClose={() => setIsPartExOpen(false)}
        chosenVehicle={vehicle.title}
      />

      {/* Fullscreen Image Gallery */}
      <Transition show={isFullScreenOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50" onClose={() => setIsFullScreenOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-7xl transform overflow-hidden rounded-lg bg-transparent transition-all">
                  {/* Close button */}
                  <button
                    onClick={() => setIsFullScreenOpen(false)}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>

                  {/* Navigation buttons */}
                  <button
                    onClick={() => setFullScreenIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setFullScreenIndex((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>

                  {/* Main fullscreen image */}
                  <div 
                    className="relative aspect-[16/9] w-full"
                    {...swipeHandlers}
                  >
                    <Image
                      src={urlForImage(allImages[fullScreenIndex])
                        .width(1920)
                        .height(1080)
                        .url()}
                      alt={`${vehicle.title} - Image ${fullScreenIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
                    {fullScreenIndex + 1} / {allImages.length}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
} 