"use client"

import React, { useState } from 'react'
import FAQHero from '@/components/faq/FAQHero'
import Link from 'next/link'
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample FAQ data for Car Buying/Selling
const carBuyingSellingFaqs = [
  {
    id: 'buy-1',
    question: 'What\'s the best way to negotiate when buying a car?',
    answer: 'Effective car purchase negotiation involves thorough preparation. Before discussions, research the market value of the specific model, considering age, mileage, condition, and specification, using resources like Auto Trader, Parkers, and Glass\'s Guide. Identify potential issues during inspection and test drive to use as negotiation points. Begin with a reasonable opening offer (typically 10-15% below asking price), justifying it with market comparisons and any vehicle shortcomings. Remain polite but firm, willing to walk away if necessary. Focus on the total transaction value rather than just monthly payments if financing. Ask for added value (extended warranty, servicing package, or accessories) if the seller is rigid on price. For dealerships, consider timing your purchase towards month/quarter end when sales targets create more negotiation flexibility. Remember that premium or rare vehicles often have less room for price negotiation but may have flexibility on extras or finance terms.'
  },
  {
    id: 'buy-2',
    question: 'Should I buy a new or used car?',
    answer: 'The new versus used car decision depends on your priorities and financial situation. New cars offer manufacturer warranty (typically 3-7 years), the latest technology and safety features, no hidden history concerns, and personalised specification choices. However, they experience significant depreciation (potentially 15-35% in the first year) and require higher insurance and often higher road tax. Used cars avoid the steepest depreciation, provide more value for money in terms of specification level per pound spent, and generally have lower insurance and road tax costs. However, they come with less warranty coverage (unless manufacturer warranty remains or you purchase an extended warranty), potential hidden problems or damages, and older technology. For those seeking the middle ground, consider nearly-new vehicles (6-18 months old) with remaining manufacturer warranty, which avoid the most severe depreciation while providing relatively current technology and peace of mind.'
  },
  {
    id: 'buy-3',
    question: 'What\'s the difference between PCP, HP, and personal loans?',
    answer: 'When financing a vehicle purchase, understand these key differences: Personal Contract Purchase (PCP) involves lower monthly payments because you\'re only paying for the vehicle\'s depreciation during your contract, plus interest. At the end, you can pay a final "balloon payment" to own the car, trade it in for another vehicle, or simply return it. Hire Purchase (HP) spreads the entire vehicle cost over the term with slightly higher monthly payments than PCP, but you automatically own the car after the final payment with no balloon payment. Personal loans typically offer immediate ownership of the vehicle, more flexibility (no mileage restrictions or condition concerns), and the ability to sell anytime, but often have higher interest rates than manufacturer-backed PCP/HP deals. PCP works best for those who like changing cars regularly and can adhere to mileage limitations, while HP and personal loans are better for those planning to keep vehicles long-term or who need flexibility with high mileage or modifications.'
  },
  {
    id: 'buy-4',
    question: 'What\'s the best time to sell my car?',
    answer: 'The optimal timing for selling your car depends on several factors. Seasonally, convertibles and sports cars typically command higher prices in spring and summer, while 4x4s and AWD vehicles sell better in autumn and winter. Market demand fluctuations affect different vehicle types—for example, the current high demand for electric and hybrid vehicles. Vehicle age significantly impacts depreciation patterns: the steepest depreciation occurs in the first 3 years (especially the first year), plateauing around 5-8 years, making this potentially a good selling window before major components need replacement. Mileage also matters—consider selling before reaching significant thresholds (e.g., 60,000, 100,000 miles) that can affect value. Additionally, timing relative to your vehicle\'s MOT, service, or major maintenance needs can impact sale prospects; a vehicle with recently completed maintenance and long MOT tends to be more attractive to buyers and commands better prices.'
  },
  {
    id: 'buy-5',
    question: 'What are the advantages of part-exchanging my car?',
    answer: 'Part-exchanging your vehicle offers several advantages: convenience (avoiding the administration of selling privately); immediate transaction completion (rather than waiting for a private buyer); no concerns about payment security or fraud; potential tax benefits as you pay VAT only on the difference between your part-exchange and the new vehicle (when buying from a dealer); less paperwork as the dealer handles most administrative aspects; and avoiding the need to advertise, conduct viewings, or arrange test drives. While you may receive less money compared to private sales (typically 10-20% less), the time savings and reduced hassle can be worth the financial difference. Part-exchange can be particularly advantageous with prestige or specialist dealers who better understand your vehicle\'s value—especially important for modified or performance vehicles. Additionally, in some cases, part-exchanging may provide leverage for negotiating better terms on your new vehicle purchase.'
  },
  {
    id: 'buy-6',
    question: 'How do I prepare my car for sale to get the best price?',
    answer: 'To maximise your car\'s sale value, invest time in presentation and preparation. First, address mechanical issues—consider a pre-sale service and resolve any warning lights or noticeable faults. Second, thoroughly clean the exterior (professional detailing may be worthwhile for higher-value vehicles) including engine bay, wheels, and glass. Clean the interior comprehensively, removing stains, neutralising odours, and addressing wear where possible. Gather all documentation—complete service history, MOT certificates, purchase paperwork, and receipts for maintenance or modifications. Consider an MOT even if the current one hasn\'t expired to demonstrate vehicle condition. Remove personal items but keep original equipment (spare keys, tools, etc.). Create detailed, accurate listings with high-quality photographs from multiple angles in good lighting. For premium or performance vehicles, emphasise special features, specifications, recent maintenance work, and documented modifications. Finally, be realistic on pricing—research the market for comparable vehicles and set a competitive figure, being prepared to negotiate.'
  },
  {
    id: 'buy-7',
    question: 'What should I consider when buying a car on finance?',
    answer: 'When purchasing a car on finance, look beyond the headline monthly payment. Compare the APR (Annual Percentage Rate) rather than flat rate interest to understand the true cost. Calculate the total amount payable over the agreement term, including deposit, monthly payments, final payments, and any additional fees. Understand balloon payments in PCP agreements and ensure they align with likely future vehicle values. Consider mileage limitations (particularly with PCP)—exceeding agreed limits can trigger substantial charges. Review early termination terms and costs should your circumstances change. Confirm who is responsible for maintenance and servicing requirements. For used cars, ensure the finance term doesn\'t extend beyond your anticipated ownership period or the vehicle\'s reliability expectations. Explore GAP (Guaranteed Asset Protection) insurance for newer vehicles to protect against negative equity if written off. Compare dealer finance with direct lenders and manufacturer offers, noting that cash discounts might outweigh low-interest finance deals in some cases. Finally, ensure all finance terms are documented clearly before signing any agreements.'
  },
  {
    id: 'buy-8',
    question: 'What paperwork do I need to complete when selling my car?',
    answer: 'When selling a car in the UK, proper documentation is crucial: First, complete section 6 of the V5C registration document (logbook) with the buyer\'s details and send it to the DVLA, keeping the \"New Keeper Slip\" (V5C/2) as your proof of sale until you receive confirmation from DVLA. Create and sign a comprehensive receipt including vehicle details (registration, make, model, VIN), seller and buyer information, price, date, vehicle condition statement, and both signatures (keep a copy for yourself). Provide the buyer with the vehicle\'s service history, MOT certificates, spare keys, and manuals/documents. If applicable, complete a mileage disclaimer form to protect against future disputes. For vehicles with outstanding finance, obtain written permission from the finance company or settle the agreement before sale. Notify your insurance company to cancel coverage, arranging refunds if appropriate. Finally, maintain records of all communications with the buyer for at least two years as protection against potential future issues or disputes.'
  }
];

