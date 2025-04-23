import React from 'react'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { getVehicleBySlug, getRelatedVehicles } from '@/sanity/lib/client'
import { VehicleDetail } from '@/components/vehicles/VehicleDetail'
import { RelatedVehicles } from '@/components/vehicles/RelatedVehicles'
import { Metadata } from 'next'

interface VehiclePageProps {
  params: Promise<{
    slug: string
  }> | {
    slug: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const vehicle = await getVehicleBySlug(slug, 'modifiedVehicle')
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | ASM Performance Cars',
      description: 'The vehicle you are looking for does not exist or has been removed.',
    }
  }

  const power = vehicle.specifications?.performance?.power || vehicle.currentPower || '';
  const powerText = power ? ` | ${power}hp` : '';

  return {
    title: `${vehicle.title}${powerText} | Modified Cars for Sale | ASM Performance Cars`,
    description: `View details of ${vehicle.title} at ASM Performance Cars. Year: ${vehicle.specifications?.vehicle?.year || vehicle.year}, Mileage: ${vehicle.specifications?.history?.mileage || vehicle.mileage} miles.`,
  }
}

export default async function ModifiedVehicleDetailPage({ params }: VehiclePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const vehicle = await getVehicleBySlug(slug, 'modifiedVehicle')
  
  if (!vehicle) {
    notFound()
  }
  
  // Fetch related vehicles
  const relatedVehicles = await getRelatedVehicles(
    vehicle.specifications?.vehicle?.make || vehicle.make,
    vehicle._id
  )
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <VehicleDetail vehicle={vehicle} />
      </div>
      
      {relatedVehicles && relatedVehicles.length > 0 && (
        <RelatedVehicles vehicles={relatedVehicles} />
      )}
    </Layout>
  )
} 