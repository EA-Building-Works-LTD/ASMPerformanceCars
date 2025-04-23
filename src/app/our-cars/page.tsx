import React from "react";
import { getAllVehicles, getOurCarsPageContent } from "@/sanity/lib/client";
import { Layout } from "@/components/layout/Layout";
import { Metadata } from "next";
import Link from "next/link";
import { PaginatedVehicleGrid } from "@/components/vehicles/PaginatedVehicleGrid";
import { SoldVehicleGrid } from "@/components/vehicles/SoldVehicleGrid";

// Default metadata
export const metadata: Metadata = {
  title: "Our Cars",
  description:
    "Browse our complete stock of modified cars, luxury supercars, and quality used vehicles. Filter by make, model, price, and more to find your perfect car.",
};

export default async function OurStockPage() {
  // Fetch all vehicles from Sanity
  const allVehicles = await getAllVehicles();
  const pageContent = await getOurCarsPageContent();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {pageContent?.stockPageTitle || "Our Stock"}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto text-center">
          {pageContent?.stockPageDescription ||
            "Browse our complete inventory of high-performance, luxury, and quality used vehicles. Use the filters below to narrow down your search and find your perfect car."}
        </p>

        {/* Pass all vehicles to the PaginatedVehicleGrid component */}
        <PaginatedVehicleGrid vehicles={allVehicles} />
        
        {/* Display recently sold vehicles */}
        <SoldVehicleGrid vehicles={allVehicles} />

        {/* SEO Content Section */}
        <div className="mt-20 bg-black text-white p-12 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our Range of Modified Cars, Used Cars & Luxury Supercars
            </h2>
            <div className="prose prose-lg prose-invert mx-auto">
              <p>
                At ASM Performance Cars, we pride ourselves on offering an
                exceptional collection of cars to suit diverse preferences and
                requirements. Our stock includes professionally modified cars,
                luxury supercars, and quality used cars.All handpicked and
                prepared to our exacting standards. <br />
                <br />
              </p>
              <p>
                Each vehicle in our stock undergoes a comprehensive inspection
                process before being offered for sale. We provide transparent
                history, detailed specifications, and competitive pricing to
                ensure your car buying experience is straightforward and
                enjoyable. <br />
                <br />
              </p>
              <p>
                Whether you're looking for a modified car, the sophistication of a luxury model, or the
                reliability of a quality used car, our stock has something to match your driving aspirations.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <Link
                href="/our-cars/modified-cars-for-sale"
                className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-red-500">
                  Modified Cars
                </h3>
                <p className="text-gray-300">
                  Explore our collection of modified cars for sale..
                </p>
              </Link>
              <Link
                href="/our-cars/luxury-supercars-for-sale"
                className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-red-500">
                  Luxury & Supercars
                </h3>
                <p className="text-gray-300">
                  Discover luxury supercars that combine both worlds of performance and luxury.
                </p>
              </Link>
              <Link
                href="/our-cars/used-cars-for-sale"
                className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-red-500">
                  Used Cars
                </h3>
                <p className="text-gray-300">
                  Browse our selection of quality pre-owned vehicles at
                  competitive prices.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
