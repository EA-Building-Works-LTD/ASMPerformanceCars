"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Fuel, Calendar, Gauge, Info, ArrowRight, Car, AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { urlForImage } from '@/sanity/lib/client';

// StatusBadge component for consistent status display
function StatusBadge({ status }: { status: string }) {
  let bgColor = "";
  let textColor = "";
  let displayText = status;

  // Convert to lowercase for case-insensitive comparison
  const statusLower = status.toLowerCase();

  if (statusLower === "in stock" || statusLower === "available") {
    bgColor = "bg-green-100 hover:bg-green-200";
    textColor = "text-green-800";
    displayText = "In Stock";
  } else if (statusLower === "sold") {
    bgColor = "bg-red-100 hover:bg-red-200";
    textColor = "text-red-800";
    displayText = "Sold";
  } else if (
    statusLower === "pending collection" ||
    statusLower === "pending-collection"
  ) {
    bgColor = "bg-yellow-100 hover:bg-yellow-200";
    textColor = "text-yellow-800";
    displayText = "Pending Collection";
  } else if (statusLower === "coming soon" || statusLower === "coming-soon") {
    // Orange color for Coming Soon status - more vibrant to match the design
    bgColor = "bg-red-600 hover:bg-red-700";
    textColor = "text-white";
    displayText = "Coming Soon";
  } else if (statusLower === "reserved") {
    bgColor = "bg-purple-100 hover:bg-purple-200";
    textColor = "text-purple-800";
    displayText = "Reserved";
  } else {
    bgColor = "bg-gray-100 hover:bg-gray-200";
    textColor = "text-gray-800";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md ${bgColor} px-2.5 py-0.5 text-sm font-medium ${textColor} transition-colors`}
    >
      {displayText}
    </span>
  );
}

// Helper function to get the correct URL path based on vehicle type
function getVehicleUrl(vehicle: unknown) {
  // Check the vehicle type and return the appropriate URL path
  if (vehicle._type === "modifiedVehicle") {
    return `/our-cars/modified-cars-for-sale/${vehicle.slug.current}`;
  } else if (vehicle._type === "luxuryVehicle") {
    return `/our-cars/luxury-supercars-for-sale/${vehicle.slug.current}`;
  } else if (vehicle._type === "vehicle") {
    return `/our-cars/used-cars-for-sale/${vehicle.slug.current}`;
  }

  // Fallback to the new URL structure using modified as default
  return `/our-cars/modified-cars-for-sale/${vehicle.slug.current}`;
}

// Vehicle Card component - Matching the homepage design
const VehicleCard = ({ vehicle, index = 0 }: { vehicle: unknown, index?: number }) => {
  // Create default badges from vehicle attributes if no badges provided
  const defaultBadges = [];
  if (vehicle.featured) defaultBadges.push("Featured");
  if (vehicle._type === "modifiedVehicle") defaultBadges.push("Modified");
  if (vehicle._type === "luxuryVehicle") defaultBadges.push("Luxury");

  const displayBadges =
    vehicle.badges?.length > 0 ? vehicle.badges : defaultBadges;

  // Helper function to convert to title case
  const toTitleCase = (text: string) => {
    if (!text) return "";
    return text.replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  };

  // Get engine size, fuel type, transmission, and doors
  const engineSize = vehicle.specifications?.vehicle?.engineSize || "";
  const fuelType = vehicle.specifications?.vehicle?.fuelType || "";
  const transmission = vehicle.specifications?.vehicle?.transmission || "";
  const doors = vehicle.specifications?.vehicle?.doors || "";

  // Extract year and mileage
  const year = vehicle.year || vehicle.specifications?.vehicle?.year || "";
  const mileage =
    (
      vehicle.mileage || vehicle.specifications?.history?.mileage
    )?.toLocaleString() || "";

  return (
    <div 
      className="h-full animate-fadeInUp transition-transform duration-300 hover:-translate-y-1" 
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-lg rounded-lg bg-black">
        <div className="relative h-64 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {/* Display status badge if available */}
            {vehicle.specifications?.vehicle?.status && (
              <StatusBadge status={vehicle.specifications.vehicle.status} />
            )}

            {/* Display other badges */}
            {displayBadges.map((badge: string, idx: number) => (
              <Badge
                key={idx}
                variant={idx === 0 ? "default" : "outline"}
                className={
                  idx === 0
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-white text-white bg-black/30 backdrop-blur-sm hover:bg-black/40"
                }
              >
                {badge}
              </Badge>
            ))}
          </div>
          <Link href={getVehicleUrl(vehicle)}>
            {vehicle.mainImage ? (
              <Image
                src={urlForImage(vehicle.mainImage)
                  .width(800)
                  .height(600)
                  .url()}
                alt={vehicle.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </Link>
        </div>

        <CardContent className="flex-grow p-4 text-white">
          {/* Main title from vehicle */}
          <h3 className="text-xl font-bold mb-1">
            {toTitleCase(vehicle.title)}
          </h3>

          {/* Extended Info section */}
          {vehicle.extendedInfo && (
            <p className="text-sm text-gray-300 mb-2">
              {toTitleCase(vehicle.extendedInfo)}
            </p>
          )}

          {/* Highlighted specs section */}
          {vehicle.highlightedSpec && (
            <div className="flex flex-wrap gap-1 mb-3">
              {vehicle.highlightedSpec
                .split("|")
                .map((spec: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-red-600/20 text-red-400 px-2 py-0.5 rounded-sm text-xs"
                  >
                    {toTitleCase(spec.trim())}
                  </span>
                ))}
            </div>
          )}

          {/* Vehicle details with icons in a more compact row */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">{year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">{mileage}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">
                {toTitleCase(fuelType)}
              </span>
            </div>
            {engineSize && (
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-300">{engineSize}L</span>
              </div>
            )}
            {transmission && (
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-300">
                  {toTitleCase(transmission)}
                </span>
              </div>
            )}
            {doors && (
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v18h14V3H5zm9 11h-4v-2h4v2z"
                  />
                </svg>
                <span className="text-xs text-gray-300">{doors}dr</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0">
          <div className="w-full flex">
            <div className="flex-grow p-4 font-bold text-2xl text-white">
              {vehicle.priceOnApplication ? (
                <span>POA</span>
              ) : (
                <>£{vehicle.price?.toLocaleString()}</>
              )}
            </div>
            <Button asChild className="rounded-none h-auto py-4 px-6 bg-red-600 hover:bg-red-700">
              <Link href={getVehicleUrl(vehicle)}>
                View now
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function VehicleNoLongerAvailable() {
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch available vehicles when component mounts
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles/featured');
        if (response.ok) {
          const data = await response.json();
          setFeaturedVehicles(data.slice(0, 3)); // Take only up to 3 vehicles
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-zinc-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fadeIn">
            <div className="inline-block p-4 mb-6 rounded-full bg-red-600/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              This Vehicle Is No Longer Available
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              The high-performance vehicle you're looking for has been sold, but we have more exceptional cars in our inventory.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="rounded-md px-8 bg-red-600 hover:bg-red-700"
              >
                <Link href="/our-cars" className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Browse All Cars
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="rounded-md px-8 text-zinc-200 border-zinc-600 hover:bg-zinc-800 hover:text-white"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Car Sourcing Service
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Available Vehicles Section */}
          <div className="mt-20">
            <div className="text-center mb-8 animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                <span className="inline-block w-2 h-6 bg-red-600 rounded-sm mr-3 align-middle"></span>
                Available Modified Cars
              </h2>
            </div>
            
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-12 h-12 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
              </div>
            ) : featuredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {featuredVehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle?._id || index} vehicle={vehicle} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-12 bg-zinc-800 rounded-xl text-center">
                <p className="text-gray-400">Explore our current inventory on the main listings page.</p>
              </div>
            )}
            
            <div className="text-center mt-12 animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <Button
                asChild
                size="lg"
                className="rounded-md px-8 bg-red-600 hover:bg-red-700"
              >
                <Link href="/our-cars" className="flex items-center gap-2">
                  View All Vehicles
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-24 max-w-3xl mx-auto bg-zinc-800 rounded-2xl p-8 shadow-lg animate-fadeIn" style={{ animationDelay: '500ms' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Looking for Something Specific?</h2>
            <p className="text-gray-300 mb-6">
              If you're searching for a specific supercar or high-performance vehicle, our expert team can help source the perfect car for you. Let us know your requirements and we'll do the rest.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-md px-8 bg-red-600 hover:bg-red-700"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Contact Our Specialists
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
} 