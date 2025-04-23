import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Fuel, GaugeCircle, Calendar, Award } from 'lucide-react';

export interface VehicleProps {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  price: number;
  mileage: number;
  fuelType?: string;
  transmission?: string;
  exteriorColor?: string;
  status: string;
  description?: string;
  vin?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  images?: {
    url: string;
    alt?: string;
  }[];
  featured?: boolean;
  modified?: boolean;
  luxury?: boolean;
}

export function VehicleCard({ vehicle }: { vehicle: VehicleProps }) {
  const {
    id,
    slug,
    title,
    make,
    model,
    year,
    price,
    mileage,
    fuelType,
    transmission,
    mainImage,
    images,
    featured,
    modified,
    luxury
  } = vehicle;

  // Generate image URL and fallback
  const imageUrl = mainImage?.url || images?.[0]?.url || '/images/vehicle-placeholder.jpg';
  const imageAlt = mainImage?.alt || `${year} ${make} ${model}`;

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link href={`/our-cars/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={featured}
            quality={80}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-red-600 hover:bg-red-700">Featured</Badge>
            )}
            {modified && (
              <Badge className="bg-blue-600 hover:bg-blue-700">Modified</Badge>
            )}
            {luxury && (
              <Badge className="bg-amber-600 hover:bg-amber-700">Luxury</Badge>
            )}
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className="text-sm font-semibold bg-black/80 hover:bg-black px-3 py-1.5">
              {formatCurrency(price)}
            </Badge>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
              <span>{year}</span>
            </div>
            <div className="flex items-center">
              <GaugeCircle className="w-4 h-4 mr-1 text-gray-500" />
              <span>{mileage.toLocaleString()} miles</span>
            </div>
            {fuelType && (
              <div className="flex items-center">
                <Fuel className="w-4 h-4 mr-1 text-gray-500" />
                <span>{fuelType}</span>
              </div>
            )}
            {transmission && (
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-gray-500" />
                <span>{transmission}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* Schema.org structured data for vehicle */}
      <Script
        id={`vehicle-schema-${id}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            "name": title,
            "description": vehicle.description || `${year} ${make} ${model} ${vehicle.trim || ''}`.trim(),
            "brand": {
              "@type": "Brand",
              "name": make
            },
            "model": model,
            "vehicleConfiguration": vehicle.trim,
            "vehicleIdentificationNumber": vehicle.vin || undefined,
            "modelDate": year,
            "mileageFromOdometer": {
              "@type": "QuantitativeValue",
              "value": mileage,
              "unitCode": "SMI"
            },
            "fuelType": fuelType,
            "color": vehicle.exteriorColor,
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": "GBP",
              "availability": vehicle.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
              "seller": {
                "@type": "AutoDealer",
                "name": "ASM Performance Cars",
                "url": "https://asmperformancecars.co.uk"
              }
            },
            "image": imageUrl,
            "url": `https://asmperformancecars.co.uk/our-cars/${slug}`
          })
        }}
      />
    </div>
  );
} 