import { Metadata } from 'next'

export const homeMetadata: Metadata = {
  title: 'Modified Cars For Sale UK | ASM Performance Cars',
  description: 'Specialists in high-performance, modified and luxury vehicles. Browse our collection of premium cars or use our free MOT check tool.',
  openGraph: {
    title: 'Modified Cars For Sale UK | ASM Performance Cars',
    description: 'Specialists in high-performance, modified and luxury vehicles. Browse our collection of premium cars or use our free MOT check tool.',
    type: 'website',
    locale: 'en_GB',
    url: 'https://asmperformancecars.co.uk',
    images: [
      {
        url: 'https://asmperformancecars.co.uk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASM Performance Cars',
      }
    ],
  },
} 