import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  text?: string;
  url?: string;
}

interface CommonCTAProps {
  title: string;
  content?: any;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  backgroundColor?: string;
}

export function CommonCTA({
  title,
  content,
  primaryButton,
  secondaryButton,
  backgroundColor = 'bg-red-600',
}: CommonCTAProps) {
  return (
    <section className={cn('py-16 text-white', backgroundColor)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          
          {content && (
            <div className="mb-8 text-white/90">
              <PortableText value={content} />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton?.text && primaryButton?.url && (
              <Link
                href={primaryButton.url}
                className="bg-white text-red-600 hover:bg-zinc-100 px-6 py-3 rounded-md font-medium transition-colors"
              >
                {primaryButton.text}
              </Link>
            )}
            
            {secondaryButton?.text && secondaryButton?.url && (
              <Link
                href={secondaryButton.url}
                className="bg-transparent hover:bg-white/10 border border-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 