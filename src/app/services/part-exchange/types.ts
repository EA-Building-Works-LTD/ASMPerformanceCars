export interface PartExchangePageData {
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
    ctaText?: string
    ctaUrl?: string
  }
  introduction?: {
    title?: string
    content?: any
    image?: any
    imagePosition?: 'left' | 'right'
  }
  benefits?: {
    title?: string
    subtitle?: string
    items?: {
      title: string
      description: any
      icon?: any
    }[]
    backgroundType?: 'light' | 'dark' | 'colored'
    backgroundColor?: string
  }
  process?: {
    title?: string
    subtitle?: string
    steps?: {
      stepNumber: number
      title: string
      description: any
      icon?: any
    }[]
    ctaText?: string
    ctaUrl?: string
  }
  valuation?: {
    title?: string
    subtitle?: string
    description?: any
    ctaText?: string
    ctaUrl?: string
    image?: any
    backgroundType?: 'light' | 'dark' | 'colored'
    backgroundColor?: string
  }
  testimonials?: {
    title?: string
    subtitle?: string
    items?: {
      name: string
      quote: string
      exchangedCar?: string
      purchasedCar?: string
      rating?: number
      image?: any
    }[]
  }
  faq?: {
    title?: string
    subtitle?: string
    faqs?: {
      question: string
      answer: any
    }[]
  }
  cta?: {
    title?: string
    content?: any
    primaryButtonText?: string
    primaryButtonUrl?: string
    secondaryButtonText?: string
    secondaryButtonUrl?: string
    backgroundColor?: 'red' | 'gray' | 'white'
  }
} 