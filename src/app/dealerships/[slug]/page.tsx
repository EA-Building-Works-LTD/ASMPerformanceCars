import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getAllDealerships, 
  getDealershipBySlug 
} from '@/lib/dealerships/dealerships';
import { MapPin, Phone, Globe, ChevronLeft, Car, ExternalLink, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dealerships = await getAllDealerships();
  const dealership = getDealershipBySlug(dealerships, params.slug);
  
  if (!dealership) {
    return {
      title: 'Dealership Not Found',
    };
  }
  
  return {
    title: `${dealership.name} - Birmingham Car Dealership`,
    description: `Contact information and details for ${dealership.name} in ${dealership.location}. Find their contact number, website, and location details.`,
    keywords: [
      `${dealership.name}`, 
      'Birmingham dealership', 
      'car dealership Birmingham', 
      `${dealership.name} cars`,
      `${dealership.location} cars`
    ],
  };
}

export async function generateStaticParams() {
  const dealerships = await getAllDealerships();
  
  return dealerships.map((dealership) => ({
    slug: dealership.slug,
  }));
}

export default async function DealershipPage({ params }: Props) {
  const dealerships = await getAllDealerships();
  const dealership = getDealershipBySlug(dealerships, params.slug);
  
  if (!dealership) {
    notFound();
  }
  
  // SEO content for Layout component
  const seoContent = {
    title: `${dealership.name} - Birmingham Car Dealership`,
    content: `
      <p>
        ${dealership.name} is a car dealership located in ${dealership.location}. 
        They offer a range of vehicles to customers in the Birmingham area.
      </p>
      <p>
        For the most up-to-date information about their inventory, services, and special offers, 
        we recommend contacting them directly using the information provided or visiting their
        official website.
      </p>
    `
  };
  
  return (
    <Layout seoContent={seoContent}>
      {/* Hero section with gradient background */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-black to-red-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <Button variant="ghost" size="sm" asChild className="group text-white mb-4 md:mb-0">
              <Link href="/dealerships">
                <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                Back to all dealerships
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading text-white mb-4">
            {dealership.name}
          </h1>
          
          {dealership.location && (
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-5 w-5 text-red-400" />
              <span>{dealership.location}</span>
            </div>
          )}
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="mb-8 overflow-hidden">
                <div className="bg-red-50 border-b border-red-100 px-6 py-4">
                  <h2 className="text-xl font-heading text-red-900">Contact Information</h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dealership.phone && (
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Phone Number</p>
                          <a 
                            href={`tel:${dealership.phone}`} 
                            className="text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                          >
                            {dealership.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {dealership.website && (
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <Globe className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                          <a 
                            href={dealership.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {dealership.location && (
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Location</p>
                          <p className="text-gray-700">{dealership.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="prose max-w-none">
                <h2 className="text-2xl font-heading text-gray-900">About {dealership.name}</h2>
                <p className="text-gray-700">
                  {dealership.name} is a car dealership located in {dealership.location}. 
                  They offer a range of vehicles to customers in the Birmingham area.
                </p>
                
                <p className="text-gray-700">
                  For the most up-to-date information about their inventory, services, and special offers, 
                  we recommend contacting them directly using the information provided above or visiting their
                  official website.
                </p>
                
                <div className="mt-8 bg-red-50 p-6 rounded-lg border border-red-100">
                  <h3 className="text-xl font-heading text-red-900 mb-4">Looking for a better deal?</h3>
                  <p className="text-gray-700">
                    Before making a final decision, why not compare what {dealership.name} has to offer with
                    our selection of high-quality vehicles? At ASM Performance Cars, we pride ourselves on providing
                    exceptional value, comprehensive service, and a hassle-free buying experience.
                  </p>
                  <div className="mt-4">
                    <Link 
                      href="/our-cars" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
                      style={{ color: 'white', }}
                    >
                      <Car className="h-4 w-4 text-white" style={{ color: 'white' }} />
                      <span style={{ color: 'white', }}>Browse Our Vehicles</span>
                      <ArrowRight className="h-4 w-4 text-white" style={{ color: 'white' }} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side content */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-2 border-red-100">
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white">
                  <h3 className="text-lg font-heading">
                    Browse Our Cars
                  </h3>
                  <p className="text-sm text-red-100 mt-1">
                    Explore our selection of premium vehicles
                  </p>
                </div>
                <CardContent className="p-6">
                  <p className="mb-4 text-gray-700">
                    While you're researching {dealership.name}, why not check out our collection of 
                    hand-selected, premium vehicles?
                  </p>
                  
                  <Link 
                    href="/our-cars" 
                    className="w-full mb-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-md"
                    style={{ color: 'white', fontWeight: 'bold' }}
                  >
                    <Car className="h-4 w-4 text-white" style={{ color: 'white' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>View Our Inventory</span>
                  </Link>
                  
                  <Button variant="outline" className="w-full border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-700" asChild>
                    <Link href="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Info className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-heading text-lg text-gray-900">
                      Why Choose ASM Performance?
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Premium selection of performance vehicles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Comprehensive vehicle history checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Competitive financing options available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Expert advice from specialist team</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 