"use client"

import React, { useState } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import Link from 'next/link'
import { Banknote, ChevronDown, ChevronUp } from 'lucide-react'
import { carFinanceFaqs } from './data'

export default function CarFinanceFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Car Finance FAQs" 
        subtitle="Essential guidance for understanding car finance options, agreements, and payment terms"
        backgroundImage="/images/car-finance-hero.jpg"
      />
      
      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-600 rounded-full p-2">
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Car Finance</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Understanding car finance options is crucial for making informed decisions about your vehicle purchase. Our comprehensive guide covers everything from PCP and HP agreements to credit requirements and early termination options.
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {carFinanceFaqs.map((faq) => (
              <div 
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 text-left"
                >
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
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
          
          {/* Navigation to other FAQ categories */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">Explore Other FAQ Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/faqs/used-cars-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Used Cars FAQs</span>
              </Link>
              <Link href="/faqs/car-buying-selling-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Car Buying/Selling FAQs</span>
              </Link>
              <Link href="/faqs/car-insurance-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Car Insurance FAQs</span>
              </Link>
              <Link href="/faqs/hybrid-electric-cars-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Hybrid/Electric Cars FAQs</span>
              </Link>
            </div>
          </div>
          
          {/* Finance Application Section */}
          <div className="mt-16 bg-zinc-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore Your Finance Options?</h3>
            <p className="mb-6">
              Our finance specialists can help you find the perfect finance solution for your needs and circumstances, with competitive rates and flexible terms.
            </p>
            <Link 
              href="/finance" 
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Apply for Finance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 