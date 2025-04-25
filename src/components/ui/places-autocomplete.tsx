"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { useOnClickOutside } from '@/lib/hooks/use-on-click-outside';
import { Loader2 } from 'lucide-react';
import getConfig from 'next/config';

// Get public runtime config
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

// Declare google maps types for TypeScript
declare global {
  interface Window {
    google?: typeof google;
    initGoogleMapsAutocomplete?: () => void;
    googleMapsLoaded?: boolean;
  }
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string, fullAddress?: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
  restrictions?: {
    country?: string;
  };
  searchOptions?: Partial<google.maps.places.AutocompletionRequest>;
}

let placesServiceInstance: google.maps.places.PlacesService | null = null;
let autocompleteServiceInstance: google.maps.places.AutocompleteService | null = null;

export const PlacesAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter an address",
  className = "",
  label,
  id = "places-autocomplete",
  restrictions = { country: "gb" }, // Default to UK
  searchOptions = {},
}: PlacesAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle click outside to close suggestions - type assertion to fix TypeScript error
  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => setShowSuggestions(false));
  
  useEffect(() => {
    // Load Google Maps script only once across components
    if (!window.googleMapsLoaded && !window.google?.maps?.places) {
      // Get API key from environment variables via Next.js config
      const apiKey = publicRuntimeConfig.GOOGLE_MAPS_API_KEY || 
                     process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_2025 || '';
      
      // If no API key, don't try to load the script
      if (!apiKey) {
        console.warn('No Google Maps API key found. Places autocomplete will not work.');
        return;
      }
      
      // Store init function globally to ensure it can be called when script loads
      window.initGoogleMapsAutocomplete = () => {
        window.googleMapsLoaded = true;
        
        if (window.google?.maps?.places) {
          autocompleteServiceInstance = new window.google.maps.places.AutocompleteService();
          
          // Create a dummy div for PlacesService (required but not used directly here)
          const dummyElement = document.createElement('div');
          placesServiceInstance = new window.google.maps.places.PlacesService(dummyElement);
        }
      };
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load Google Maps script. Places autocomplete will not work.');
      };
      document.head.appendChild(script);
    }
  }, [id]);
  
  // Get place details when a suggestion is selected
  const getPlaceDetails = (placeId: string) => {
    if (!placesServiceInstance && window.google?.maps?.places) {
      const dummyElement = document.createElement('div');
      placesServiceInstance = new window.google.maps.places.PlacesService(dummyElement);
    }
    
    if (!placesServiceInstance) {
      return;
    }
    
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId, 
      fields: ['formatted_address', 'geometry']
    };
    
    placesServiceInstance.getDetails(
      request,
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK && 
          place && 
          place.formatted_address
        ) {
          onChange(place.formatted_address, place.formatted_address);
        }
      }
    );
  };
  
  // Fetch suggestions when input changes
  const fetchSuggestions = (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    
    if (!autocompleteServiceInstance && window.google?.maps?.places) {
      autocompleteServiceInstance = new window.google.maps.places.AutocompleteService();
    }
    
    if (!autocompleteServiceInstance) {
      return;
    }
    
    setIsLoading(true);
    
    // Create a combined request with required input and other options
    const request = {
      input,
      componentRestrictions: restrictions,
      ...searchOptions
    };
    
    autocompleteServiceInstance.getPlacePredictions(
      request,
      (predictions, status) => {
        setIsLoading(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };
  
  // Debounce input to avoid too many API calls
  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const handler = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value]);
  
  const handleSelection = (suggestion: google.maps.places.AutocompletePrediction) => {
    getPlaceDetails(suggestion.place_id);
    setShowSuggestions(false);
  };

  // Add click handler to show suggestions when input is clicked
  const handleInputClick = () => {
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2 dark:text-gray-200">
          {label}
        </label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={handleInputClick}
          placeholder={placeholder}
          className={`${className} relative`}
          onFocus={() => {
            if (value) {
              fetchSuggestions(value);
            }
          }}
        />
        
        {isLoading && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelection(suggestion)}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 