import { Metadata } from 'next';
import ContactPageContent from '@/components/contact/ContactPageContent';
import { Layout } from '@/components/layout/Layout';
import { mockContactData } from './mockData';
import type { ContactPageData } from './types';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getContactData();
    
    return {
      title: data.seo?.title || data.title,
      description: data.seo?.description || data.description,
      keywords: data.seo?.keywords || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Contact Us | ASM Performance Cars',
      description: 'Get in touch with our team for any inquiries about our vehicles, services, or to schedule a viewing.',
    };
  }
}

async function getContactData(): Promise<ContactPageData> {
  try {
    // GROQ query to fetch contact page data
    const query = `*[_type == "contactPage"][0]{
      title,
      description,
      "seo": {
        "title": seo.title,
        "description": seo.description,
        "keywords": seo.keywords
      },
      "hero": {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "backgroundType": hero.backgroundType,
        "backgroundColor": hero.backgroundColor,
        "backgroundImage": hero.backgroundImage.asset->url
      },
      "contactInfo": {
        "title": contactInfo.title,
        "subtitle": contactInfo.subtitle,
        "address": contactInfo.address,
        "phone": contactInfo.phone,
        "email": contactInfo.email,
        "openingHours": contactInfo.openingHours,
        "socialLinks": contactInfo.socialLinks
      },
      "contactForm": {
        "title": contactForm.title,
        "subtitle": contactForm.subtitle,
        "submitButtonText": contactForm.submitButtonText,
        "successMessage": contactForm.successMessage
      },
      "map": {
        "title": map.title,
        "subtitle": map.subtitle,
        "latitude": map.latitude,
        "longitude": map.longitude,
        "zoom": map.zoom,
        "showDirectionsLink": map.showDirectionsLink,
        "directionsLinkText": map.directionsLinkText
      },
      "faq": {
        "title": faq.title,
        "subtitle": faq.subtitle,
        "faqs": faq.faqs
      },
      "cta": {
        "title": cta.title,
        "content": cta.content,
        "primaryButton": {
          "text": cta.primaryButton.text,
          "url": cta.primaryButton.url
        },
        "secondaryButton": {
          "text": cta.secondaryButton.text,
          "url": cta.secondaryButton.url
        },
        "backgroundColor": cta.backgroundColor
      }
    }`;

    const data = await import('@/sanity/lib/client').then(({ client }) =>
      client.fetch(query, {}, { next: { tags: ['contactPage'], revalidate: 60 } })
    );
    
    // Return the Sanity data if available, otherwise use mock data
    if (!data || !data.title) {
      console.log('Insufficient contact page data from Sanity, using fallback data');
      return mockContactData;
    }
    
    
    return data;
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    // Fallback to mock data if there's an error
    return mockContactData;
  }
}

export default async function ContactPage() {
  const pageData = await getContactData();
  

  return (
    <Layout seoContent={pageData.seo}>
      <ContactPageContent data={pageData} />
    </Layout>
  );
}