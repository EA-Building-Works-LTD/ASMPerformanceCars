"use client"

import React, { useState } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Wrench } from 'lucide-react'
import Link from 'next/link'

// Sample FAQ data for Modified Cars
const modifiedCarFaqs = [
  {
    id: 'mod-1',
    question: 'How do vehicle modifications affect my insurance?',
    answer: 'Vehicle modifications typically affect insurance premiums because they can change the risk profile of your car. Performance modifications like engine tuning or turbocharging may increase premiums significantly as they enhance the vehicle\'s power and speed capability. Aesthetic modifications such as body kits and custom paint might have less impact. Always declare all modifications to your insurer to ensure your policy remains valid. Some specialist insurers cater specifically to modified vehicles and may offer more competitive rates than mainstream providers.',
  },
  {
    id: 'mod-2',
    question: 'Which car modifications are legal in the UK?',
    answer: 'In the UK, many modifications are legal provided they comply with safety and environmental regulations. All modifications must be declared to your insurer and noted on your vehicle\'s registration document (V5C). Legal modifications typically include aftermarket wheels (within certain specifications), suspension enhancements, ECU remapping, and aesthetic changes like body kits. However, excessively tinted windows (front must allow 70% light transmission), certain lighting alterations, and modifications affecting emissions may be illegal. Always check current regulations before modifying your vehicle, as non-compliance can result in MOT failure, fines, or your insurance being invalidated.',
  },
  {
    id: 'mod-3',
    question: 'Do I need to inform the DVLA about modifications to my car?',
    answer: 'Yes, certain modifications must be reported to the DVLA. These include significant changes to the vehicle\'s structure, engine, chassis, or body type. You should inform the DVLA if you change the colour of your vehicle, modify the engine capacity or fuel type, or make changes that substantially alter the vehicle\'s appearance or performance characteristics. The DVLA needs to be notified to ensure your vehicle registration document (V5C) accurately reflects the current state of your vehicle. Failure to notify the DVLA about relevant modifications can result in penalties and may affect your insurance validity.',
  },
  {
    id: 'mod-4',
    question: 'How do modifications affect a car\'s resale value?',
    answer: 'Modifications can have varied effects on a car\'s resale value. Quality performance modifications that enhance functionality, when properly documented and maintained, may appeal to enthusiast buyers and preserve or even increase value. However, most modifications typically decrease a vehicle\'s market appeal to general buyers and can reduce resale value. Extreme or poorly executed modifications often diminish value significantly. Tasteful, reversible modifications with receipts and professional installation documentation tend to fare better. When selling a modified car, targeting specialist buyers through enthusiast forums or dealerships like ours that specialise in modified vehicles can help achieve the best possible price.',
  },
  {
    id: 'mod-5',
    question: 'What are the most popular performance modifications?',
    answer: 'The most popular performance modifications include ECU remapping or chip tuning, which optimises the engine\'s electronic control unit for better performance; upgraded exhaust systems that improve exhaust flow and often enhance engine sound; cold air intakes that increase oxygen delivery to the engine; turbochargers or superchargers that boost engine power significantly; suspension upgrades like performance springs, dampers, and anti-roll bars; and brake system enhancements for improved stopping power. These modifications can substantially improve a vehicle\'s acceleration, handling, and overall driving experience, though each comes with considerations regarding legality, warranty implications, and maintenance requirements.',
  },
  {
    id: 'mod-6',
    question: 'Will modifying my car void the manufacturer\'s warranty?',
    answer: 'Modifying your car can potentially void parts of or the entire manufacturer\'s warranty, depending on the modifications and the manufacturer\'s policies. Most warranties include clauses that allow manufacturers to deny claims if failures are caused by aftermarket modifications. Performance modifications such as engine tuning, turbocharging, or suspension alterations are particularly likely to affect warranty coverage. However, manufacturers must prove that a specific modification caused the failure in question—they cannot void the entire warranty simply because modifications exist. Some modifications may only affect warranty coverage for related components rather than the entire vehicle. Always check your warranty terms and consider manufacturer-approved modifications if warranty coverage is important to you.',
  },
];

export default function ModifiedCarsFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Modified Cars FAQs" 
        subtitle="Everything you need to know about vehicle modifications, performance upgrades, and legality"
        backgroundImage="/images/modified-car-hero.jpg"
      />
      
      {/* FAQ Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-600 rounded-full p-2">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Modified Cars</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Find answers to common questions about modifying vehicles, performance enhancements, legal considerations, and more. Our comprehensive guide helps enthusiasts make informed decisions about their modified vehicles.
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {modifiedCarFaqs.map((faq) => (
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
              <Link href="/faqs/car-buying-selling-faqs" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <span>Car Buying/Selling FAQs</span>
              </Link>
              <Link href="/faqs/car-insurance-faqs" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <span>Car Insurance FAQs</span>
              </Link>
              <Link href="/faqs/hybrid-electric-cars-faqs" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <span>Hybrid/Electric Cars FAQs</span>
              </Link>
              <Link href="/faqs/used-cars-faqs" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <span>Used Cars FAQs</span>
              </Link>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-16 bg-zinc-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Didn't Find Your Answer?</h3>
            <p className="mb-6">
              If you couldn't find the information you were looking for about modified vehicles, our team is here to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Contact Our Specialists
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 