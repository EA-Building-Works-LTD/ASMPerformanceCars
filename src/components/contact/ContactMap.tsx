import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ContactMapProps {
  title: string;
  subtitle?: string;
  latitude: number;
  longitude: number;
  zoom: number;
  showDirectionsLink?: boolean;
  directionsLinkText?: string;
}

export default function ContactMap({
  title,
  subtitle,
  latitude,
  longitude,
  zoom,
  showDirectionsLink = false,
  directionsLinkText = 'Get Directions',
}: ContactMapProps) {
  // Generate Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=${zoom}`;
  
  // Generate Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps location"
            className="absolute inset-0"
          ></iframe>
        </div>

        {showDirectionsLink && (
          <div className="text-center mt-6">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              {directionsLinkText}
              <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
} 