import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import AboutPageContent from '@/components/about/AboutPageContent';
import { mockAboutData } from './mockData';
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

    const data = await client.fetch<AboutPageData>(query, {}, { next: { tags: ['aboutPage'] } });
    
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
  
  // Use mock data as the base, but ONLY use Sanity data for fields that exist in the Sanity response
  const pageData = sanityData ? deepMergeWithFallback(mockAboutData, sanityData) : mockAboutData;
  
  // Map the new schema structure to the structure expected by the AboutPageContent component
  // This allows us to use the existing component without changing it
  const mappedData: AboutPageData = {
    ...pageData,
    // For backward compatibility
    hero: {
      title: pageData.heroTitle || pageData.hero?.title,
      subtitle: pageData.heroSubtitle || pageData.hero?.subtitle,
      backgroundType: pageData.heroBackgroundType || pageData.hero?.backgroundType,
      backgroundColor: pageData.heroBackgroundColor || pageData.hero?.backgroundColor,
      backgroundImage: pageData.heroImage 
        ? (typeof pageData.heroImage === 'string' 
            ? pageData.heroImage 
            : pageData.heroImage?.asset?.url) 
        : pageData.hero?.backgroundImage,
      ctaText: pageData.heroCta?.text || pageData.hero?.ctaText,
      ctaUrl: pageData.heroCta?.url || pageData.hero?.ctaUrl
    },
    introduction: {
      title: pageData.introTitle || pageData.introduction?.title,
      content: pageData.introContent || pageData.introduction?.content,
      image: pageData.introImage 
        ? (typeof pageData.introImage === 'string' 
            ? pageData.introImage 
            : pageData.introImage?.asset?.url) 
        : pageData.introduction?.image,
      imagePosition: pageData.introImagePosition || pageData.introduction?.imagePosition
    },
    story: {
      title: pageData.storyTitle || pageData.story?.title,
      subtitle: pageData.storySubtitle || pageData.story?.subtitle,
      content: pageData.storyContent || pageData.story?.content,
      milestones: pageData.milestones?.map((milestone: { 
        year: string; 
        title: string; 
        description: string; 
        image?: { 
          asset?: { 
            url?: string; 
          } 
        } 
      }) => ({
        year: milestone.year,
        title: milestone.title,
        description: milestone.description,
        image: milestone.image?.asset?.url || ''
      })) || pageData.story?.milestones
    },
    values: {
      title: pageData.valuesTitle || pageData.values?.title,
      subtitle: pageData.valuesSubtitle || pageData.values?.subtitle,
      values: pageData.valuesItems || pageData.values?.values,
      backgroundColor: pageData.valuesBackgroundColor || pageData.values?.backgroundColor
    },
    testimonials: {
      title: pageData.testimonialsTitle || pageData.testimonials?.title,
      subtitle: pageData.testimonialsSubtitle || pageData.testimonials?.subtitle,
      testimonials: pageData.testimonialsItems?.map((item: { 
        name: string; 
        quote: string; 
        role?: string; 
        image?: { 
          asset?: { 
            url?: string; 
          } 
        }; 
        rating?: number; 
      }) => ({
        name: item.name,
        quote: item.quote,
        role: item.role || '',
        image: item.image?.asset?.url || '',
        rating: item.rating
      })) || pageData.testimonials?.testimonials
    },
    cta: {
      title: pageData.ctaTitle || pageData.cta?.title,
      content: pageData.ctaContent || pageData.cta?.content,
      primaryButton: pageData.ctaButton ? {
        text: pageData.ctaButton.text,
        url: pageData.ctaButton.url
      } : pageData.cta?.primaryButton,
      secondaryButton: pageData.ctaSecondaryButton ? {
        text: pageData.ctaSecondaryButton.text,
        url: pageData.ctaSecondaryButton.url
      } : pageData.cta?.secondaryButton,
      backgroundColor: getBgColor(pageData.ctaBackgroundColor) || pageData.cta?.backgroundColor
    }
  };

  // Helper function to get proper background color
  function getBgColor(color?: string): string | undefined {
    if (!color) return undefined;
    
    if (color === 'red') return 'bg-red-600';
    if (color === 'gray') return 'bg-gray-800';
    if (color === 'white') return 'bg-white';
    
    return color; // Return as is if it already has the bg- prefix
  }

  // Improved helper function to deep merge objects with fallback
  function deepMergeWithFallback(target: any, source: any): any {
    const output = { ...target };
    
    if (!source || typeof source !== 'object') {
      return output;
    }
    
    // Loop through keys in the source object
    Object.keys(source).forEach(key => {
      // Only process keys that exist and have non-null/undefined values
      if (source[key] !== null && source[key] !== undefined) {
        // For arrays, replace the entire array with what comes from Sanity
        if (Array.isArray(source[key])) {
          output[key] = source[key];
        }
        // For nested objects (that aren't arrays), recursively merge
        else if (
          output[key] && 
          typeof output[key] === 'object' && 
          typeof source[key] === 'object' &&
          !Array.isArray(output[key])
        ) {
          output[key] = deepMergeWithFallback(output[key], source[key]);
        }
        // For primitive values or arrays, use the source value
        else {
          output[key] = source[key];
        }
      }
    });
    
    return output;
  }

  return (
    <main>
      <AboutPageContent data={mappedData} />
    </main>
  );
} 