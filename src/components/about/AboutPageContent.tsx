import React from 'react';
import type { AboutPageData } from '@/app/about/types';
import AboutHero from './AboutHero';
import AboutIntroduction from './AboutIntroduction';
import AboutStory from './AboutStory';
import AboutValues from './AboutValues';
import AboutTestimonials from './AboutTestimonials';
import { CommonCTA } from '@/components/common/CommonCTA';

interface AboutPageContentProps {
  data: AboutPageData;
}

export default function AboutPageContent({ data }: AboutPageContentProps) {
  return (
    <main>
      {/* Hero Section */}
      {data.hero && (
        <AboutHero
          title={data.hero.title || data.title || ''}
          subtitle={data.hero.subtitle}
          backgroundType={data.hero.backgroundType}
          backgroundColor={data.hero.backgroundColor}
          backgroundImage={data.hero.backgroundImage || undefined}
          ctaText={data.hero.ctaText}
          ctaUrl={data.hero.ctaUrl}
        />
      )}

      {/* Introduction Section */}
      {data.introduction && (
        <AboutIntroduction
          title={data.introduction.title || 'About Us'}
          content={data.introduction.content}
          image={data.introduction.image || undefined}
          imagePosition={data.introduction.imagePosition}
        />
      )}

      {/* Story Section */}
      {data.story && (
        <AboutStory
          title={data.story.title || 'Our Story'}
          subtitle={data.story.subtitle}
          content={data.story.content}
          milestones={data.story.milestones || []}
        />
      )}

      {/* Values Section */}
      {data.values?.values && data.values.values.length > 0 && (
        <AboutValues
          title={data.values.title || 'Our Values'}
          subtitle={data.values.subtitle}
          values={data.values.values}
          backgroundColor={data.values.backgroundColor}
        />
      )}

      {/* Testimonials Section */}
      {data.testimonials?.testimonials && data.testimonials.testimonials.length > 0 && (
        <AboutTestimonials
          title={data.testimonials.title || 'What Our Customers Say'}
          subtitle={data.testimonials.subtitle}
          testimonials={data.testimonials.testimonials}
        />
      )}

      {/* CTA Section */}
      {data.cta && (
        <CommonCTA
          title={data.cta.title || 'Ready to Find Your Dream Car?'}
          content={data.cta.content}
          primaryButton={data.cta.primaryButton}
          secondaryButton={data.cta.secondaryButton}
          backgroundColor={data.cta.backgroundColor}
        />
      )}
    </main>
  );
} 