"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dealership } from '@/lib/dealerships/dealerships';

interface DealershipCardProps {
  dealership: Dealership;
}

export const DealershipCard: React.FC<DealershipCardProps> = ({ dealership }) => {
  return (
    <div className="h-full group">
      <Card className="h-full overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
        <CardHeader className="p-4 pb-3 border-b border-gray-100">
          <CardTitle className="text-lg font-heading tracking-wide text-gray-900 leading-tight">
            {dealership.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className="space-y-2 min-h-[110px]">
            {dealership.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-700">{dealership.location}</span>
              </div>
            )}
            {dealership.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                <a 
                  href={`tel:${dealership.phone}`} 
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {dealership.phone}
                </a>
              </div>
            )}
            {dealership.website ? (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-red-500 flex-shrink-0" />
                <a 
                  href={dealership.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-red-600 transition-colors truncate max-w-[200px]"
                >
                  {dealership.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm opacity-0 pointer-events-none">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span>No website available</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex flex-col space-y-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors group"
            asChild
          >
            <Link href={`/dealerships/${dealership.slug}`} className="flex items-center justify-center">
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
            asChild
          >
            <Link href="/our-cars">
              Browse Our Cars
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}; 