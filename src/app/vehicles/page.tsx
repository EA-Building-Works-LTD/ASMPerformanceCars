import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { getModifiedVehicles } from '@/sanity/lib/client'
import { VehicleList } from '@/components/vehicles/VehicleList'

export const metadata = {
  title: 'Our Vehicles | ASM Performance Cars',
  description: 'Browse our collection of premium modified and luxury vehicles.',
}

export default async function VehiclesPage() {
  // Fetch vehicles from Sanity
  const vehicles = await getModifiedVehicles()
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Vehicle Collection</h1>
        <VehicleList vehicles={vehicles} />
      </div>
    </Layout>
  )
} 