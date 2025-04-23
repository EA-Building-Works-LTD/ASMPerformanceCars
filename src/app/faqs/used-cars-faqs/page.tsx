"use client"

import React, { useState } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import Link from 'next/link'
import { Car, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample FAQ data for Used Cars
const usedCarsFaqs = [
  {
    id: 'used-1',
    question: 'What should I check when viewing a used car?',
    answer: 'When viewing a used car, conduct a thorough inspection including: examining bodywork for damage, rust, uneven panel gaps or mismatched paint (signs of repairs); checking all electricals (lights, windows, wipers, air conditioning, infotainment system); inspecting tyres for legal tread depth (minimum 1.6mm) and even wear; checking fluid levels (oil, coolant, brake fluid) for proper levels and quality; testing all features and driving the car to assess performance, handling, brakes, gearbox, clutch, and listen for unusual noises. Also examine service history documentation, verify the mileage against MOT history, and run a vehicle history check to confirm there\'s no outstanding finance, previous write-offs, or mileage discrepancies. Consider arranging a professional pre-purchase inspection for peace of mind, especially for higher-value vehicles.'
  },
  {
    id: 'used-2',
    question: 'What documents should I receive when buying a used car?',
    answer: 'When purchasing a used car in the UK, you should receive: the V5C registration document (logbook) registered in your name or the seller\'s New Keeper Slip until your new V5C arrives; a valid MOT certificate for vehicles over three years old; the car\'s service history and maintenance records; the vehicle handbook and manual; any spare keys; and a receipt of sale documenting the transaction details, including parties involved, vehicle details, sale amount and date. For newer vehicles, you may also receive warranty documentation if manufacturer or extended warranty remains. It\'s advisable to ensure all DVLA documentation is completed correctly before completing the purchase, including confirming the VIN number on the vehicle matches all documentation.'
  },
  {
    id: 'used-3',
    question: 'Is it better to buy from a dealer or private seller?',
    answer: 'Buying from a dealership typically offers greater consumer protection through the Consumer Rights Act, which requires vehicles to be of satisfactory quality, fit for purpose, and as described—giving you comeback for faults discovered after purchase. Dealers often provide warranties, facilitate finance options, accept part-exchanges, and handle paperwork. In contrast, private sales operate on "buyer beware" principles with minimal legal protection beyond the car being accurately described and legally owned by the seller. While private sales might offer lower prices, the trade-off is increased risk and responsibility. Premium dealerships, especially those specialising in performance or luxury vehicles, often provide additional benefits like thorough inspections, detailed vehicle history, warranty packages, and ongoing support, making them particularly advantageous for high-value or specialised vehicles.'
  },
  {
    id: 'used-4',
    question: 'How important is a car\'s service history?',
    answer: 'A comprehensive service history is extremely valuable when purchasing a used car. It provides documented evidence that the vehicle has been properly maintained according to manufacturer recommendations, which is crucial for longevity and reliability. A complete service history typically increases a vehicle\'s value by 5-10% compared to identical models without records. For premium, performance or luxury vehicles, this difference can be even more significant—sometimes making a car virtually unsellable without proper documentation. When examining service history, look for regular servicing at recommended intervals, consistent mileage progression, specialist attention for complex systems, and evidence of timing belt/chain replacement if applicable. A full main dealer service history is particularly valuable for prestige vehicles, though specialist independent service history can also be acceptable if performed to manufacturer standards.'
  },
  {
    id: 'used-5',
    question: 'What should I know about car finance when buying used?',
    answer: 'When considering finance for a used car purchase, understand these key aspects: Hire Purchase (HP) involves paying fixed monthly instalments until you own the vehicle outright; Personal Contract Purchase (PCP) features lower monthly payments with a larger final "balloon payment" if you wish to keep the car; Personal Loans offer immediate ownership but potentially higher interest rates; and Lease Purchase combines elements of leasing and purchasing. For used cars, particularly older models, HP is often more suitable than PCP. Remember to check the APR (Annual Percentage Rate) rather than flat rate interest, factor in all fees, and consider the total amount payable rather than just monthly costs. Be cautious with dealer finance—shop around for competitive rates. Always ensure the car has no outstanding finance before purchase, as this could result in repossession even if you\'ve paid the seller.'
  },
  {
    id: 'used-6',
    question: 'How do I check a used car\'s history and mileage?',
    answer: 'To verify a used car\'s history and mileage in the UK, use multiple methods for thoroughness. Start with a professional vehicle history check from services like HPI, Experian, or the AA, which reveal outstanding finance, theft records, write-off status, plate changes, and mileage discrepancies. Cross-reference the MOT history using the government\'s free online service (www.gov.uk/check-mot-history), which shows test results, mileage readings, advisories, and failures over time—allowing you to spot suspicious mileage jumps or decreases. Review the service history for consistent mileage progression and regular maintenance. Physically inspect the car for wear consistent with the claimed mileage (pedals, steering wheel, seat bolsters, switches) and check that dashboard display functions don\'t appear tampered with. For valuable or classic cars, consider engaging marque specialists to verify authenticity.'
  },
  {
    id: 'used-7',
    question: 'What are common red flags when buying a used car?',
    answer: 'When purchasing a used car, be wary of these warning signs: reluctance to allow independent inspections or lengthy test drives; missing or incomplete service history and documentation; evidence of accident repair such as mismatched paint, uneven panel gaps, or fresh underseal; rust in structural areas or inconsistent welding; excessive tyre wear, especially if uneven across the axle; unusually low prices compared to market value; reluctant or evasive answers to direct questions; pressure tactics to make quick decisions; recent short-term ownership (potential attempts to flip problematic vehicles); vehicle being sold "as seen" with no returns policy; and a seller meeting at neutral locations rather than their home. For performance cars, additional concerns include aftermarket modifications without proper documentation, evidence of track use without specialised maintenance, and replacement parts from different or inferior manufacturers. Always trust your instincts—if something feels wrong, it often is.'
  },
  {
    id: 'used-8',
    question: 'How much should I budget for running costs when buying a used car?',
    answer: 'When budgeting for a used car, look beyond the purchase price to calculate total ownership costs. Annual expenses should include: insurance (obtain quotes before purchase, especially for performance vehicles where premiums can be substantial); road tax (varies significantly based on emissions and registration date); MOT testing (currently £54.85 maximum for cars); servicing (typically £150-£300 for mainstream vehicles, but potentially £500-£2,000+ for premium or performance cars); fuel costs (calculate based on annual mileage and real-world MPG figures rather than manufacturer claims); and wear items (budget for tyres, brakes, and other consumables—premium vehicles often require higher-specification components at greater cost). Also establish a contingency fund for unexpected repairs, increasing with vehicle age and complexity. For luxury or high-performance vehicles, specialised maintenance requirements can significantly impact ongoing costs, with some models requiring specific service procedures at certain mileage intervals.'
  }
];

export default function UsedCarsFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Used Cars FAQs" 
        subtitle="Essential guidance for purchasing pre-owned vehicles, inspections, and history checks"
        backgroundImage="/images/used-cars-hero.jpg"
      />
      
      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-600 rounded-full p-2">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Used Cars</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Our comprehensive guide to buying used cars covers everything from vehicle inspections and history checks to financing options and seller negotiations. Find expert advice to make your used car purchase with confidence.
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {usedCarsFaqs.map((faq) => (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
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
              </motion.div>
            ))}
          </div>
          
          {/* Navigation to other FAQ categories */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">Explore Other FAQ Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/faqs/car-buying-selling-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Car Buying/Selling FAQs</span>
              </Link>
              <Link href="/faqs/car-insurance-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Car Insurance FAQs</span>
              </Link>
              <Link href="/faqs/hybrid-electric-cars-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Hybrid/Electric Cars FAQs</span>
              </Link>
              <Link href="/faqs/modified-cars-faqs" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
                <span>Modified Cars FAQs</span>
              </Link>
            </div>
          </div>
          
          {/* Browse Used Cars Section */}
          <div className="mt-16 bg-zinc-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Browse Our Used Car Inventory</h3>
            <p className="mb-6">
              Ready to find your next vehicle? Explore our collection of premium used cars, each carefully inspected and prepared to our exacting standards.
            </p>
            <Link 
              href="/our-cars" 
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              View Current Stock
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 