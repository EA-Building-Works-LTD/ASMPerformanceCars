import React from "react";
import { Layout } from "@/components/layout/Layout";
import {
  getUsedVehicles,
  getSEOContent,
  getUsedCarsPageContent,
} from "@/sanity/lib/client";
import { VehicleList } from "@/components/vehicles/VehicleList";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  Car,
  PoundSterling,
  Star,
  History,
  Settings,
  Phone,
  ChevronRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Cars For Sale",
  description:
    "Browse our handpicked selection of quality used cars for sale in the UK. Each vehicle is thoroughly inspected and prepared to our exacting standards. Find your perfect used car today.",
  keywords:
    "used cars, used cars for sale, buy used cars, best used cars to buy, quality used cars UK, premium used cars",
  alternates: {
    canonical: "https://asmperformancecars.co.uk/our-cars/used-cars-for-sale",
  },
};

export default async function UsedCarsPage() {
  // Fetch used vehicles from Sanity
  const vehicles = await getUsedVehicles();

  // Fetch SEO content specific to used vehicles page
  const seoContent = await getSEOContent("used");

  // Fetch page content from Sanity
  const pageContent = await getUsedCarsPageContent();

  return (
    <Layout seoContent={seoContent}>
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-28">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {pageContent?.heroTitle || (
              <>
                Premium <span className="text-red-600">Used Cars</span> For Sale
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            {pageContent?.heroDescription ||
              "Discover our carefully curated collection of quality used cars for sale. Each vehicle in our inventory undergoes a comprehensive inspection and preparation process to ensure exceptional standards. With transparent history and competitive pricing, we make finding your perfect used car a seamless experience."}
          </p>

        </div>

        {/* USP Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle1 || "Quality Assured"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription1 ||
                  "Every used car we offer undergoes a rigorous multi-point inspection to ensure it meets our exacting standards for quality and reliability."}
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
                {pageContent?.uspSection?.uspDescription2 ||
                  "All our used cars come with comprehensive documentation, including full service history, HPI checks, and vehicle provenance verification."}
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pageContent?.uspSection?.uspTitle3 || "Expert Support"}
                </h3>
              </div>
              <p className="text-gray-400">
                {pageContent?.uspSection?.uspDescription3 ||
                  "Our team of specialists provides dedicated support throughout your ownership journey, from initial enquiry to ongoing aftercare."}
              </p>
            </div>
          </div>
        </div>

        {/* Current Inventory Section */}
        <div id="current-inventory" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl font-bold">
              {pageContent?.inventoryTitle || "Used Cars For Sale"}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {pageContent?.inventoryDescription ||
              "Browse our latest selection of quality used cars available for immediate purchase. From executive saloons to practical family cars, each vehicle is chosen for its quality and value."}
          </p>
          <VehicleList vehicles={vehicles} />
        </div>

        {/* Why Choose Section */}
        <div className="mb-20 bg-gradient-to-br from-black to-zinc-900 rounded-2xl overflow-hidden">
          <div className="p-10 md:p-16 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
            
            <Badge className="mb-4 bg-red-600">Why Choose Our Used Cars</Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              {pageContent?.whyChooseTitle ||
                "The Best Used Cars, Thoroughly Vetted"}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left column - Description and CTA */}
              <div>
                <p className="text-gray-300 mb-8 text-lg">
                  {pageContent?.whyChooseDescription ||
                    "At ASM Performance Cars, we understand that buying a used car is a significant investment. That's why we go above and beyond to ensure every vehicle meets our stringent quality standards."}
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
                      "The team at ASM helped me find the perfect car for my family. Their honest advice and no-pressure approach made buying a used car an enjoyable experience."}
                  </blockquote>
                  <p className="text-red-400 font-medium">
                    {pageContent?.testimonial?.author &&
                    pageContent?.testimonial?.location
                      ? `— ${pageContent.testimonial.author}, ${pageContent.testimonial.location}`
                      : "— Sarah P., Birmingham"}
                  </p>
                </div>

                <div className="mt-8">
                  <Link href={pageContent?.ctaSection?.buttonLink || "/contact"}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                      {pageContent?.ctaSection?.buttonText || "Speak to Our Team"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column - Feature items with hover effect */}
              <div className="space-y-5">
                {pageContent?.featureItems ? (
                  pageContent.featureItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        {item.icon === "Shield" && <Shield className="h-5 w-5 text-white" />}
                        {item.icon === "CheckCircle" && <CheckCircle className="h-5 w-5 text-white" />}
                        {item.icon === "History" && <History className="h-5 w-5 text-white" />}
                        {item.icon === "PoundSterling" && <PoundSterling className="h-5 w-5 text-white" />}
                        {!["Shield", "CheckCircle", "History", "PoundSterling"].includes(item.icon) && <Car className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback content if no feature items are defined
                  <>
                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Comprehensive Inspection</h3>
                        <p className="text-gray-400">
                          Every used car in our inventory undergoes a thorough multi-point inspection by our qualified technicians.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <History className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Verified History</h3>
                        <p className="text-gray-400">
                          We provide comprehensive vehicle history checks and fully transparent service records for complete peace of mind.
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/30 hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mt-1 p-3 bg-red-600 rounded-lg">
                        <PoundSterling className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">Competitive Pricing</h3>
                        <p className="text-gray-400">
                          Our used cars are priced fairly based on market value, condition, and specification, with no hidden fees or surprises.
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
              {pageContent?.faqTitle || "Common Questions About Used Cars"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pageContent?.faqSection ? (
              pageContent.faqSection.map((faq: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    What checks do you perform on your used cars?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every used car undergoes a comprehensive multi-point
                    inspection covering mechanical condition, electrical
                    systems, and safety features. We also perform full HPI
                    checks and verify service history to ensure complete peace
                    of mind.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Do you offer warranties on used cars?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, all our used cars come with a comprehensive warranty
                    package. Additional extended warranty options are available
                    for extra peace of mind, and our team can explain the
                    coverage details specific to each vehicle.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Can you help with used car finance?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We work with leading UK finance providers to offer
                    competitive finance packages on our used cars. Our team can
                    help you explore various options, including HP and PCP, to
                    find the best solution for your budget.
                  </p>
                </div>

                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    What documentation do your used cars come with?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All our used cars come with comprehensive documentation
                    including V5C registration, MOT certificate, service
                    history, HPI certificate, and detailed inspection reports.
                    We ensure complete transparency with all paperwork.
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
                {pageContent?.ctaSection?.title ||
                  "Ready to Find Your Perfect Used Car?"}
              </h2>
              <p className="text-white/90 text-lg mb-8">
                {pageContent?.ctaSection?.description ||
                  "Browse our current selection of quality used cars or speak with our team about finding your ideal vehicle. We're here to help you make the right choice."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={pageContent?.ctaSection?.buttonLink || "/contact"}>
                  <Button
                    variant="outline"
                    className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {pageContent?.ctaSection?.buttonText || "Speak to Our Team"}
                  </Button>
                </Link>
                <Link
                  href={
                    pageContent?.ctaSection?.secondaryButtonLink ||
                    "#current-inventory"
                  }
                >
                  <Button className="border-white text-white hover:bg-white/10 cursor-pointer">
                    {pageContent?.ctaSection?.secondaryButtonText ||
                      "View Available Cars"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Diagonal overlay */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-500 to-transparent opacity-50"></div>
        </div>
      </div>
    </Layout>
  );
}
