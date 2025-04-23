import { NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'

export async function GET() {
  const query = groq`*[_type == "financePage"][0] {
    title,
    metaDescription,
    keywords,
    heroTitle,
    heroSubtitle,
    heroImage,
    heroCta,
    introTitle,
    introContent,
    introImage,
    financeOptionsTitle,
    financeOptionsSubtitle,
    financeOptions,
    processTitle,
    processSubtitle,
    processSteps,
    calculatorTitle,
    calculatorSubtitle,
    calculatorSettings,
    faqTitle,
    faqSubtitle,
    faqs,
    ctaTitle,
    ctaContent,
    ctaButtons
  }`
  
  try {
    const data = await client.fetch(query) || {}
    return NextResponse.json({
      success: true,
      data,
      hasData: !!data?.title,
      schemaMismatch: `
        The schema you've defined in Sanity might not match the structure expected in your page.tsx file.
        The finance page expects:
        - hero.title, hero.subtitle, hero.ctaText, hero.ctaUrl, hero.backgroundImage
        - introduction.title, introduction.content, introduction.image
        - financeOptions.title, financeOptions.subtitle, financeOptions.options
        - financeProcess.title, financeProcess.subtitle, financeProcess.steps
        - calculator.title, calculator.subtitle, calculator.settings
        - faq.title, faq.subtitle, faq.faqs
        - cta.title, cta.content, cta.primaryButtonText, cta.primaryButtonUrl
        
        But your Sanity schema provides different field names, likely:
        - heroTitle, heroSubtitle, heroImage, heroCta
        - introTitle, introContent, introImage
        - financeOptionsTitle, financeOptionsSubtitle, financeOptions
        - processTitle, processSubtitle, processSteps
        - calculatorTitle, calculatorSubtitle, calculatorSettings
        - faqTitle, faqSubtitle, faqs
        - ctaTitle, ctaContent, ctaButtons
      `
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
} 