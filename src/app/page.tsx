import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/home/Hero'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { Services } from '@/components/home/Services'
import { Testimonials } from '@/components/home/Testimonials'
import { MOTCheckTool } from '@/components/home/MOTCheckTool'
import { CallToAction } from '@/components/home/CallToAction'
import { BlogSection } from '@/components/home/BlogSection'
import { getFeaturedVehicles, getHeroSlides, getTestimonials, getCallToAction, getLatestPosts, getSEOContent } from '@/sanity/lib/client'
import { fetchGoogleReviewsFromServer } from '@/lib/serverUtils'

export default async function Home() {
  // Fetch data from Sanity
  const featuredVehicles = await getFeaturedVehicles()
  const heroSlides = await getHeroSlides()
  const sanityTestimonials = await getTestimonials()
  const callToAction = await getCallToAction()
  const latestPosts = await getLatestPosts(3)
  const seoContent = await getSEOContent('home')
  
  // Fetch Google reviews using server-side method to avoid CORS issues
  const googleReviews = await fetchGoogleReviewsFromServer()
  
  // Log review counts for debugging
  console.log('Reviews loaded:', {
    sanityCount: sanityTestimonials.length,
    googleCount: googleReviews.length,
    total: sanityTestimonials.length + googleReviews.length
  })
  
  // Combine Sanity testimonials and Google reviews
  const allTestimonials = [...sanityTestimonials, ...googleReviews]
  
  return (
    <Layout seoContent={seoContent}>
      <main>
        <Hero slides={heroSlides} />
        <FeaturedVehicles vehicles={featuredVehicles} />
        <Services />
        <MOTCheckTool />
        <Testimonials testimonials={allTestimonials} />
        <BlogSection posts={latestPosts} />
        <CallToAction cta={callToAction} />
      </main>
    </Layout>
  )
}

export const metadata = {
  alternates: {
    canonical: 'https://asmperformancecars.co.uk',
  }
};
