import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { ConsignmentHero } from '@/components/consignment/ConsignmentHero'
import { ConsignmentIntro } from '@/components/consignment/ConsignmentIntro'
import { ConsignmentBenefits } from '@/components/consignment/ConsignmentBenefits'
import { ConsignmentProcess } from '@/components/consignment/ConsignmentProcess'
import { ConsignmentComparison } from '@/components/consignment/ConsignmentComparison'
import { ConsignmentTestimonials } from '@/components/consignment/ConsignmentTestimonials'
import { ConsignmentFAQ } from '@/components/consignment/ConsignmentFAQ'
import { ConsignmentCTA } from '@/components/consignment/ConsignmentCTA'
import { mockConsignmentData } from './mockData'
import { ConsignmentPageData } from './types'

export const revalidate = 3600 // Revalidate every hour

// Cast mock data once so all downstream usage has a consistent type
const fallbackData = mockConsignmentData as unknown as ConsignmentPageData

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getConsignmentPageData()
    const source = data || fallbackData
    const title = source.seo?.title || source.title
    const description = source.seo?.description || source.description
    const keywords = source.seo?.keywords

    return {
      title,
      description,
      keywords: keywords?.join(', '),
    }
  } catch (error) {
    console.error('Error generating metadata:', error)

    return {
      title: fallbackData.seo?.title,
      description: fallbackData.seo?.description,
      keywords: fallbackData.seo?.keywords?.join(', '),
    }
  }
}

async function getConsignmentPageData(): Promise<ConsignmentPageData | null> {
  try {
    const query = groq`*[_type == "consignmentPage"][0]{
      "title": title,
      "description": metaDescription,
      "seo": {
        "title": title,
        "description": metaDescription,
        "keywords": keywords
      },
      "hero": {
        "title": heroTitle,
        "subtitle": heroSubtitle,
        "backgroundType": heroBackgroundType,
        "backgroundColor": heroBackgroundColor,
        "backgroundImage": heroImage{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        },
        "ctaText": heroCta.text,
        "ctaUrl": heroCta.url
      },
      "introduction": {
        "title": introTitle,
        "content": introContent,
        "image": introImage{
          "asset": {
            "_id": asset._id,
            "url": asset->url
          },
          "alt": alt
        },
        "imagePosition": introImagePosition
      },
      "benefits": {
        "title": benefitsTitle,
        "subtitle": benefitsSubtitle,
        "items": benefits[] {
          "title": title,
          "description": description,
          "icon": icon
        },
        "backgroundType": benefitsBackgroundType,
        "backgroundColor": benefitsBackgroundColor
      },
      "process": {
        "title": processTitle,
        "subtitle": processSubtitle,
        "steps": processSteps[] {
          "stepNumber": stepNumber,
          "title": title,
          "description": description,
          "icon": icon
        },
        "ctaText": processCta.text,
        "ctaUrl": processCta.url
      },
      "comparison": {
        "title": comparisonTitle,
        "subtitle": comparisonSubtitle,
        "methods": comparisonMethods[] {
          "method": method,
          "pros": pros,
          "cons": cons,
          "description": description
        }
      },
      "testimonials": {
        "title": testimonialsTitle,
        "subtitle": testimonialsSubtitle,
        "items": testimonials[] -> {
          "name": name,
          "quote": quote,
          "soldCar": soldCar,
          "rating": rating,
          "image": image
        }
      },
      "faq": {
        "title": faqTitle,
        "subtitle": faqSubtitle,
        "faqs": faqs[] {
          "question": question,
          "answer": answer
        }
      },
      "cta": {
        "title": ctaTitle,
        "content": ctaContent,
        "buttonText": ctaButton.text,
        "buttonUrl": ctaButton.url,
        "backgroundColor": ctaBackgroundColor
      }
    }`

    const data = await client.fetch<ConsignmentPageData>(query)

    console.log('Sanity data presence check:', {
      hasData: !!data,
      hasTitle: data?.title ? 'Yes' : 'No',
      hasHero: data?.hero ? 'Yes' : 'No',
      hasIntro: data?.introduction ? 'Yes' : 'No',
      hasBenefits: data?.benefits ? 'Yes' : 'No',
      hasProcess: data?.process ? 'Yes' : 'No',
      hasComparison: data?.comparison ? 'Yes' : 'No',
      hasTestimonials: data?.testimonials ? 'Yes' : 'No',
      hasFaq: data?.faq ? 'Yes' : 'No',
      hasCta: data?.cta ? 'Yes' : 'No',
    })

    return data || null
  } catch (error) {
    console.error("Error fetching consignment page data:", error)
    return null
  }
}

