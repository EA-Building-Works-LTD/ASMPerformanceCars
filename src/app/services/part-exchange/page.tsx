import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { ExchangeHero } from '@/components/part-exchange/ExchangeHero'
import { ExchangeIntro } from '@/components/part-exchange/ExchangeIntro'
import { ExchangeBenefits } from '@/components/part-exchange/ExchangeBenefits'
import { ExchangeProcess } from '@/components/part-exchange/ExchangeProcess'
import { ExchangeValuation } from '@/components/part-exchange/ExchangeValuation'
import { ExchangeTestimonials } from '@/components/part-exchange/ExchangeTestimonials'
import { ExchangeFAQ } from '@/components/part-exchange/ExchangeFAQ'
import { ExchangeCTA } from '@/components/part-exchange/ExchangeCTA'
import { mockPartExchangeData } from './mockData'
import { PartExchangePageData } from './types'

export const revalidate = 3600 // Revalidate every hour

// Cast mock data once so all downstream usage has a consistent type
const fallbackData = mockPartExchangeData as unknown as PartExchangePageData

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPartExchangePageData()
    const source = data || fallbackData

    let baseTitle = source.seo?.title || source.title || "Part Exchange Your Car"

    if (!baseTitle.includes("| ASM Performance Cars")) {
      baseTitle = baseTitle.split('|')[0].trim()
      baseTitle = `${baseTitle} | ASM Performance Cars`
    }

    const description = source.seo?.description || source.description
    const keywords = source.seo?.keywords

    return {
      title: baseTitle,
      description,
      keywords: keywords?.join(', '),
    }
  } catch (error) {
    console.error('Error generating metadata:', error)

    return {
      title: "Part Exchange Your Car | ASM Performance Cars",
      description: fallbackData.seo?.description,
      keywords: fallbackData.seo?.keywords?.join(', '),
    }
  }
}

async function getPartExchangePageData(): Promise<PartExchangePageData | null> {
  try {
    const query = groq`*[_type == "partExchangePage"][0]{
      "title": title,
      "description": description,
      "seo": {
        "title": seo.title,
        "description": seo.description,
        "keywords": seo.keywords
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
        "title": benefits.title,
        "subtitle": benefits.subtitle,
        "items": benefits.items[] {
          "title": title,
          "description": description,
          "icon": icon
        },
        "backgroundType": benefits.backgroundType,
        "backgroundColor": benefits.backgroundColor
      },
      "process": {
        "title": process.title,
        "subtitle": process.subtitle,
        "steps": process.steps[] {
          "stepNumber": stepNumber,
          "title": title,
          "description": description,
          "icon": icon
        },
        "ctaText": process.ctaText,
        "ctaUrl": process.ctaUrl
      },
      "valuation": {
        "title": valuation.title,
        "subtitle": valuation.subtitle,
        "description": valuation.description,
        "ctaText": valuation.ctaText,
        "ctaUrl": valuation.ctaUrl
      },
      "testimonials": {
        "title": testimonials.title,
        "subtitle": testimonials.subtitle,
        "items": testimonials.items[] {
          "name": name,
          "quote": quote,
          "exchangedCar": exchangedCar,
          "purchasedCar": purchasedCar,
          "rating": rating,
          "image": image
        }
      },
      "faq": {
        "title": faq.title,
        "subtitle": faq.subtitle,
        "faqs": faq.faqs[] {
          "question": question,
          "answer": answer
        }
      },
      "cta": {
        "title": cta.title,
        "content": cta.content,
        "primaryButtonText": cta.primaryButton.text,
        "primaryButtonUrl": cta.primaryButton.url,
        "secondaryButtonText": cta.secondaryButton.text,
        "secondaryButtonUrl": cta.secondaryButton.url,
        "backgroundColor": cta.backgroundColor
      }
    }`

    const data = await client.fetch<PartExchangePageData>(query)

    console.log('Sanity data presence check:', {
      hasData: !!data,
      hasTitle: data?.title ? 'Yes' : 'No',
      hasHero: data?.hero ? 'Yes' : 'No',
      hasIntro: data?.introduction ? 'Yes' : 'No',
      hasBenefits: data?.benefits ? 'Yes' : 'No',
      hasProcess: data?.process ? 'Yes' : 'No',
      hasValuation: data?.valuation ? 'Yes' : 'No',
      hasTestimonials: data?.testimonials ? 'Yes' : 'No',
      hasFaq: data?.faq ? 'Yes' : 'No',
      hasCta: data?.cta ? 'Yes' : 'No',
    })

    if (data?.testimonials?.items) {
      console.log('Testimonials items count:', data.testimonials.items.length)
    }

    if (data?.benefits?.items) {
      console.log('Benefits items count:', data.benefits.items.length)
    }

    return data
  } catch (error) {
    console.error('Error fetching part exchange page data:', error)
    return null
  }
}

