import React from 'react'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { getVehicleBySlug, getRelatedVehicles } from '@/sanity/lib/client'
import { VehicleDetail } from '@/components/vehicles/VehicleDetail'
import { RelatedVehicles } from '@/components/vehicles/RelatedVehicles'
import { Metadata } from 'next'

interface VehiclePageProps {
  params: {
    slug: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug, 'vehicle')
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found - ASM Performance Cars',
      description: 'The requested vehicle could not be found.',
    }
  }

  // Construct a title that includes the vehicle's key specifications and "For Sale"
  const title = `${vehicle.title} For Sale`;

  // Create a detailed description using key vehicle details
  const description = `Explore this ${vehicle.year} ${vehicle.make} ${
    vehicle.model
  } ${
    vehicle.trim ? vehicle.trim : ""
  } with ${vehicle.mileage.toLocaleString()} miles for sale at ASM Performance Cars. ${
    vehicle.engineSize ? `${vehicle.engineSize}L ` : ""
  }${vehicle.transmission} ${vehicle.fuelType} with ${
    vehicle.exteriorColor || "premium"
  } exterior.`;

  return {
    title,
    description,
    keywords: `${vehicle.year} ${vehicle.make} ${vehicle.model}, used cars for sale, premium used cars, ASM Performance Cars, ${vehicle.make} for sale, ${vehicle.model} for sale`,
    alternates: {
      canonical: `https://asmperformancecars.co.uk/our-cars/used-cars-for-sale/${params.slug}`,
    },
  }
}

export default async function UsedVehicleDetailPage({ params }: VehiclePageProps) {
  const vehicle = await getVehicleBySlug(params.slug, 'vehicle')
  
  if (!vehicle) {
    notFound()
  }
  
  // Find related vehicles
  const relatedVehicles = await getRelatedVehicles(vehicle, 'used', 3)
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Vehicle Detail Component */}
        <VehicleDetail vehicle={vehicle} />

        {/* Related Vehicles Section */}
        <RelatedVehicles 
          vehicles={relatedVehicles} 
          title="Similar Used Cars" 
        />
      </div>
      
     
    </Layout>
  )
} 