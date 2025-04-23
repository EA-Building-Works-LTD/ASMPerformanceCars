"use client"

import React, { useState } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import Link from 'next/link'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample FAQ data for Car Insurance
const carInsuranceFaqs = [
  {
    id: 'ins-1',
    question: 'What types of car insurance are available in the UK?',
    answer: 'In the UK, there are three main types of car insurance: Third Party Only (the minimum legal requirement, covering damage to other people\'s property and injuries to others), Third Party, Fire and Theft (adds protection if your car is stolen or damaged by fire), and Comprehensive (the highest level of cover, including damage to your own vehicle regardless of fault). Additional specialised policies include classic car insurance, modified car insurance, multi-car policies, black box insurance (telematics), and temporary cover. Each offers different levels of protection at varying premiums, with comprehensive generally providing the most extensive coverage despite sometimes being competitively priced.'
  },
  {
    id: 'ins-2',
    question: 'How are car insurance premiums calculated?',
    answer: 'Car insurance premiums in the UK are calculated based on several risk factors: your age and driving experience (younger drivers typically pay more), your claims and driving history, your occupation and address (areas with higher crime rates attract higher premiums), the vehicle\'s make, model, age, value and insurance group rating, annual mileage, where the car is parked overnight, and any vehicle modifications. Insurance companies also consider your voluntary excess (higher excess usually means lower premiums), your no-claims bonus, and whether you pay annually or monthly. Each insurer weighs these factors differently, which is why premiums can vary significantly between providers.'
  },
  {
    id: 'ins-3',
    question: 'What is a no-claims bonus and how does it work?',
    answer: 'A no-claims bonus (NCB) or no-claims discount is a reward for not making a claim on your car insurance. For each claim-free year, you accumulate a discount on your premium, typically building up to a maximum of around 5 years (though some insurers offer more). The discount can significantly reduce your premium—often by up to 70% after 5 years. If you make a claim where you\'re at fault, you\'ll typically lose some or all of your no-claims bonus unless you\'ve purchased no-claims bonus protection. Minor claims like windscreen repair usually don\'t affect your NCB, and neither do claims where you\'re proven not at fault and your insurer recovers costs from the third party.'
  },
  {
    id: 'ins-4',
    question: 'How do I insure a modified car?',
    answer: 'To insure a modified car in the UK, you must declare all modifications to your insurer, even aesthetic ones. Standard insurers often charge significantly higher premiums for modified vehicles or may decline cover altogether, particularly for performance enhancements. Specialist modified car insurers are usually the best option, as they understand the modified car community and offer more competitive rates. When obtaining quotes, provide detailed information about each modification, including manufacturer details and professional installation certificates. Some specialists offer "like-for-like" cover for modifications, ensuring replacements match your specifications. Many also offer agreed value policies—important for heavily modified vehicles whose market value doesn\'t reflect the investment made.'
  },
  {
    id: 'ins-5',
    question: 'What does a car insurance excess mean?',
    answer: 'A car insurance excess is the amount you agree to pay towards a claim before your insurer covers the rest. There are two types: compulsory excess (set by the insurer and non-negotiable) and voluntary excess (an additional amount you choose to pay to reduce your premium). In the event of a claim, you pay the total of both excesses. For example, with a £200 compulsory and £150 voluntary excess, you would pay the first £350 of any claim. Higher voluntary excesses typically lower premiums but mean more out-of-pocket expense when claiming. When choosing your voluntary excess, consider your financial situation and ensure it\'s an amount you could comfortably afford to pay unexpectedly.'
  },
  {
    id: 'ins-6',
    question: 'How does having points on my licence affect my insurance?',
    answer: 'Having penalty points on your driving licence can significantly impact your car insurance premiums in the UK. Insurers view points as indicators of risky driving behaviour, which increases the likelihood of making a claim. Even minor offences like speeding can increase premiums by 20-30%, while more serious offences like drink driving can double or triple your costs. Points remain on your licence for 4-11 years depending on the offence, but their insurance impact typically lessens over time. You must always disclose points to insurers when asked—failing to do so could invalidate your policy and is considered insurance fraud, potentially resulting in prosecution. Some specialist insurers offer more competitive rates for drivers with points.'
  },
  {
    id: 'ins-7',
    question: 'Is it worth paying for additional extras on my policy?',
    answer: 'The value of car insurance add-ons depends on your specific circumstances. Breakdown cover can be worthwhile if not already covered elsewhere, especially for older vehicles or frequent long-distance drivers. Legal expenses insurance (typically £20-30 annually) helps recover uninsured losses and legal costs following an accident. Courtesy car cover ensures continued mobility while your vehicle is being repaired. No-claims bonus protection may benefit those with substantial no-claims discounts, though it doesn\'t prevent premium increases following claims. Personal accident cover and key cover might duplicate existing protections in home insurance or bank accounts. Before purchasing add-ons, check for existing coverage elsewhere, compare standalone policies (often cheaper), and consider whether the additional cost justifies the benefits for your specific situation.'
  }
];

export default function CarInsuranceFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Car Insurance FAQs" 
        subtitle="Essential information about insuring standard, modified, and luxury vehicles"
        backgroundImage="/images/car-insurance-hero.jpg"
      />
      
      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-600 rounded-full p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Car Insurance</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Our comprehensive guide to car insurance covers everything from basic insurance types to specialist coverage for modified and luxury vehicles. Find answers to your most pressing insurance questions below.
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {carInsuranceFaqs.map((faq) => (
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
              <Link href="/faqs/car-buying-selling-faqs" className="text-green-600 hover:text-green-800 flex items-center gap-2">
                <span>Car Buying/Selling FAQs</span>
              </Link>
              <Link href="/faqs/modified-cars-faqs" className="text-green-600 hover:text-green-800 flex items-center gap-2">
                <span>Modified Cars FAQs</span>
              </Link>
              <Link href="/faqs/hybrid-electric-cars-faqs" className="text-green-600 hover:text-green-800 flex items-center gap-2">
                <span>Hybrid/Electric Cars FAQs</span>
              </Link>
              <Link href="/faqs/used-cars-faqs" className="text-green-600 hover:text-green-800 flex items-center gap-2">
                <span>Used Cars FAQs</span>
              </Link>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-16 bg-zinc-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Need Insurance Advice?</h3>
            <p className="mb-6">
              If you have specific questions about insuring your vehicle, especially if it's modified or high-performance, our team can help connect you with specialist insurers.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 