export default async function PartExchangePage() {
  const sanityData = await getPartExchangePageData()

  // Both branches are now PartExchangePageData, so no union-type issues
  const pageData: PartExchangePageData = sanityData || fallbackData

  // After merging, log what we're actually using
  console.log('Page data after merge - key sections check:', {
    title: pageData.title,
    heroTitle: pageData.hero?.title,
    benefitsTitle: pageData.benefits?.title,
    hasTestimonials: (pageData.testimonials?.items?.length ?? 0) > 0 ? 'Yes' : 'No',
    faqCount: pageData.faq?.faqs?.length,
  })

  // Add special debugging for testimonials to check data structure
  if (sanityData?.testimonials) {
    console.log('Raw testimonials from Sanity:', JSON.stringify(sanityData.testimonials, null, 2))
  }

  if (pageData.testimonials?.items) {
    console.log('Merged testimonials data structure:',
      pageData.testimonials.items.map((item: any) => ({
        name: item.name,
        hasQuote: !!item.quote,
        hasImage: !!item.image,
        imageType: item.image ? typeof item.image : 'none'
      }))
    )

    if (pageData.testimonials.items.length > 0) {
      console.log('First testimonial complete structure:', JSON.stringify(pageData.testimonials.items[0], null, 2))
    }
  }

  // Handle possible mismatch between items and testimonials array naming
  if (pageData.testimonials && !pageData.testimonials.items &&
      (pageData.testimonials as any).testimonials &&
      Array.isArray((pageData.testimonials as any).testimonials)) {
    console.log('Found testimonials array at testimonials.testimonials instead of testimonials.items')
    pageData.testimonials.items = (pageData.testimonials as any).testimonials
  }

  // Helper function to create default string value
  const defaultTitle = (title?: string) => title || ''

  // Helper function to map background type
  const mapBackgroundType = (type?: 'light' | 'dark' | 'colored') => {
    if (type === 'light') return 'white'
    if (type === 'dark' || type === 'colored') return 'color'
    return 'white'
  }

  // Debug logs
  if (pageData.hero) {
    console.log('Hero data:', pageData.hero)
    console.log('Hero background image:', pageData.hero.backgroundImage)
  }

  if (pageData.introduction) {
    console.log('Introduction data:', pageData.introduction)
    console.log('Introduction image:', pageData.introduction.image)
  }

  return (
    <main>
      {/* Hero Section */}
      {pageData.hero && (
        <ExchangeHero
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
        <ExchangeIntro
          title={defaultTitle(pageData.introduction.title)}
          content={pageData.introduction.content}
          image={pageData.introduction.image}
          imagePosition={pageData.introduction.imagePosition}
        />
      )}

      {/* Benefits Section */}
      {pageData.benefits && (
        <ExchangeBenefits
          title={defaultTitle(pageData.benefits.title)}
          subtitle={pageData.benefits.subtitle}
          benefits={pageData.benefits.items || []}
          backgroundType={mapBackgroundType(pageData.benefits.backgroundType)}
          backgroundColor={pageData.benefits.backgroundColor}
        />
      )}

      {/* Process Section */}
      {pageData.process && (
        <ExchangeProcess
          title={defaultTitle(pageData.process.title)}
          subtitle={pageData.process.subtitle}
          steps={pageData.process.steps || []}
          ctaText={pageData.process.ctaText}
          ctaUrl={pageData.process.ctaUrl}
        />
      )}

      {/* Valuation Tool Section */}
      {pageData.valuation && (
        <ExchangeValuation
          title={defaultTitle(pageData.valuation.title)}
          subtitle={pageData.valuation.subtitle}
          description={pageData.valuation.description}
          ctaText={pageData.valuation.ctaText}
          ctaUrl={pageData.valuation.ctaUrl}
        />
      )}

      {/* Testimonials Section */}
      {pageData.testimonials && ((pageData.testimonials.items && pageData.testimonials.items.length > 0) ||
                                ((pageData.testimonials as any).testimonials && (pageData.testimonials as any).testimonials.length > 0)) && (
        <ExchangeTestimonials
          title={defaultTitle(pageData.testimonials.title)}
          subtitle={pageData.testimonials.subtitle}
          testimonials={pageData.testimonials.items || (pageData.testimonials as any).testimonials}
        />
      )}

      {/* FAQ Section */}
      {pageData.faq && pageData.faq.faqs && pageData.faq.faqs.length > 0 && (
        <ExchangeFAQ
          title={defaultTitle(pageData.faq.title)}
          subtitle={pageData.faq.subtitle}
          faqs={pageData.faq.faqs}
        />
      )}

      {/* CTA Section */}
      {pageData.cta && (
        <ExchangeCTA
          title={defaultTitle(pageData.cta.title)}
          content={pageData.cta.content}
          primaryButton={pageData.cta.primaryButtonText && pageData.cta.primaryButtonUrl ?
            { text: pageData.cta.primaryButtonText, url: pageData.cta.primaryButtonUrl } :
            undefined
          }
          secondaryButton={pageData.cta.secondaryButtonText && pageData.cta.secondaryButtonUrl ?
            { text: pageData.cta.secondaryButtonText, url: pageData.cta.secondaryButtonUrl } :
            undefined
          }
          backgroundColor={pageData.cta.backgroundColor === 'red' ? 'bg-red-600' :
                           pageData.cta.backgroundColor === 'gray' ? 'bg-gray-800' :
                           'bg-red-600'}
        />
      )}
    </main>
  )
}