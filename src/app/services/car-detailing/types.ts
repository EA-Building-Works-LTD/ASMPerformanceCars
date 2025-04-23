export interface CarDetailingPageData {
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
      description: string
      icon?: string
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
      description: string
      icon?: string
    }[]
    ctaText?: string
    ctaUrl?: string
  }
  services?: {
    title?: string
    subtitle?: string
    items?: {
      title: string
      description: string
      image?: any
    }[]
  }
  testimonials?: {
    title?: string
    subtitle?: string
    items?: {
      name: string
      quote: string
      carModel?: string
      location?: string
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
  seoContent?: {
    enabled?: boolean
    title?: string
    content?: any
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