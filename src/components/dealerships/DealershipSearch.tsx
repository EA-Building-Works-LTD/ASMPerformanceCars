"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

export const DealershipSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initQuery);
  const [isFocused, setIsFocused] = useState(false);
  
  // Push route changes when search query changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchParam = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      
      // Always reset to page 1 when performing a new search
      params.delete('page');
      
      // Use full page refresh for more reliable behavior
      window.location.href = `/dealerships?${params.toString()}`;
    }, 300),
    [searchParams]
  );
  
  // Update search params when query changes
  useEffect(() => {
    if (searchQuery !== initQuery) {
      updateSearchParam(searchQuery);
    }
  }, [searchQuery, updateSearchParam, initQuery]);
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam.flush(); // Immediately execute debounced function
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-1">
        <div 
          className={`
            relative 
            flex 
            items-center 
            border-2 
            rounded-full 
            px-5
            py-3
            transition-all 
            ${isFocused ? 'border-red-500 shadow-sm' : 'border-gray-200'}
          `}
        >
          <Search className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
          
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Birmingham dealerships by name or location..."
            className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 py-0 h-auto text-base"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="ml-1 rounded-full h-8 w-8 hover:bg-red-50"
              type="button"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
            </Button>
          )}
          
          <Button
            type="submit"
            className="ml-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 text-sm"
          >
            Search
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        Search by dealership name, location, or phone number
      </p>
    </form>
  );
}; 