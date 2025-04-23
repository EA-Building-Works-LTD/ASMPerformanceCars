export interface ConsignmentPageData {
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
  comparison?: {
    title?: string
    subtitle?: string
    methods?: {
      method: string
      pros?: string[]
      cons?: string[]
      description?: any
    }[]
  }
  testimonials?: {
    title?: string
    subtitle?: string
    items?: {
      name: string
      quote: string
      soldCar?: string
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
    buttonText?: string
    buttonUrl?: string
    backgroundColor?: 'red' | 'gray' | 'white'
  }
} 