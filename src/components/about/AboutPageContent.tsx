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
  const introImageUrl =
    typeof data.introduction?.image === 'string'
      ? data.introduction.image
      : (data.introduction?.image as { asset?: { url?: string } } | undefined)?.asset?.url

  const storyMilestones = (data.story?.milestones || []).map((milestone) => ({
    year: milestone.year,
    title: milestone.title,
    description: milestone.description || '',
    image: (milestone.image as { asset?: { url?: string } } | undefined)?.asset?.url,
  }))

  const values = (data.values?.values || []).map((value) => ({
    title: value.title,
    description: value.description || '',
    icon: value.icon,
  }))

  const testimonials = (data.testimonials?.testimonials || [])
    .filter((item): item is { name: string; quote: string; role?: string; image?: string; rating?: number } =>
      typeof item === 'object' && item !== null && 'name' in item && 'quote' in item
    )

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
          image={introImageUrl || undefined}
          imagePosition={data.introduction.imagePosition}
        />
      )}

      {/* Story Section */}
      {data.story && (
        <AboutStory
          title={data.story.title || 'Our Story'}
          subtitle={data.story.subtitle}
          content={data.story.content}
          milestones={storyMilestones}
        />
      )}

      {/* Values Section */}
      {values.length > 0 && (
        <AboutValues
          title={data.values?.title || 'Our Values'}
          subtitle={data.values?.subtitle}
          values={values}
          backgroundColor={data.values?.backgroundColor}
        />
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <AboutTestimonials
          title={data.testimonials?.title || 'What Our Customers Say'}
          subtitle={data.testimonials?.subtitle}
          testimonials={testimonials}
        />
      )}

      {/* CTA Section */}
      {data.cta && (
        <CommonCTA
          title={data.cta.title || 'Ready to Find Your Dream Car?'}
          content={data.cta.content}
          primaryButton={
            data.cta.buttonText && data.cta.buttonUrl
              ? { text: data.cta.buttonText, url: data.cta.buttonUrl }
              : undefined
          }
          secondaryButton={
            data.cta.secondaryButtonText && data.cta.secondaryButtonUrl
              ? { text: data.cta.secondaryButtonText, url: data.cta.secondaryButtonUrl }
              : undefined
          }
          backgroundColor={data.cta.backgroundColor}
        />
      )}
    </main>
  );
}