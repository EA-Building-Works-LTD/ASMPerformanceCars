import React from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { cn } from '@/lib/utils';

interface AboutIntroductionProps {
  title: string;
  content?: any;
  image?: string;
  imagePosition?: 'left' | 'right';
}

export default function AboutIntroduction({
  title,
  content,
  image,
  imagePosition = 'right',
}: AboutIntroductionProps) {
  // Default placeholder image if none provided
  const defaultImage = '/images/about-placeholder.jpg';
  
  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid gap-8 items-center",
          image ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          {/* Text content - Order changes based on image position */}
          <div className={cn(
            "max-w-2xl",
            imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
          )}>
            <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">{title}</h2>
            
            {content && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <PortableText value={content} />
              </div>
            )}
          </div>
          
          {/* Image */}
          {image && (
            <div className={cn(
              "relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg",
              imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
            )}>
              <Image
                src={image || defaultImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 