import { Image, PortableTextBlock } from 'sanity'

interface SocialLink {
  platform: string
  url: string
}

export interface SEO {
  title: string
  description?: string
  keywords?: string[]
}

export interface Milestone {
  year: string
  title: string
  description?: string
  image?: Image
}

export interface Value {
  title: string
  description?: string
  icon?: string
}

export interface HeroSection {
  title: string
  subtitle?: string
  backgroundType?: 'image' | 'color'
  backgroundColor?: string
  image?: Image
  backgroundImage?: string | null
  ctaText?: string
  ctaUrl?: string
}

export interface IntroSection {
  title?: string
  content?: PortableTextBlock[]
  image?: Image
  imagePosition?: 'left' | 'right'
}

export interface StorySection {
  title?: string
  subtitle?: string
  content?: PortableTextBlock[]
  milestones?: Milestone[]
}

export interface ValuesSection {
  title?: string
  subtitle?: string
  values?: Value[]
  backgroundColor?: string
}

export interface TestimonialsSection {
  title?: string
  subtitle?: string
  testimonials?: unknown[]
}

export interface CTASection {
  title?: string
  content?: PortableTextBlock[]
  buttonText?: string
  buttonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  backgroundColor?: string
}

export interface AboutPageData {
  title: string
  metaDescription?: string
  description?: string
  keywords?: string[]
  seo?: SEO
  hero: HeroSection
  introduction?: IntroSection
  story?: StorySection
  values?: ValuesSection
  testimonials?: TestimonialsSection
  cta?: CTASection
} 