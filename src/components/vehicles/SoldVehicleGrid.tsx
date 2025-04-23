"use client";

import React from "react";
import { VehicleList } from "./VehicleList";
import { motion } from "framer-motion";
import { Trophy, Star, Calendar, CheckCircle, Pointer } from "lucide-react";
import Link from "next/link";

// Define a type for vehicle objects
interface VehicleType {
  _id?: string;
  _type?: string;
  title?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  status?: string;
  publicationDate?: string;
  specifications?: {
    vehicle?: {
      status?: string;
    };
  };
  [key: string]: any; // Allow other properties
}

interface SoldVehicleGridProps {
  vehicles: VehicleType[];
}

export function SoldVehicleGrid({ vehicles }: SoldVehicleGridProps) {
  // Filter vehicles that have a "sold" status
  const soldVehicles = vehicles.filter((vehicle) => vehicle.status === "sold");

  // Sort sold vehicles by publicationDate (most recent first)
  const sortedSoldVehicles = [...soldVehicles].sort((a, b) => {
    const dateA = new Date(a.publicationDate || 0);
    const dateB = new Date(b.publicationDate || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Show all sold vehicles instead of just the most recent 6
  const recentSoldVehicles = sortedSoldVehicles;

  // If there are no sold vehicles, don't render anything
  if (recentSoldVehicles.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 mb-12" aria-labelledby="recently-sold-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{ 
          background: 'linear-gradient(to bottom, #000000, #18181b)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          padding: '2rem 3rem'
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-10 w-10 text-red-500" />
            <h2
              id="recently-sold-heading"
              className="text-2xl md:text-3xl font-bold text-white"
            >
              Recently Sold Vehicles
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/80">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Showcasing our most recent succesful deals</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 mb-5 max-w-2xl mx-auto">
            Missed your chance? Contact us to express your interest in a
            specific car, whether its a modified car, luxury supercars or
            quality used cars. We regularly source premium vehicles for our
            customers.
          </p>
        </div>

        {/* Pass sold vehicles to the VehicleList component */}
        <VehicleList vehicles={recentSoldVehicles as any} />
        
        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 mb-8 rounded-md transition-colors"
          >
            <Pointer className="h-5 w-5" />
            <span>Register My Interest</span>
          </Link>
        </div>
      </motion.div>

      {/* SEO Content (hidden visually but available for search engines) */}
      <div className="sr-only">
        <h2>Previously Sold Performance and Luxury Vehicles</h2>
        <p>
          Explore our archive of recently sold vehicles, including modified
          performance cars, luxury supercars, and premium used vehicles. Our
          sold inventory demonstrates the quality and variety of automobiles we
          offer at ASM Performance Cars.
        </p>
        <p>
          Each sold vehicle in our history underwent rigorous inspection and
          preparation before delivery to ensure the highest standards of quality
          and reliability. Similar vehicles to these may become available in our
          future inventory.
        </p>
        <p>
          Our sold vehicle showcase features prestigious brands including BMW,
          Mercedes-Benz, Audi, Porsche, Ferrari, Lamborghini, and more. Browse
          our previously sold stock to get inspiration for your next automotive
          purchase.
        </p>
      </div>
    </section>
  );
}