export default function CarBuyingSellingFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <FAQHero 
        title="Car Buying & Selling FAQs" 
        subtitle="Guidance on purchasing or selling vehicles, trade-ins, and negotiations"
        backgroundImage="/images/car-buying-hero.jpg"
      />
      
      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 rounded-full p-2">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Car Buying & Selling</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Our comprehensive guide covers everything you need to know about buying and selling vehicles, including tips for trade-ins, negotiations, and paperwork. Find expert advice to help you navigate the car market with confidence.
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {carBuyingSellingFaqs.map((faq) => (
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
              <Link href="/faqs/car-insurance-faqs" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <span>Car Insurance FAQs</span>
              </Link>
              <Link href="/faqs/modified-cars-faqs" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <span>Modified Cars FAQs</span>
              </Link>
              <Link href="/faqs/hybrid-electric-cars-faqs" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <span>Hybrid/Electric Cars FAQs</span>
              </Link>
              <Link href="/faqs/used-cars-faqs" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <span>Used Cars FAQs</span>
              </Link>
            </div>
          </div>
          
          {/* Related Services Section */}
          <div className="mt-16 bg-zinc-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Looking to Sell Your Car?</h3>
            <p className="mb-6">
              ASM Performance Cars offers competitive rates for quality vehicles. Contact us today to discuss selling your car or arranging a part exchange.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Discuss Selling Your Car
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 