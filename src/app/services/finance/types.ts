export interface FinancePageData {
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
    ctaText?: string
    ctaUrl?: string
    backgroundImage?: any
  }
  introduction?: {
    title?: string
    content?: any
    image?: any
    imagePosition?: 'left' | 'right'
    stats?: { value: string; label: string }[]
  }
  financeOptions?: {
    title?: string
    subtitle?: string
    options?: {
      title: string
      description: any
      icon?: any
      highlights?: string[]
    }[]
  }
  financeProcess?: {
    title?: string
    subtitle?: string
    steps?: {
      stepNumber: number
      title: string
      description: any
      icon?: any
    }[]
  }
  calculator?: {
    title?: string
    subtitle?: string
    settings?: {
      defaultRate: number
      minLoanAmount: number
      maxLoanAmount: number
      minTerm: number
      maxTerm: number
      disclaimer: any
    }
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