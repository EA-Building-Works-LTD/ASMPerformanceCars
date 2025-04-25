"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight, CheckCircle, Loader2, MapPin, TruckIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PlacesAutocomplete } from '@/components/ui/places-autocomplete'

// Function to calculate the distance between two UK postcodes
// Uses the Google Maps Distance Matrix API via our backend
const calculateDistance = async (pickupPostcode: string, dropOffAddress: string) => {
  try {
    const response = await fetch('/api/distance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickupPostcode,
        dropOffAddress,
      }),
    });
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Not a JSON response - likely an error page
      console.error("API endpoint returned non-JSON response:", await response.text());
      throw new Error("API endpoint returned HTML instead of JSON - check if the API route exists");
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to calculate distance');
    }
    
    return data.distance;
  } catch (error) {
    throw error;
  }
};

// Function to calculate price based on distance
const calculatePrice = (distance: number) => {
  const BASE_FEE = 60; // Base fee of £60
  
  if (distance <= 5) {
    return BASE_FEE; // Flat rate of £60 for distances up to 5 miles
  } else {
    // For distances over 5 miles: £60 base fee + (distance * £2 per mile)
    return BASE_FEE + (distance * 2);
  }
};

// UK postcode validation regex
const isValidUKPostcode = (postcode: string) => {
  const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return regex.test(postcode);
};

