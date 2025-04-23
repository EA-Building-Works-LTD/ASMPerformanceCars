import React from 'react';
import { Metadata } from 'next';
import { Layout } from '@/components/layout/Layout';
import { DealershipSearch } from '@/components/dealerships/DealershipSearch';
import { DealershipGrid } from '@/components/dealerships/DealershipGrid';
import { 
  getAllDealerships, 
  getPaginatedDealerships, 
  searchDealerships 
} from '@/lib/dealerships/dealerships';
import { Store, Car, MapPin, Globe, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { headers } from 'next/headers';

// Ensure dynamic rendering with no caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface SearchParams {
  page?: string;
  q?: string;
}

// Add cache control headers to prevent browser caching
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const page = searchParams.page || '1';
  const query = searchParams.q ? ` - Search: ${searchParams.q}` : '';
  
  return {
    title: `Birmingham Car Dealerships${page !== '1' ? ` - Page ${page}` : ''}${query}`,
    description: `Browse our comprehensive directory of Birmingham car dealerships. ${page !== '1' ? `Page ${page} of results.` : ''} Find contact information, locations, and details for car dealerships in Birmingham.`,
    keywords: ['Birmingham car dealerships', 'car dealers Birmingham', 'auto dealers Birmingham', 'car showrooms', 'used car dealers Birmingham'],
    other: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  };
}

export default async function DealershipsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Get all dealerships
  const allDealerships = await getAllDealerships();
  
  // Get search query and current page from URL
  const searchQuery = searchParams.q || '';
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // Filter dealerships by search query
  const filteredDealerships = searchQuery
    ? searchDealerships(allDealerships, searchQuery)
    : allDealerships;
  
  // Paginate dealerships
  const { 
    dealerships, 
    totalPages, 
    totalItems 
  } = getPaginatedDealerships(filteredDealerships, currentPage, 12);
  
  // SEO content for Layout component
  const seoContent = {
    title: "Birmingham Car Dealerships Directory",
    content: `
      <p>
        Welcome to the most comprehensive Birmingham car dealerships directory. Our listings
        include all major dealerships in Birmingham, featuring both new and used car dealers,
        independent showrooms, and franchise dealerships.
      </p>
      <p>
        Whether you're looking for luxury vehicles, family cars, performance vehicles, or budget-friendly
        options, Birmingham's diverse range of car dealerships has something for everyone. Our
        directory makes it easy to find contact information, locations, and websites for the
        top car dealers in Birmingham.
      </p>
    `
  };
  
  // Set page title based on current page
  const pageTitle = currentPage > 1 
    ? `Birmingham Car Dealerships - Page ${currentPage}` 
    : "Birmingham Car Dealerships Directory";
  
  return (
    <Layout seoContent={{ ...seoContent, title: pageTitle }}>
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-red-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading text-white mb-4 tracking-tight">
              Birmingham Car Dealerships
              {currentPage > 1 && <span className="text-2xl ml-2">Page {currentPage}</span>}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our comprehensive directory of {allDealerships.length} car dealerships in Birmingham. 
              Find contact information, locations, and more.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Search */}
          <div className="mb-12 -mt-20">
            <DealershipSearch />
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-100 rounded-lg p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <Car className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{allDealerships.length} Dealerships</h3>
                <p className="text-gray-600">Comprehensive directory</p>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Birmingham Area</h3>
                <p className="text-gray-600">All locations covered</p>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Direct Contact</h3>
                <p className="text-gray-600">Phone & website information</p>
              </div>
            </div>
          </div>
          
          {/* Results */}
          {filteredDealerships.length > 0 ? (
            <div>
              {searchQuery && (
                <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h2 className="text-2xl font-heading text-red-900">
                    {filteredDealerships.length} dealerships found for "{searchQuery}"
                  </h2>
                </div>
              )}
              
              {currentPage > 1 && !searchQuery && (
                <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h2 className="text-2xl font-heading text-red-900">
                    Page {currentPage} of {totalPages}
                  </h2>
                </div>
              )}
              
              <DealershipGrid
                dealerships={dealerships}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                searchQuery={searchQuery}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-heading mb-4">No dealerships found</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                No dealerships match your search criteria. Please try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading mb-6 text-gray-900">
              Birmingham Car Dealerships Directory
            </h2>
            
            <div className="prose max-w-none">
              <p>
                Welcome to the most comprehensive Birmingham car dealerships directory. Our listings
                include all major dealerships in Birmingham, featuring both new and used car dealers,
                independent showrooms, and franchise dealerships.
              </p>
              <p>
                Whether you're looking for luxury vehicles, family cars, performance vehicles, or budget-friendly
                options, Birmingham's diverse range of car dealerships has something for everyone. Our
                directory makes it easy to find contact information, locations, and websites for the
                top car dealers in Birmingham.
              </p>
              <p className="text-red-600 font-medium">
                While browsing the local dealerships, don't forget to check out our own selection of 
                premium used vehicles. At ASM Performance Cars, we specialize in high-quality, well-maintained
                vehicles that offer excellent value and performance.
              </p>
              <h3 className="text-xl font-heading mt-6 mb-4">
                Finding the Right Birmingham Car Dealer
              </h3>
              <p>
                When searching for a car dealership in Birmingham, consider factors like location, 
                vehicle specialties, after-sales service, and customer reviews. Our directory helps
                you compare options and make an informed decision about where to purchase your next vehicle.
              </p>
              <p>
                Many Birmingham dealerships specialize in specific brands or types of vehicles. Whether
                you're looking for German luxury cars, Japanese reliability, American muscle cars, or
                efficient city vehicles, you'll find specialized dealers across Birmingham.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 