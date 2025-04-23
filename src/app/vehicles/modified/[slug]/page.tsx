import React from 'react'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { getVehicleBySlug } from '@/sanity/lib/client'
import { VehicleDetail } from '@/components/vehicles/VehicleDetail'

interface VehiclePageProps {
  params: {
    slug: string
  }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const vehicle = await getVehicleBySlug(params.slug, 'modifiedVehicle')
  
  if (!vehicle) {
    notFound()
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <VehicleDetail vehicle={vehicle} />
      </div>
    </Layout>
  )
}

export async function generateMetadata({ params }: VehiclePageProps) {
  const vehicle = await getVehicleBySlug(params.slug, 'modifiedVehicle')
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | ASM Performance Cars',
      description: 'The requested vehicle could not be found.',
    }
  }
  
  return {
    title: `${vehicle.title} | ASM Performance Cars`,
    description: vehicle.subtitle || `${vehicle.title} - ${vehicle.price}`,
    openGraph: {
      images: [
        {
          url: vehicle.mainImageUrl || '',
          width: 1200,
          height: 630,
          alt: vehicle.title,
        },
      ],
    },
  }
} 