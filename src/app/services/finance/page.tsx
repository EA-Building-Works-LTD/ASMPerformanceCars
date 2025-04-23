import React from 'react'
import { Metadata } from 'next'
import { getFinancePage } from '@/sanity/lib/client'
import { FinanceHero } from '@/components/finance/FinanceHero'
import { FinanceIntro } from '@/components/finance/FinanceIntro'
import { FinanceOptions } from '@/components/finance/FinanceOptions'
import { FinanceProcess } from '@/components/finance/FinanceProcess'
import { FinanceCalculator } from '@/components/finance/FinanceCalculator'
import { FinanceFAQ } from '@/components/finance/FinanceFAQ'
import { FinanceCTA } from '@/components/finance/FinanceCTA'
import type { FinancePageData } from '@/app/services/finance/types'
import { mockFinanceData } from '@/app/services/finance/mockData'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { AlertTriangle } from 'lucide-react'

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const data = await getFinancePage()
  
  return {
    title: data?.title || 'Car Finance',
    description: data?.metaDescription || 'Finance options for your next vehicle',
    keywords: data?.keywords || ['car finance', 'vehicle finance', 'auto loans']
  } 
}
 
// Default calculator settings if none are provided
const defaultCalculator = {
  title: 'Calculate Your Monthly Payments',
  subtitle: 'Adjust the sliders to get an estimate of your monthly payments',
  settings: {
    defaultRate: 7.9,
    minLoanAmount: 1000,
    maxLoanAmount: 100000,
    minTerm: 12,
    maxTerm: 84,
    disclaimer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'This calculator provides an estimate only. Actual rates and payments will be determined based on your credit history and eligibility. Contact us for more details.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  }
}

export default async function FinancePage() {
  // Fetch Sanity data
  const pageData = await getFinancePage()
  
  // Check if we have data from Sanity, otherwise use mock data
  const isDev = process.env.NODE_ENV === 'development'
  
  // Default content in case Sanity data isn't available
  const data = pageData || mockFinanceData
  
  return (
    <main>
      {/* Admin Notice (only shown in development when no Sanity data exists) */}
      {isDev && !pageData && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <div className="container mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong className="font-medium">Admin Notice:</strong> No Finance Page document found in Sanity.
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  The page is currently using fallback content. To manage this content in Sanity Studio, either:
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-amber-700">
                  <li>Create a new "Finance Page" document in Sanity Studio, or</li>
                  <li>Use the <a href="/api/seed-finance-data" target="_blank" className="font-medium underline">data initialization API</a> with proper permissions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <FinanceHero
        title={data.heroTitle || data.title || 'Car Finance'}
        subtitle={data.heroSubtitle}
        ctaText={data.heroCta?.text}
        ctaUrl={data.heroCta?.url}
        backgroundImage={data.heroImage}
      />

      {/* Introduction Section */}
      <FinanceIntro
        title={data.introTitle || 'Car Finance Made Simple'}
        content={data.introContent}
        image={data.introImage}
        imagePosition="right"
        stats={data.introduction?.stats}
      />

      {/* Finance Options */}
      {data.financeOptions && (
        <FinanceOptions
          title={data.financeOptionsTitle || 'Our Finance Options'}
          subtitle={data.financeOptionsSubtitle}
          options={data.financeOptions}
        />
      )}

      {/* Finance Process */}
      {data.processSteps && (
        <FinanceProcess
          title={data.processTitle || 'How It Works'}
          subtitle={data.processSubtitle}
          steps={data.processSteps}
        />
      )}

      {/* Finance Calculator */}
      <div id="calculator">
        <FinanceCalculator
          title={data.calculatorTitle || defaultCalculator.title}
          subtitle={data.calculatorSubtitle || defaultCalculator.subtitle}
          settings={data.calculatorSettings || defaultCalculator.settings}
        />
      </div>

      {/* FAQ Section */}
      {data.faqs && (
        <FinanceFAQ
          title={data.faqTitle || 'Frequently Asked Questions'}
          subtitle={data.faqSubtitle}
          faqs={data.faqs}
        />
      )}

      {/* CTA Section */}
      <FinanceCTA
        title={data.cta?.title || 'Ready to Get Started?'}
        subtitle={data.cta?.subtitle}
        content={data.cta?.content}
        primaryButtonText={data.cta?.primaryButtonText || 'Get Started'}
        primaryButtonUrl={data.cta?.primaryButtonUrl || '/contact-us'}
        secondaryButtonText={data.cta?.secondaryButtonText}
        secondaryButtonUrl={data.cta?.secondaryButtonUrl}
        backgroundColor={data.cta?.backgroundColor || 'red'}
      />
    </main>
  )
} 