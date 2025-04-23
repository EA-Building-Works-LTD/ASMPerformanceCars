import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modified Cars FAQS',
  description: 'Get answers to frequently asked questions about car buying, selling, insurance, modifications, and more. Comprehensive guides on all aspects of vehicle ownership.',
  keywords: ['car FAQs', 'modified car questions', 'car buying guide', 'vehicle insurance FAQ', 'electric car information'],
  openGraph: {
    title: 'Modified Cars FAQs | ASM Performance Cars',
    description: 'Get answers to frequently asked questions about car buying, selling, insurance, modifications, and more.',
    url: 'https://asmperformancecars.co.uk/faqs',
  }
}

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
} 