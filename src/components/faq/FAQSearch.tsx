"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FAQSearchProps {
  onSearch: (term: string) => void;
}

export default function FAQSearch({ onSearch }: FAQSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-zinc-900 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
          How can we help you?
        </h2>
        <p className="text-gray-300 mb-6 text-center max-w-xl mx-auto">
          Search our FAQs for quick answers about modified vehicles, car buying, insurance, and more.
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
          <div className="relative flex">
            <Input
              type="text"
              placeholder="Search for answers..."
              className="w-full h-14 pl-12 pr-4 rounded-l-lg border-0 focus-visible:ring-1 focus-visible:ring-red-500 bg-white text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Button 
              type="submit"
              className="h-14 rounded-l-none rounded-r-lg bg-red-600 hover:bg-red-700 px-6 text-white font-semibold"
            >
              Search
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Popular searches: 
          <span 
            className="inline-block mx-2 text-red-500 cursor-pointer hover:underline"
            onClick={() => {
              setSearchTerm('modified car insurance');
              onSearch('modified car insurance');
            }}
          >
            modified car insurance
          </span>
          <span 
            className="inline-block mx-2 text-red-500 cursor-pointer hover:underline"
            onClick={() => {
              setSearchTerm('car finance');
              onSearch('car finance');
            }}
          >
            car finance
          </span>
          <span 
            className="inline-block mx-2 text-red-500 cursor-pointer hover:underline"
            onClick={() => {
              setSearchTerm('selling modified car');
              onSearch('selling modified car');
            }}
          >
            selling modified car
          </span>
        </div>
      </div>
    </div>
  );
} 