export const TransportationCalculatorForm = () => {
  const [pickupPostcode, setPickupPostcode] = useState('')
  const [pickupFullAddress, setPickupFullAddress] = useState('')
  const [dropOffAddress, setDropOffAddress] = useState('')
  const [dropOffFullAddress, setDropOffFullAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ distance: number; price: number } | null>(null)
  
  // New state for the booking form
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  
  // Function to swap pickup and dropoff addresses
  const swapAddresses = () => {
    // Save current values
    const tempPickup = pickupPostcode;
    const tempPickupFull = pickupFullAddress;
    
    // Swap the values
    setPickupPostcode(dropOffAddress);
    setPickupFullAddress(dropOffFullAddress);
    setDropOffAddress(tempPickup);
    setDropOffFullAddress(tempPickupFull);
    
    // Clear any previous results or errors
    setResult(null);
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!pickupPostcode.trim()) {
      setError('Please enter a pickup location')
      return
    }
    
    if (!dropOffAddress.trim()) {
      setError('Please enter a drop off location')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Use full addresses if available
      const pickupLocation = pickupFullAddress || pickupPostcode;
      const dropOffLocation = dropOffFullAddress || dropOffAddress;
      
      // Calculate distance (now using the API)
      const distance = await calculateDistance(pickupLocation, dropOffLocation);
      
      // Calculate price based on distance
      const price = calculatePrice(distance);
      
      // Set the result
      setResult({ distance, price });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to calculate distance: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }
  
  const resetForm = () => {
    setResult(null);
    setShowBookingForm(false);
    setBookingSuccess(false);
  };
  
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate booking inputs
    if (!name.trim()) {
      setBookingError('Please enter your name');
      return;
    }
    
    if (!phone.trim()) {
      setBookingError('Please enter your phone number');
      return;
    }
    
    // Simple phone validation
    const phoneRegex = /^(?:\+44|0)[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setBookingError('Please enter a valid UK phone number');
      return;
    }
    
    setIsBookingLoading(true);
    setBookingError('');
    
    try {
      // Use full addresses if available
      const pickupLocation = pickupFullAddress || pickupPostcode;
      const dropOffLocation = dropOffFullAddress || dropOffAddress;
      
      // Submit booking to the API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          pickupPostcode: pickupLocation,
          dropOffAddress: dropOffLocation,
          price: result?.price,
          distance: result?.distance,
        }),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Not a JSON response - likely an error page
        console.error("Booking API returned non-JSON response:", await response.text());
        throw new Error("API endpoint returned HTML instead of JSON - check if the booking API route exists");
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }
      
      // Show success message
      setBookingSuccess(true);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setBookingError(message);
      
      // If we're getting HTML responses, we'll add a fallback behavior
      if (message.includes("API endpoint returned HTML")) {
        setBookingError("Booking API is not available. Please contact us directly instead.");
      }
    } finally {
      setIsBookingLoading(false);
    }
  };
  
  return (
    <div>
      {!result ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative z-20">
              <label htmlFor="pickupPostcode" className="block text-sm font-medium mb-2 dark:text-gray-200">
                Pickup Location
              </label>
              <PlacesAutocomplete
                id="pickupPostcode"
                value={pickupPostcode}
                onChange={(value, fullAddress) => {
                  setPickupPostcode(value);
                  if (fullAddress) setPickupFullAddress(fullAddress);
                }}
                placeholder="Enter pickup postcode or address"
                className="text-lg placeholder:text-gray-400 border-gray-300 dark:border-gray-700 h-12 font-medium"
                restrictions={{ country: "gb" }} // UK only
              />
            </div>
            
            {/* Add swap button */}
            <div className="relative flex justify-center my-2">
              <button
                type="button"
                onClick={swapAddresses}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors duration-200 z-30"
                title="Swap addresses"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 -z-10"></div>
            </div>
            
            <div className="relative z-10">
              <label htmlFor="dropOffAddress" className="block text-sm font-medium mb-2 dark:text-gray-200">
                Drop off Location
              </label>
              <PlacesAutocomplete
                id="dropOffAddress"
                value={dropOffAddress}
                onChange={(value, fullAddress) => {
                  setDropOffAddress(value);
                  if (fullAddress) setDropOffFullAddress(fullAddress);
                }}
                placeholder="Enter drop-off postcode or address"
                className="text-lg placeholder:text-gray-400 border-gray-300 dark:border-gray-700 h-12 font-medium"
                restrictions={{ country: "gb" }} // UK only
              />
              {error && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 transition-all duration-200 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Calculating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Calculate Price
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      ) : !showBookingForm ? (
        <div className="space-y-5">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Your Quote</h3>
                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">Best Rate</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{pickupFullAddress || pickupPostcode}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{dropOffFullAddress || dropOffAddress}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{result.distance} miles</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">
                    {result.distance <= 5 ? '£60 flat rate' : '£2 per mile'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-800">Total Price:</span>
                  <span className="text-2xl font-bold text-red-600">£{result.price}</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p>* Price includes VAT and standard transportation services.</p>
                  <p>* Additional charges may apply for special requirements.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={resetForm}
              variant="outline" 
              className="h-12"
            >
              Recalculate
            </Button>
            
            <Button 
              className="h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              onClick={() => setShowBookingForm(true)}
            >
              Book Now
            </Button>
          </div>
        </div>
      ) : bookingSuccess ? (
        <div className="space-y-5">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your booking. We will contact you shortly to arrange payment and confirm the details.
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Reference: {new Date().getTime().toString().slice(-6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={resetForm}
            className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white"
          >
            Start New Quote
          </Button>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          <h3 className="font-bold text-lg text-gray-800">Complete Your Booking</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-gray-200">
              Your Name
            </label>
            <Input
              id="name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg placeholder:text-gray-400 border-gray-300 dark:border-gray-700 h-12"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2 dark:text-gray-200">
              Phone Number
            </label>
            <Input
              id="phone"
              placeholder="E.g., 07123 456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg placeholder:text-gray-400 border-gray-300 dark:border-gray-700 h-12"
            />
            {bookingError && (
              <div className="flex items-center mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {bookingError}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Transport from:</span>
              <span className="font-medium">{pickupFullAddress || pickupPostcode}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Transport to:</span>
              <span className="font-medium">{dropOffFullAddress || dropOffAddress}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Price:</span>
              <span className="text-red-600">£{result.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button 
              type="button"
              onClick={() => setShowBookingForm(false)}
              variant="outline" 
              className="h-12"
            >
              Back
            </Button>
            
            <Button 
              type="submit"
              className="h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              disabled={isBookingLoading}
            >
              {isBookingLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Submit Booking
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
} 