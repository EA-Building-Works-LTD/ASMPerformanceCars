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

  // Construct a title that includes the vehicle's key specifications
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${
    vehicle.trim ? vehicle.trim : ""
  } - ${vehicle.mileage.toLocaleString()} miles - ASM Performance Cars`;

  // Create a detailed description using key vehicle details
  const description = `Explore this ${vehicle.year} ${vehicle.make} ${
    vehicle.model
  } ${
    vehicle.trim ? vehicle.trim : ""
  } with ${vehicle.mileage.toLocaleString()} miles for sale at ASM Performance Cars. ${
    vehicle.engineSize ? `${vehicle.engineSize}L ` : ""
  }${vehicle.transmission} ${vehicle.fuelType} with ${
    vehicle.exteriorColor
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
      
      {/* SEO Content */}
      <section className="bg-zinc-100 dark:bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Premium Used Cars for Sale in the UK</h2>
            <p>At ASM Performance Cars, we specialise in providing premium used cars for sale across the UK, catering to drivers who demand reliability, performance, and unbeatable value. Our extensive inventory of carefully selected second-hand cars is designed to meet the diverse needs of UK motorists—whether you're upgrading your daily driver, searching for a reliable first car, or investing in a prestige model at a fraction of the new price.</p>
            
            <p>Each vehicle in our collection is handpicked for its condition, provenance, and performance, offering a trusted alternative to brand-new cars while delivering remarkable savings. When you're searching online for "used cars near me" or looking to buy a used car in the UK, ASM Performance is your first and final destination.</p>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Why Choose Our Used Cars</h3>
            <p>Choosing ASM Performance means choosing confidence, convenience, and quality. Every vehicle that enters our forecourt is subject to a meticulous assessment process, ensuring it meets our strict criteria for excellence. Here's what sets our used car dealership apart:</p>
            
            <ul className="space-y-2 mt-4">
              <li className="flex items-start">
                <span className="font-bold mr-2">🔍 Comprehensive Vehicle Inspection</span>
                <span>Each used car undergoes a detailed multi-point inspection, carried out by experienced technicians to assess mechanical condition, safety, and aesthetics. Nothing leaves our site without passing this rigorous check.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">📑 Verified Vehicle History</span>
                <span>For total transparency and peace of mind, we provide a full service history, HPI report, and vehicle provenance verification. You'll know exactly where your car has been, how it's been maintained, and that it's free from outstanding finance or accident records.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">🧼 Professional Preparation & Presentation</span>
                <span>Prior to sale, every used vehicle is subjected to a full valet and professional detailing service, including interior deep-cleaning, paint protection, and bodywork inspection—ensuring it's showroom-ready.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">💷 Transparent & Competitive Pricing</span>
                <span>We use real-time market analysis tools to price every vehicle fairly and competitively, eliminating guesswork and hidden fees. What you see is what you pay, with no pressure, no gimmicks.</span>
              </li>
            </ul>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">The Best Used Cars for Every Lifestyle</h3>
            <p>Our diverse stock covers a wide range of makes, models, and price points, ensuring that whatever your lifestyle, we've got a car to match. Whether you're looking for:</p>
            
            <ul className="list-disc pl-6 space-y-1 mt-4">
              <li>A fuel-efficient hatchback for city commuting</li>
              <li>A family SUV with ample space and safety features</li>
              <li>A high-performance saloon or coupe for driving pleasure</li>
              <li>Or a prestige used car from premium brands like Audi, BMW, Mercedes-Benz or Jaguar</li>
            </ul>
            
            <p className="mt-4">...you'll find a trusted option right here at ASM. We regularly update our inventory to reflect the latest arrivals and in-demand vehicles—perfect if you're looking to buy a used car online or book a test drive locally.</p>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Expert Support from Start to Finish</h3>
            <p>Buying a used car can be daunting—but not with us. Our team is here to simplify the process and deliver a seamless, stress-free buying experience. Here's what you can expect when you buy your next used car from ASM:</p>
            
            <ul className="space-y-2 mt-4">
              <li className="flex items-start">
                <span className="font-bold mr-2">🤝 Personalised Guidance</span>
                <span>Whether you're buying your first car or upgrading to a newer model, our specialists will walk you through options based on your budget, preferences, and driving habits.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">🛡️ Flexible Finance Options</span>
                <span>We offer a range of tailored finance packages for used cars, helping you spread the cost without overextending your budget. From HP to PCP, we'll help you find the right fit.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">🧰 Post-Sale Aftercare</span>
                <span>Our commitment doesn't end when you drive off the forecourt. We provide ongoing aftersales support, warranty packages, and servicing reminders to keep your car in peak condition.</span>
              </li>
            </ul>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Start Your Journey to a Better Drive</h3>
            <p>If you're looking to buy a used car in the UK that's high on quality and low on hassle, start your search with ASM Performance Cars. Browse our current stock of used vehicles above or get in touch with our team for a no-obligation consultation. We're dedicated to helping you find a vehicle that not only meets your expectations—but exceeds them.</p>
          </div>
        </div>
      </section>
    </Layout>
  )
} 