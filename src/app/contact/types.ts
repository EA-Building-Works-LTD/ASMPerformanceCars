export interface ContactPageData {
  title: string
  description?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  hero?: {
    title?: string
    subtitle?: string
    backgroundType?: 'image' | 'color'
    backgroundColor?: string
    backgroundImage?: any
  }
  contactInfo?: {
    title?: string
    subtitle?: string
    address?: string
    phone?: string
    email?: string
    openingHours?: Array<{
      days: string
      hours: string
    }>
    socialLinks?: Array<{
      platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin'
      url: string
    }>
  }
  contactForm?: {
    title?: string
    subtitle?: string
    submitButtonText?: string
    successMessage?: string
  }
  map?: {
    title?: string
    subtitle?: string
    latitude?: number
    longitude?: number
    zoom?: number
    showDirectionsLink?: boolean
    directionsLinkText?: string
  }
  faq?: {
    title?: string
    subtitle?: string
    faqs?: Array<{
      question: string
      answer: any
    }>
  }
  cta?: {
    title?: string
    content?: any
    primaryButton?: {
      text?: string
      url?: string
    }
    secondaryButton?: {
      text?: string
      url?: string
    }
    backgroundColor?: string
  }
} 