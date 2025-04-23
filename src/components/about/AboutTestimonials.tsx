"use client";

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  quote: string;
  role?: string;
  image?: string;
  rating?: number;
}

interface AboutTestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export default function AboutTestimonials({
  title,
  subtitle,
  testimonials,
}: AboutTestimonialsProps) {
  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="mb-4 relative">
                <div className="absolute -top-2 -left-2 text-red-600 text-5xl opacity-20 font-serif">
                  "
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic relative z-10">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="mt-auto pt-4 flex items-center">
                {testimonial.image && (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{testimonial.name}</h4>
                  {testimonial.role && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                  )}
                </div>
                
                {testimonial.rating && (
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating! 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-zinc-300 dark:text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 