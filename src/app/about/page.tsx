import { Metadata } from 'next';
import { groq } from 'next-sanity';
import AboutPageContent from '@/components/about/AboutPageContent';
import type { AboutPageData } from './types';

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'About Our Modified Cars & Values',
  description: 'Learn about ASM Performance Cars, our journey, our team, and our passion for high-performance and modified vehicles.',
  keywords: 'about ASM, car dealership history, performance car specialists, modified car experts, luxury car team',
  openGraph: {
    title: 'About Our Modified Cars & Values | ASM Performance Cars',
    description: 'Learn about ASM Performance Cars, our journey, our team, and our passion for high-performance and modified vehicles.',
  }
}

async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    // Query that matches the schema structure in Sanity
    const query = groq`*[_type == "aboutPage"][0]{
      "title": title,
      "metaDescription": metaDescription,
      "keywords": keywords,
      "seo": {
        "title": title,
        "description": metaDescription,
        "keywords": keywords
      },
      "heroTitle": heroTitle,
      "heroSubtitle": heroSubtitle,
      "heroBackgroundType": heroBackgroundType,
      "heroBackgroundColor": heroBackgroundColor,
      "heroImage": heroImage{
        "asset": {
          "_id": asset._id,
          "url": asset->url
        },
        "alt": alt
      },
      "heroCta": heroCta{
        "text": text,
        "url": url
      },
      "introTitle": introTitle,
      "introContent": introContent,
      "introImage": introImage{
        "asset": {
          "_id": asset._id,
          "url": asset->url
        },
        "alt": alt
      },
      "introImagePosition": introImagePosition,
      "storyTitle": storyTitle,
      "storySubtitle": storySubtitle,
      "storyContent": storyContent,
      "milestones": milestones[] {
        "year": year,
        "title": title,
        "description": description,
        "image": image{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        }
      },
      "valuesTitle": valuesTitle,
      "valuesSubtitle": valuesSubtitle,
      "valuesItems": values[] {
        "title": title,
        "description": description,
        "icon": icon
      },
      "valuesBackgroundColor": valuesBackgroundColor,
      "testimonialsTitle": testimonialsTitle,
      "testimonialsSubtitle": testimonialsSubtitle,
      "testimonialsItems": testimonials[]-> {
        "name": name,
        "quote": quote,
        "role": role,
        "image": image{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        },
        "rating": rating
      },
      "ctaTitle": ctaTitle,
      "ctaContent": ctaContent,
      "ctaButton": ctaButton,
      "ctaSecondaryButton": ctaSecondaryButton,
      "ctaBackgroundColor": ctaBackgroundColor
    }`;

    const data = await import('@/sanity/lib/client').then(({ client }) =>
      client.fetch<AboutPageData>(query, {}, { next: { tags: ['aboutPage'] } })
    );
    
    // For debugging - check what fields are coming back from Sanity
    console.log('Sanity data presence check:', {
      hasData: !!data,
      hasTitle: data?.title ? 'Yes' : 'No',
    });
    
    return data || null;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}

export default async function AboutPage() {
  // Fetch data from Sanity
  const sanityData = await getAboutPageData();
  
  // Prefer Sanity data when available; if none, reuse existing mapped mock data logic
  const pageData = sanityData ?? null;
  
  // Map the new schema structure to the structure expected by the AboutPageContent component
  // This allows us to use the existing component without changing it
  const mappedData: AboutPageData | null = pageData
    ? pageData
    : null;

  return (
    <main>
      {mappedData && <AboutPageContent data={mappedData} />}
    </main>
  );
} 