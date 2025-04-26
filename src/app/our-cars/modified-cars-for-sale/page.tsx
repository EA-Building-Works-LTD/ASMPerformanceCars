import React from "react";
import { Layout } from "@/components/layout/Layout";
import {
  getModifiedVehicles,
  getSEOContent,
  getModifiedCarsPageContent,
} from "@/sanity/lib/client";
import { VehicleList } from "@/components/vehicles/VehicleList";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Wrench,
  ShieldCheck,
  Award,
  Phone,
  ChevronRight,
  Zap,
  Settings,
  Gauge,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/portabletext";

// Define interfaces for the objects that are causing TypeScript errors
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
  title: "Modified Cars For Sale",
  description:
    "Browse our exclusive collection of professionally modified cars for sale in the UK. From subtle enhancements to full performance builds, find the best modified cars with verified history and expert aftercare.",
  keywords:
    "modified cars, modified cars for sale, buy modified cars, best modified cars, UK modified vehicles, performance cars, tuned cars, custom cars",
  alternates: {
    canonical: "https://asmperformancecars.co.uk/our-cars/modified-cars-for-sale",
  },
};

export default async function ModifiedCarsPage() {
  // Fetch modified vehicles from Sanity
  const vehicles = await getModifiedVehicles();

  // Additional client-side sorting to ensure proper order (in-stock first, then by price descending)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const aStatus = (a.status || a.specifications?.vehicle?.status || '').toLowerCase();
    const bStatus = (b.status || b.specifications?.vehicle?.status || '').toLowerCase();
    
    const aInStock = aStatus === 'in stock' || aStatus === 'available';
    const bInStock = bStatus === 'in stock' || bStatus === 'available';
    
    // First sort by in-stock status
    if (aInStock && !bInStock) return -1;
    if (!aInStock && bInStock) return 1;
    
    // Then sort by price (highest first)
    return (b.price || 0) - (a.price || 0);
  });

  // Fetch SEO content specific to modified vehicles page
  const seoContent = await getSEOContent("modified");

  // Fetch page content from Sanity
  const pageContent = await getModifiedCarsPageContent();

  return (
    <Layout seoContent={seoContent}>
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-28">
        {/* Current Inventory Section */}
        <div id="current-inventory" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 bg-red-600 rounded-full"></div>
            <h1 className="text-3xl font-bold">
              {pageContent?.inventoryTitle || "Modified Cars For Sale"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {pageContent?.inventoryDescription ||
              "Browse our latest selection of modified cars available for immediate purchase. From subtle ECU remaps to complete engine builds, our modified cars are for customers who are after that little bit more than stock."}
          </p>

          {/* Vehicle listing with sorted vehicles */}
          <VehicleList vehicles={sortedVehicles} />
        </div>

                {/* Hero Section */}
                <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {pageContent?.heroTitle || (
              <>
                Premium <span className="text-red-600">Modified Cars</span> For
                Sale
              </>
            )}
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            {pageContent?.heroDescription ||
              "Explore our handpicked collection of high-performance modified cars. We only take on the best examples of modified vehicles and have them professionally prepared for sale. We particularly specialise in BMW, Audi, SEAT, VW and Mercedes. With a focus on quality and performance, we are sure to have the perfect modified car for you."}
          </p>
        </div>

        {/* USP Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle1 || "Clean Modified Cars"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription1 ||
                  "All our modified cars are well maintained, and looked after. We ensure all cars we buy and sell are in the best possible condition for their new owner."}
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle2 || "Service History"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription2 ||
                  "Every modification is fully documented with detailed build specifications, dyno results(where applicable), and complete service history for absolute peace of mind."}
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle3 || "Aftercare Support"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription3 ||
                  "When you buy modified cars from us, you receive ongoing maintenance advice from our team. We are always on hand to help with any questions you may have."}
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mb-20 bg-gradient-to-br from-black to-zinc-900 rounded-2xl overflow-hidden">
          <div className="p-10 md:p-16 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
            
            <Badge className="mb-4 bg-red-600">Why Choose Our Modified Cars</Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              {pageContent?.whyChooseTitle ||
                "The Best Modified Cars Built to Exacting Standards"}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left column - Description and CTA */}
              <div>
                <p className="text-gray-300 mb-8 text-lg">
                  {pageContent?.whyChooseDescription ||
                    "At ASM Performance Cars, we're enthusiasts first and foremost. We understand what makes the best modified cars truly exceptional, and we apply those standards to every vehicle in our inventory."}
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
                      "The attention to detail on my modified BMW M4 was exceptional. ASM's expertise and aftercare support made the entire experience smooth and reassuring."}
                  </blockquote>
                  <p className="text-red-400 font-medium">
                    {pageContent?.testimonial?.author &&
                    pageContent?.testimonial?.location
                      ? `— ${pageContent.testimonial.author}, ${pageContent.testimonial.location}`
                      : "— James H., Hampshire"}
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
                        {typedItem.icon === "Zap" && <Zap className="h-5 w-5 text-white" />}
                        {typedItem.icon === "Settings" && <Settings className="h-5 w-5 text-white" />}
                        {typedItem.icon === "Gauge" && <Gauge className="h-5 w-5 text-white" />}
                        {!["Zap", "Settings", "Gauge"].includes(typedItem.icon || "") && <Wrench className="h-5 w-5 text-white" />}
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
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Performance Verified</h3>
                        <p className="text-gray-400">
                          All of our modified cars are from reputable tuners in the UK, with the likes of R-Tech, MRC, Infinite Performance, and many more.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">High Quality Parts</h3>
                        <p className="text-gray-400">
                          We only use respected aftermarket parts from premium manufacturers, never compromising on quality.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <Gauge className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Maintenance Advice</h3>
                        <p className="text-gray-400">
                          We offer maintenance advice to all our customers. We are always on hand to help with any questions you may have.
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
                    What documentation do your modified cars come with?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All our modified cars for sale come with comprehensive
                    documentation depending on the vehicle. Documentation can
                    include modification specifications, dyno sheets showing
                    performance figures, receipts for parts and labour, and a
                    complete service history.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Are the modifications road-legal in the UK?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, we ensure all our modified cars comply with UK road
                    regulations. This includes appropriate emissions standards,
                    noise regulations, and safety requirements. We provide
                    guidance on any MOT or insurance considerations.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    How does buying a modified car affect insurance?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Insurance requirements vary for modified cars. We provide
                    detailed modification documentation for insurance purposes
                    and can recommend specialist insurers who understand and
                    fairly price policies for modified vehicles.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Do you offer warranties on modified cars?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We offer limited warranties on specific components and
                    modifications with external, third party suppliers. Each
                    vehicle's warranty details are clearly explained, covering
                    workmanship and certain parts. Extended warranties are
                    available for additional peace of mind, at an extra premium.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Can I further modify a car?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Absolutely. Many clients purchase our modified cars and then
                    proceed to expand on the build, opting for forged engines,
                    hybrid turbos and many other upgrades.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    How do I maintain a modified car?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We are able to provide you with maintenance guidelines
                    specific to each modified car. Our aftercare service
                    includes ongoing technical support, so if you are ever in
                    doubt just get in touch.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20 bg-red-600 rounded-2xl overflow-hidden relative">
          <div className="p-10 md:p-16 z-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {pageContent?.ctaSection?.title || "Found a Modified Car You Want?"}
            </h2>
            <p className="text-white/90 text-lg mb-8">
              {pageContent?.ctaSection?.description || 
                "Get in touch with us today and take the first step towards driving your modified car. Our expert team is on hand to help you every step of the way."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={pageContent?.ctaSection?.buttonLink || "/contact"}>
                <Button className="bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 cursor-pointer">
                  {pageContent?.ctaSection?.buttonText || "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mb-20">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="seo-content"
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <AccordionTrigger className="text-lg font-medium hover:text-red-600 py-4">
                Professional Modified Cars for the Discerning UK Enthusiast
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
                      Professional Modified Cars for the Discerning UK
                      Enthusiast
                    </h2>
                    <p>
                      At ASM Performance Cars, we specialise in offering the
                      finest selection of modified cars for sale in the UK. Our
                      collection represents the pinnacle of automotive
                      enhancement, combining tasteful aesthetics with
                      substantial performance upgrades. For enthusiasts seeking
                      something beyond standard factory offerings, our modified
                      cars deliver the perfect balance of power, handling, and
                      exclusivity.
                    </p>

                    <p>
                      When you buy modified cars from ASM Performance, you're
                      investing in vehicles that have been modified by reputable
                      tuners across the UK. From subtle ECU remaps that unlock
                      hidden potential to comprehensive builds featuring forged
                      engine builds, suspension modifications, and custom
                      interior designs, our modified vehicles cater to all
                      preferences and performance goals.
                    </p>

                    <h3>Why Modified Cars Offer Exceptional Value</h3>
                    <p>
                      The best modified cars represent excellent value for
                      performance enthusiasts. By purchasing a professionally
                      modified vehicle, you benefit from:
                    </p>

                    <ul>
                      <li>
                        <strong>Immediate enjoyment</strong> - No waiting for
                        parts or workshop time, your performance car is ready to
                        drive away
                      </li>
                      <li>
                        <strong>Cost savings</strong> - Acquiring a vehicle with
                        existing modifications typically costs significantly
                        less than commissioning the same work on a standard car
                      </li>
                      <li>
                        <strong>Proven reliability</strong> - Our modified cars
                        have been thoroughly tested and any teething issues
                        resolved
                      </li>
                      <li>
                        <strong>Professional integration</strong> - Components
                        are harmoniously matched for optimal performance and
                        longevity
                      </li>
                    </ul>

                    <h3>Types of Modified Cars We Offer</h3>
                    <p>
                      Our inventory of modified cars for sale encompasses a
                      diverse range of vehicles and modification styles:
                    </p>

                    <h4>Performance-Enhanced Modern Classics</h4>
                    <p>
                      These vehicles represent iconic models from the 1990s and
                      2000s that have been thoughtfully updated with modern
                      performance components while preserving their classic
                      character. Think E46 BMW M3s with suspension upgrades and
                      engine enhancements, or Mk4 Volkswagen Golf R32s with
                      carefully selected power upgrades.
                    </p>

                    <h4>Subtle OEM+ Modified Vehicles</h4>
                    <p>
                      For enthusiasts who appreciate refinement and restraint,
                      our OEM+ builds feature modifications that appear
                      factory-standard but deliver enhanced performance. These
                      modified cars typically feature professional ECU tuning,
                      discreet exhaust upgrades, and handling improvements that
                      maintain daily usability while offering a more engaging
                      driving experience.
                    </p>

                    <h4>High-Performance Track-Focused Builds</h4>
                    <p>
                      Our most committed performance vehicles feature
                      comprehensive modifications focusing on maximum track
                      capability while retaining road legality. These modified
                      cars often include forced induction conversions,
                      performance brake systems, adjustable suspension setups,
                      and aerodynamic enhancements.
                    </p>

                    <h3>The ASM Difference: Modified Cars You Can Trust</h3>
                    <p>
                      When you choose to buy modified cars from ASM Performance,
                      you benefit from our meticulous approach to vehicle
                      selection and preparation. Our team verifies the quality
                      and compatibility of all modifications, ensuring they work
                      harmoniously together rather than as a collection of
                      mismatched parts.
                    </p>

                    <p>
                      We pride ourselves on transparency, providing
                      comprehensive documentation for every modified vehicle we
                      sell. This includes detailed build specifications,
                      performance test results, and complete service history,
                      giving you absolute confidence in your purchase.
                    </p>

                    <h3>Finding Your Perfect Modified Car</h3>
                    <p>
                      Our current inventory represents some of the best modified
                      cars available in the UK market. We carefully select
                      vehicles that demonstrate thoughtful modifications,
                      quality workmanship, and proper maintenance.
                    </p>

                    <p>
                      If you don't see your ideal modified car in our current
                      stock, our vehicle sourcing service can help locate your
                      perfect match. Our network of specialists and suppliers
                      allows us to create truly exceptional modified cars
                      tailored to individual requirements.
                    </p>

                    <p>
                      Browse our selection of modified cars for sale above, or
                      contact our team to discuss your specific requirements.
                      We're passionate about performance vehicles and committed
                      to helping you find the perfect modified car for your
                      driving aspirations.
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
