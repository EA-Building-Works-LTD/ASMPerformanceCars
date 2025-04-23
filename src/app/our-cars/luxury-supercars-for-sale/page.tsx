import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { getLuxuryVehicles, getSEOContent, getLuxuryCarsPageContent } from '@/sanity/lib/client'
import { VehicleList } from '@/components/vehicles/VehicleList'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star,
  Shield,
  Clock,
  Award,
  Phone,
  ChevronRight,
  Zap,
  Settings,
  Gauge,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portabletext'

// Define interfaces for the objects that are causing TypeScript errors
interface BrandLogo {
  logoUrl?: string;
  name: string;
}

interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export const metadata: Metadata = {
  title: 'Luxury Supercars For Sale',
  description: 'Browse our exclusive collection of luxury cars and supercars for sale in the UK. We offer the finest selection of premium vehicles with verified history and exceptional service.',
  keywords: 'luxury cars, luxury cars for sale, buy luxury cars, best luxury cars, UK luxury vehicles, supercars, premium cars, used luxury cars',
  alternates: {
    canonical: 'https://asmperformancecars.co.uk/our-cars/luxury-supercars-for-sale',
  },
}

export default async function LuxurySupercarsPage() {
  // Fetch luxury vehicles from Sanity
  const vehicles = await getLuxuryVehicles()
  
  // Fetch SEO content specific to luxury vehicles page
  const seoContent = await getSEOContent('luxury')
  
  // Fetch page content from Sanity
  const pageContent = await getLuxuryCarsPageContent()
  
  return (
    <Layout seoContent={seoContent}>
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-28">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {pageContent?.heroTitle || (
              <>
                Premium <span className="text-red-600">Luxury Supercars</span> For Sale
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            {pageContent?.heroDescription || "Explore our handpicked collection of exclusive luxury vehicles and supercars. We source only the finest examples, thoroughly inspected and professionally prepared for the discerning enthusiast. With unrivalled attention to detail and exceptional aftercare, we deliver a premium automotive acquisition experience."}
          </p>

        </div>

        {/* USP Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle1 || "Exceptional Quality"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription1 || "Our luxury cars undergo rigorous inspection and preparation to ensure they meet the highest standards of quality and performance."}
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle2 || "Verified History"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription2 || "Every luxury vehicle comes with comprehensive documentation, including service history, ownership records, and thorough inspection reports."}
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle3 || "Bespoke Service"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription3 || "Experience our personalised approach to luxury car buying, with tailored financing options and dedicated aftercare support."}
              </p>
            </div>
          </div>
        </div>

        {/* Current Inventory Section */}
        <div id="luxury-inventory" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl font-bold">
              {pageContent?.inventoryTitle || "Luxury Supercars For Sale"}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {pageContent?.inventoryDescription || "Browse our latest collection of premium luxury vehicles and supercars available for immediate purchase. Our carefully curated inventory features prestigious brands known for their exceptional craftsmanship and performance."}
          </p>

          {/* Vehicle listing */}
          <VehicleList vehicles={vehicles} />
        </div>

        {/* Brands Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl font-bold">
              {pageContent?.brandsTitle || "Prestigious Brands We Offer"}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {pageContent?.brandsDescription || "We specialise in sourcing and supplying luxury vehicles from the world's most prestigious automotive manufacturers."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pageContent?.brandLogos ? (
              pageContent.brandLogos.map((brand: unknown, index: number) => {
                const typedBrand = brand as BrandLogo;
                return (
                <div key={index} className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  {typedBrand.logoUrl ? (
                    <div className="w-full h-20 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                      <Image
                        src={typedBrand.logoUrl}
                        alt={typedBrand.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{typedBrand.name}</p>
                    </div>
                  )}
                </div>
              )})
            ) : (
              // Fallback logos
              <>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Aston Martin</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Bentley</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Ferrari</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Lamborghini</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">McLaren</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Porsche</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Rolls-Royce</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 hover:border-red-600/20 shadow-md transition-all duration-300 hover:shadow-red-600/5 group flex items-center justify-center h-32">
                  <p className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Mercedes-AMG</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mb-20 bg-gradient-to-br from-black to-zinc-900 rounded-2xl overflow-hidden">
          <div className="p-10 md:p-16 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
            
            <Badge className="mb-4 bg-red-600">Why Choose Our Luxury Supercars</Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              {pageContent?.whyChooseTitle ||
                "Exceptional Luxury Vehicles From Trusted Sources"}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left column - Description and CTA */}
              <div>
                <p className="text-gray-300 mb-8 text-lg">
                  {pageContent?.whyChooseDescription ||
                    "At ASM Performance Cars, we're passionate about luxury vehicles and supercars. We understand the meticulous craftsmanship and engineering excellence that defines these extraordinary machines, and we apply stringent selection criteria to every vehicle in our collection."}
                </p>

                {/* Testimonial card */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl mb-8 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <blockquote className="italic text-gray-300 mb-4">
                    {pageContent?.testimonial?.quote ||
                      "Purchasing my Porsche 911 from ASM was an absolute pleasure. Their knowledge, attention to detail and personalized service made the entire experience exceptional."}
                  </blockquote>
                  <p className="text-red-400 font-medium">
                    {pageContent?.testimonial?.author &&
                    pageContent?.testimonial?.location
                      ? `— ${pageContent.testimonial.author}, ${pageContent.testimonial.location}`
                      : "— Robert M., London"}
                  </p>
                </div>

                <div className="mt-8">
                  <Link href={pageContent?.ctaSection?.buttonLink || "/contact"}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                      {pageContent?.ctaSection?.buttonText || "Enquire About a Car"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column - Feature items with hover effect */}
              <div className="space-y-5">
                {pageContent?.featureItems ? (
                  pageContent.featureItems.map((item: unknown, index: number) => {
                    const typedItem = item as FeatureItem;
                    return (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        {typedItem.icon === "Shield" && <Shield className="h-5 w-5 text-white" />}
                        {typedItem.icon === "Clock" && <Clock className="h-5 w-5 text-white" />}
                        {typedItem.icon === "Award" && <Award className="h-5 w-5 text-white" />}
                        {!["Shield", "Clock", "Award"].includes(typedItem.icon || "") && <Settings className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{typedItem.title}</h3>
                        <p className="text-gray-400">{typedItem.description}</p>
                      </div>
                    </div>
                  )})
                ) : (
                  // Fallback content if no feature items are defined
                  <>
                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Verified Provenance</h3>
                        <p className="text-gray-400">
                          Every luxury vehicle in our collection undergoes comprehensive verification of its history, ownership, and maintenance records to ensure authenticity and quality.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Specialist Preparation</h3>
                        <p className="text-gray-400">
                          Our marque specialists meticulously prepare each luxury vehicle, addressing even the smallest details to ensure exceptional presentation and performance.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Tailored Support</h3>
                        <p className="text-gray-400">
                          We provide ongoing assistance with warranty coordination, maintenance scheduling, and specialist servicing to ensure seamless ownership of your luxury vehicle.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl font-bold">
              {pageContent?.faqTitle || "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pageContent?.faqSection ? (
              pageContent.faqSection.map((faq: unknown, index: number) => {
                const typedFAQ = faq as FAQ;
                return (
                <div
                  key={index}
                  className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">{typedFAQ.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {typedFAQ.answer}
                  </p>
                </div>
              )})
            ) : (
              // Fallback FAQ content
              <>
                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    What sets your luxury cars apart?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our luxury cars are hand-selected for their exceptional specification, provenance, and condition. Each vehicle undergoes a comprehensive inspection by marque specialists and is professionally prepared to the highest standards before being offered for sale.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Do you offer warranties on luxury cars?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, many of our luxury cars come with the remainder of their manufacturer's warranty. For vehicles outside of manufacturer coverage, we offer comprehensive warranty options through specialist providers, giving you complete peace of mind with your purchase.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Can you source specific luxury models?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Absolutely. Our extensive network and industry relationships allow us to source virtually any luxury vehicle to your exact specification. Whether you're seeking a limited-edition supercar or a bespoke luxury saloon, our acquisition specialists can help find your perfect car.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    What financing options are available?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We partner with specialist financial institutions who understand the unique aspects of luxury car ownership. We can arrange bespoke finance packages, including hire purchase, lease purchase, and balloon payment options tailored to your specific requirements.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Do you offer part-exchange?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, we welcome part-exchanges against any of our luxury vehicles. Our team will provide a fair market valuation for your current car, making the transition to your new luxury vehicle as seamless as possible.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    What aftercare services do you provide?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our relationship continues long after your purchase. We offer comprehensive aftercare services, including maintenance advice, servicing recommendations, and assistance with any aspects of ownership. Our team remains available to help ensure your complete satisfaction.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20 bg-red-600 rounded-2xl overflow-hidden relative">
          <div className="p-10 md:p-16 z-10 relative">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {pageContent?.ctaSection?.title || "Ready to Purchase Your Luxury Supercar?"}
              </h2>
              <p className="text-white/90 text-lg mb-8">
                {pageContent?.ctaSection?.description || "Whether you're looking to purchase a luxury car or enquire about our exclusive sourcing service, our team of specialists is here to assist you."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={pageContent?.ctaSection?.buttonLink || "/contact"}>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {pageContent?.ctaSection?.buttonText || "Contact Our Specialists"}
                  </Button>
                </Link>
                <Link
                  href={
                    pageContent?.ctaSection?.secondaryButtonLink ||
                    "#luxury-inventory"
                  }
                >
                  <Button className="border-white text-white hover:bg-white-50 cursor-pointer">
                    {pageContent?.ctaSection?.secondaryButtonText || "Browse Luxury Collection"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Diagonal overlay */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-500 to-transparent opacity-50"></div>
        </div>

        {/* SEO Content */}
        <div className="mb-20">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="seo-content"
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <AccordionTrigger className="text-lg font-medium hover:text-red-600 py-4">
                Exceptional Luxury Cars for the Discerning UK Motorist
              </AccordionTrigger>
              <AccordionContent>
                {pageContent?.seoContent ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableText
                      value={pageContent.seoContent}
                      components={portableTextComponents}
                    />
                  </div>
                ) : (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2>
                      Exceptional Luxury Cars for the Discerning UK Motorist
                    </h2>
                    <p>
                      At ASM Performance Cars, we specialise in offering the finest selection of luxury cars for sale in the UK. Our carefully curated collection showcases the very best in automotive engineering, design and craftsmanship from the world's most prestigious manufacturers. For enthusiasts and connoisseurs seeking extraordinary vehicles that deliver both driving excellence and social distinction, our luxury cars represent the pinnacle of automotive achievement.
                    </p>

                    <p>
                      When you buy luxury cars from ASM Performance, you're investing in vehicles that have been meticulously vetted and prepared. Each car in our inventory undergoes comprehensive inspection by marque specialists to ensure authenticity, mechanical integrity, and cosmetic excellence. Our commitment to quality means you can purchase with absolute confidence, knowing your luxury vehicle has been selected for its exceptional specification, provenance, and condition.
                    </p>

                    <h3>The Benefits of Choosing Used Luxury Cars</h3>
                    <p>
                      The best luxury cars offer a compelling ownership proposition, particularly when acquired through a specialist like ASM Performance:
                    </p>

                    <ul>
                      <li>
                        <strong>Value retention</strong> - Premium luxury vehicles typically experience less severe depreciation than mainstream models, representing a more stable automotive investment
                      </li>
                      <li>
                        <strong>Superior specification</strong> - Our used luxury cars often feature extensive optional equipment that would command significant premiums when new
                      </li>
                      <li>
                        <strong>Exceptional engineering</strong> - Luxury marques invest heavily in research and development, resulting in vehicles that offer superior performance, comfort and longevity
                      </li>
                      <li>
                        <strong>Prestige ownership experience</strong> - Beyond the vehicle itself, luxury car ownership provides access to exclusive communities and specialist service networks
                      </li>
                    </ul>

                    <h3>Our Luxury Car Collection</h3>
                    <p>
                      Our inventory of luxury cars for sale encompasses the finest vehicles from prestigious manufacturers including:
                    </p>

                    <h4>Iconic GT and Sports Cars</h4>
                    <p>
                      From the timeless elegance of Aston Martin to the precision engineering of Porsche, our GT collection offers the perfect blend of performance and refinement. These vehicles deliver exhilarating driving dynamics without compromising on comfort or practicality, making them ideal for both spirited weekend drives and continental touring.
                    </p>

                    <h4>Prestigious Luxury Saloons</h4>
                    <p>
                      Our selection of luxury saloons from manufacturers such as Bentley, Rolls-Royce and Mercedes-Benz represents the ultimate in refined motoring. Combining sumptuous interiors crafted from the finest materials with sophisticated driving dynamics, these vehicles offer an unparalleled travel experience for both driver and passengers.
                    </p>

                    <h4>Exotic Supercars</h4>
                    <p>
                      For those seeking the ultimate in automotive performance and exclusivity, our supercar collection features extraordinary vehicles from marques such as Ferrari, Lamborghini and McLaren. These automotive masterpieces represent the absolute cutting edge of technology, design and engineering, delivering sensational performance and unmistakable presence.
                    </p>

                    <h3>The ASM Advantage: Luxury Car Expertise</h3>
                    <p>
                      When you choose to buy luxury cars from ASM Performance, you benefit from our specialist knowledge and meticulous approach. Our team's deep understanding of the premium automotive market enables us to source and select only the most exceptional examples, each representing outstanding value and ownership potential.
                    </p>

                    <p>
                      We pride ourselves on transparency, providing comprehensive documentation for every luxury vehicle we sell. This includes detailed provenance information, service history, and inspection reports, giving you complete confidence in your purchase. Our commitment to excellence extends beyond the sale, with ongoing support and advice available to ensure your complete satisfaction.
                    </p>

                    <h3>Finding Your Perfect Luxury Vehicle</h3>
                    <p>
                      Our current collection represents some of the best luxury cars available in the UK market. Each vehicle has been personally selected for its exceptional quality, specification, and value, providing a curated selection that simplifies your search for automotive excellence.
                    </p>

                    <p>
                      If your ideal luxury car is not currently in our inventory, our bespoke sourcing service can locate your perfect vehicle from our extensive network of contacts throughout the UK and Europe. Whether you're seeking a particular model, specification, or colour combination, our acquisition specialists will work diligently to find your dream car.
                    </p>

                    <p>
                      Browse our selection of luxury cars for sale above, or contact our team to discuss your specific requirements. We are passionate about extraordinary automobiles and committed to helping you find the perfect luxury car for your collection.
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  )
} 