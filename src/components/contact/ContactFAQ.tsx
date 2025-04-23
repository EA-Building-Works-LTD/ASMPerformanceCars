"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: unknown[]; // PortableText content
}

interface ContactFAQProps {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
}

export default function ContactFAQ({ title, subtitle, faqs }: ContactFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-zinc-200 dark:divide-zinc-800">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-zinc-500 transition-transform duration-200",
                    openIndex === index ? "transform rotate-180" : ""
                  )}
                />
              </button>
              <div
                className={cn(
                  "mt-2 text-zinc-600 dark:text-zinc-400 transition-all duration-200 overflow-hidden",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="pt-2">
                  <PortableText value={faq.answer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 