"use client";

import React from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';

interface Milestone {
  year: string;
  title: string;
  description: string;
  image?: string;
}

interface AboutStoryProps {
  title: string;
  subtitle?: string;
  content?: any;
  milestones?: Milestone[];
}

export default function AboutStory({
  title,
  subtitle,
  content,
  milestones = [],
}: AboutStoryProps) {
  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        {content && (
          <div className="max-w-3xl mx-auto mb-16 prose prose-zinc dark:prose-invert">
            <PortableText value={content} />
          </div>
        )}

        {milestones.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-600"></div>
            
            {/* Milestones */}
            <div className="space-y-24">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  {/* Year Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold z-10">
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{milestone.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{milestone.description}</p>
                  </div>
                  
                  {/* Image (optional) */}
                  <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                    {milestone.image && (
                      <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={milestone.image}
                          alt={milestone.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 