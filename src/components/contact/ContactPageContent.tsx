import React from 'react';
import type { ContactPageData } from '@/app/contact/types';
import ContactHero from './ContactHero';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import ContactMap from './ContactMap';
import ContactFAQ from './ContactFAQ';
import { CommonCTA } from '@/components/common/CommonCTA';

interface ContactPageContentProps {
  data: ContactPageData;
}

export default function ContactPageContent({ data }: ContactPageContentProps) {
  return (
    <main>
      {/* Hero Section */}
      {data.hero && (
        <ContactHero
          title={data.hero.title || data.title}
          subtitle={data.hero.subtitle}
          backgroundType={data.hero.backgroundType}
          backgroundColor={data.hero.backgroundColor}
          backgroundImage={data.hero.backgroundImage}
        />
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Information Section */}
          {data.contactInfo && (
            <div className="lg:col-span-5">
              <ContactInfo
                title={data.contactInfo.title || 'Contact Us'}
                subtitle={data.contactInfo.subtitle}
                address={data.contactInfo.address}
                phone={data.contactInfo.phone}
                email={data.contactInfo.email}
                openingHours={data.contactInfo.openingHours}
                socialLinks={data.contactInfo.socialLinks}
              />
            </div>
          )}

          {/* Contact Form Section */}
          {data.contactForm && (
            <div className="lg:col-span-7">
              <ContactForm
                title={data.contactForm.title || 'Send Us a Message'}
                subtitle={data.contactForm.subtitle}
                submitButtonText={data.contactForm.submitButtonText || 'Send Message'}
                successMessage={data.contactForm.successMessage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {data.map && (
        <ContactMap
          title={data.map.title || 'Our Location'}
          subtitle={data.map.subtitle}
          latitude={data.map.latitude || 52.8085}
          longitude={data.map.longitude || -2.1169}
          zoom={data.map.zoom || 15}
          showDirectionsLink={data.map.showDirectionsLink}
          directionsLinkText={data.map.directionsLinkText}
        />
      )}

      {/* FAQ Section */}
      {data.faq?.faqs && data.faq.faqs.length > 0 && (
        <ContactFAQ
          title={data.faq.title || 'Frequently Asked Questions'}
          subtitle={data.faq.subtitle}
          faqs={data.faq.faqs}
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