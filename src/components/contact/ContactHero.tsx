import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ContactHeroProps {
  title: string;
  subtitle?: string;
  backgroundType?: 'color' | 'image';
  backgroundColor?: string;
  backgroundImage?: string | null;
}

export default function ContactHero({
  title,
  subtitle,
  backgroundType = 'color',
  backgroundColor = 'bg-zinc-900',
  backgroundImage,
}: ContactHeroProps) {
  // Default background image if none provided
  const defaultImage = '/images/contact-hero-bg.jpg';
  
  return (
    <section className={cn(
      'relative pt-36 pb-24 overflow-hidden',
      backgroundType === 'color' ? backgroundColor || 'bg-zinc-900' : ''
    )}>
      {/* Background Image */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage || defaultImage}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-6",
            backgroundType === 'image' ? 'text-white' : 'text-zinc-800 dark:text-white'
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={cn(
              "text-xl md:text-2xl",
              backgroundType === 'image' ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-300'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
} 