export default async function ConsignmentPage() {
  const sanityData = await getConsignmentPageData()

  // Both branches are now ConsignmentPageData, so no union-type issues
  const pageData: ConsignmentPageData = sanityData || fallbackData

  // Debug logs
  if (pageData.hero) {
    console.log('Hero data:', pageData.hero)
    console.log('Hero background image:', pageData.hero.backgroundImage)
  }

  if (pageData.introduction) {
    console.log('Introduction data:', pageData.introduction)
    console.log('Introduction image:', pageData.introduction.image)
  }

  // Helper function to create default string value
  const defaultTitle = (title?: string) => title || ''

  // Helper function to map background type
  const mapBackgroundType = (type?: 'light' | 'dark' | 'colored') => {
    if (type === 'light') return 'white'
    if (type === 'dark' || type === 'colored') return 'color'
    return 'white'
  }

  return (
    <main>
      {/* Hero Section */}
      {pageData.hero && (
        <ConsignmentHero
          title={defaultTitle(pageData.hero.title)}
          subtitle={pageData.hero.subtitle}
          ctaText={pageData.hero.ctaText}
          ctaUrl={pageData.hero.ctaUrl}
          backgroundType={pageData.hero.backgroundType}
          backgroundColor={pageData.hero.backgroundColor}
          backgroundImage={pageData.hero.backgroundImage}
        />
      )}

      {/* Introduction Section */}
      {pageData.introduction && (
        <ConsignmentIntro
          title={defaultTitle(pageData.introduction.title)}
          content={pageData.introduction.content}
          image={pageData.introduction.image}
          imagePosition={pageData.introduction.imagePosition}
        />
      )}

      {/* Benefits Section */}
      {pageData.benefits && (
        <ConsignmentBenefits
          title={defaultTitle(pageData.benefits.title)}
          subtitle={pageData.benefits.subtitle}
          benefits={pageData.benefits.items || []}
          backgroundType={mapBackgroundType(pageData.benefits.backgroundType)}
          backgroundColor={pageData.benefits.backgroundColor}
        />
      )}

      {/* Process Section */}
      {pageData.process && (
        <ConsignmentProcess
          title={defaultTitle(pageData.process.title)}
          subtitle={pageData.process.subtitle}
          steps={pageData.process.steps || []}
          ctaText={pageData.process.ctaText}
          ctaUrl={pageData.process.ctaUrl}
        />
      )}

      {/* Comparison Section */}
      {pageData.comparison && pageData.comparison.methods && pageData.comparison.methods.length > 0 && (
        <ConsignmentComparison
          title={defaultTitle(pageData.comparison.title)}
          subtitle={pageData.comparison.subtitle}
          methods={pageData.comparison.methods}
        />
      )}

      {/* Testimonials Section */}
      {pageData.testimonials && pageData.testimonials.items && pageData.testimonials.items.length > 0 && (
        <ConsignmentTestimonials
          title={defaultTitle(pageData.testimonials.title)}
          subtitle={pageData.testimonials.subtitle}
          testimonials={pageData.testimonials.items}
        />
      )}

      {/* FAQ Section */}
      {pageData.faq && pageData.faq.faqs && pageData.faq.faqs.length > 0 && (
        <ConsignmentFAQ
          title={defaultTitle(pageData.faq.title)}
          subtitle={pageData.faq.subtitle}
          faqs={pageData.faq.faqs}
        />
      )}

      {/* CTA Section */}
      {pageData.cta && (
        <ConsignmentCTA
          title={defaultTitle(pageData.cta.title)}
          content={pageData.cta.content}
          buttonText={pageData.cta.buttonText}
          buttonUrl={pageData.cta.buttonUrl}
          backgroundColor={pageData.cta.backgroundColor === 'red' ? 'bg-red-600' :
                            pageData.cta.backgroundColor === 'gray' ? 'bg-gray-800' :
                            'bg-red-600'}
        />
      )}
    </main>
  )
}