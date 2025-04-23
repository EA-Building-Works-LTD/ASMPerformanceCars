"use client"

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '@/lib/algolia-search';

interface FAQSearchResultsProps {
  results: FAQItem[];
  openFAQ: string | null;
  onToggleFAQ: (id: string) => void;
}

export default function FAQSearchResults({ results, openFAQ, onToggleFAQ }: FAQSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse our FAQ categories for more information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-4">
        {results.map((faq) => (
          <div 
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => onToggleFAQ(faq.id)}
              className="w-full flex justify-between items-center p-5 hover:bg-gray-50 text-left"
            >
              <div>
                <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                {faq.category && (
                  <span className="text-sm text-gray-500 mt-1 block">
                    Category: {faq.category}
                  </span>
                )}
              </div>
              {openFAQ === faq.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            
            {openFAQ === faq.id && (
              <div className="p-5 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 