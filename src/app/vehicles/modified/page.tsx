import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { getModifiedVehicles, getSEOContent } from '@/sanity/lib/client'
import { VehicleList } from '@/components/vehicles/VehicleList'

export const metadata = {
  title: 'Modified Cars For Sale | ASM Performance Cars',
  description: 'Browse our collection of premium modified vehicles with custom upgrades and performance enhancements.',
}

export default async function ModifiedVehiclesPage() {
  // Fetch modified vehicles from Sanity
  const vehicles = await getModifiedVehicles()
  
  // Fetch SEO content specific to modified vehicles page
  const seoContent = await getSEOContent('modified')
  
  return (
    <Layout seoContent={seoContent}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Modified Cars For Sale</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Explore our collection of high-performance modified vehicles. Each car in our inventory has been 
          carefully selected and enhanced to deliver exceptional performance and style.
        </p>
        <VehicleList vehicles={vehicles} />
      </div>
    </Layout>
  )
} 