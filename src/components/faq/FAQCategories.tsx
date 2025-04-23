"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Battery, Wrench, Car } from 'lucide-react';

// Define the FAQ categories with their respective icons and URLs
const faqCategories = [
  {
    id: 'car-buying-selling',
    title: 'Car Buying/Selling',
    description: 'Guidance on purchasing or selling vehicles, trade-ins, and negotiations',
    icon: ShoppingCart,
    url: '/faqs/car-buying-selling-faqs',
    color: 'from-blue-600 to-blue-800',
    hoverColor: 'from-blue-500 to-blue-700'
  },
  {
    id: 'car-insurance',
    title: 'Car Insurance',
    description: 'Information about insuring standard, luxury, and modified vehicles',
    icon: Shield,
    url: '/faqs/car-insurance-faqs',
    color: 'from-green-600 to-green-800',
    hoverColor: 'from-green-500 to-green-700'
  },
  {
    id: 'hybrid-electric-cars',
    title: 'Hybrid/Electric Cars',
    description: 'Details about electric vehicles, charging, maintenance, and benefits',
    icon: Battery,
    url: '/faqs/hybrid-electric-cars-faqs',
    color: 'from-purple-600 to-purple-800',
    hoverColor: 'from-purple-500 to-purple-700'
  },
  {
    id: 'modified-cars',
    title: 'Modified Cars',
    description: 'Answers about car modifications, performance upgrades, and legality',
    icon: Wrench,
    url: '/faqs/modified-cars-faqs',
    color: 'from-red-600 to-red-800',
    hoverColor: 'from-red-500 to-red-700'
  },
  {
    id: 'used-cars',
    title: 'Used Cars',
    description: 'Information about purchasing pre-owned vehicles, inspections, and history checks',
    icon: Car,
    url: '/faqs/used-cars-faqs',
    color: 'from-amber-600 to-amber-800',
    hoverColor: 'from-amber-500 to-amber-700'
  }
];

export default function FAQCategories() {
  return (
    <section className="py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ Categories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our collection of FAQs about modified cars, car insurance, car finance and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {faqCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link href={category.url} className="block h-full">
                <div className={`bg-gradient-to-br ${category.color} hover:${category.hoverColor} rounded-xl shadow-lg p-6 text-white h-full transition-all duration-300 transform`}>
                  <div className="bg-white/20 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 