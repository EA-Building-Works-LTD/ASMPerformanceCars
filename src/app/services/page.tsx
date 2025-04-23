import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  BadgePoundSterling, 
  Wrench, 
  Truck, 
  CheckCircle, 
  Sparkles, 
  ArrowLeftRight, 
  ShieldCheck,
  Car,
  Clipboard,
  Star,
  Settings,
  CarFront,
  ClipboardCheck,
  MapPinHouse
} from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'

export const revalidate = 3600 // Revalidate the data at most every hour

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServicesPageData()
  
  return {
    title: data?.seo?.title || data?.title || 'Our Services | ASM Performance Cars',
    description: data?.seo?.description || data?.description || 'Explore our range of automotive services including finance, maintenance, MOT, valeting, and more.',
    keywords: data?.seo?.keywords?.join(', ') || 'car services, automotive services, car finance, vehicle servicing, MOT testing, car detailing, part exchange',
  }
}

interface ServiceData {
  title: string
  description: string
  icon: string
  link: string
  color: string
  iconColor: string
}

interface ServicesPageData {
  title?: string
  description?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  hero?: {
    title?: string
    subtitle?: string
    backgroundImage?: {
      asset: {
        _id: string
      }
      alt?: string
    }
  }
  servicesSection?: {
    title?: string
    subtitle?: string
  }
  services?: ServiceData[]
  cta?: {
    title?: string
    content?: string
    buttonText?: string
    buttonUrl?: string
    backgroundColor?: string
  }
}

// Fallback data in case Sanity data isn't available
const fallbackServices: ServiceData[] = [
  {
    title: 'Current Stock',
    description: 'Search our wide range of vehicles from modified cars to luxury supercars.',
    icon: 'CarFront',
    link: '/our-cars',
    color: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'MOT History Check',
    description: 'Free comprehensive MOT history check for any UK vehicle with our advanced tool.',
    icon: 'ClipboardCheck',
    link: '/mot-check',
    color: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: 'Car Detailing',
    description: 'Partnered with a professional detailing business to maintain your modified car in showroom condition.',
    icon: 'Sparkles',
    link: '/services/car-detailing',
    color: 'bg-emerald-50 dark:bg-emerald-950',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    title: 'Car Transportation',
    description: 'We are able to deliver your car all over the UK. All vehicles are delivered by our experienced staff, with the relevant insurance in place.',
    icon: 'MapPinHouse',
    link: '/services/car-transportation',
    color: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  {
    title: 'Consignment Car Sales',
    description: 'Are you looking to sell your modified car hassle free? We aim to consign a wide range of vehicles from modified cars to luxury supercars. ',
    icon: 'BadgePoundSterling',
    link: '/services/consignment-car-sales',
    color: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    title: 'Part Exchange',
    description: 'We will provide a fair valuation for your modified car, compared to other dealers in the UK.',
    icon: 'ShieldCheck',
    link: '/services/part-exchange',
    color: 'bg-indigo-50 dark:bg-indigo-950',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  }
]

// Function to fetch services page data from Sanity
async function getServicesPageData(): Promise<ServicesPageData | null> {
  try {
    const query = groq`*[_type == "servicesPage"][0]{
      "title": title,
      "description": description,
      "seo": {
        "title": seo.title,
        "description": seo.description,
        "keywords": seo.keywords
      },
      "hero": {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "backgroundImage": hero.backgroundImage{
          "asset": {
            "_id": asset._id
          },
          "alt": alt
        }
      },
      "servicesSection": {
        "title": servicesSection.title,
        "subtitle": servicesSection.subtitle
      },
      "services": services[] {
        "title": title,
        "description": description,
        "icon": icon,
        "link": link,
        "color": color,
        "iconColor": iconColor,
      },
      "cta": {
        "title": cta.title,
        "content": cta.content,
        "buttonText": cta.buttonText,
        "buttonUrl": cta.buttonUrl,
        "backgroundColor": cta.backgroundColor
      }
    }`

    return await client.fetch<ServicesPageData>(query)
  } catch (error) {
    console.error('Error fetching services page data:', error)
    return null
  }
}

// Helper function to render the icon based on the icon name from Sanity
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'BadgePoundSterling':
      return BadgePoundSterling
    case 'Wrench':
      return Wrench
    case 'Truck':
      return Truck
    case 'CheckCircle':
      return CheckCircle
    case 'Sparkles':
      return Sparkles
    case 'ArrowLeftRight':
      return ArrowLeftRight
    case 'ShieldCheck':
      return ShieldCheck
    case 'Car':
      return Car
    case 'CarFront':
      return CarFront
    case 'ClipboardCheck':
      return ClipboardCheck
    case 'MapPinHouse':
      return MapPinHouse
    case 'Clipboard':
      return Clipboard
    case 'Star':
      return Star
    case 'Settings':
      return Settings
    default:
      return CheckCircle
  }
}

export default async function ServicesPage() {
  // Fetch data from Sanity
  const pageData = await getServicesPageData()
  
  // Use fallback data if Sanity data isn't available
  const services = pageData?.services || fallbackServices
  const heroTitle = pageData?.hero?.title || 'Our Services'
  const heroSubtitle = pageData?.hero?.subtitle || 'Comprehensive automotive services to meet all your vehicle needs'
  const heroImage = pageData?.hero?.backgroundImage ? 
    urlFor(pageData.hero.backgroundImage).url() : 
    '/images/services/services-hero.jpg'
  const sectionTitle = pageData?.servicesSection?.title || 'Explore Our Services'
  const sectionSubtitle = pageData?.servicesSection?.subtitle || 
    'From vehicle financing to maintenance, we provide a complete range of services for your automotive needs.'
  const ctaTitle = pageData?.cta?.title || 'Ready to Experience Our Services?'
  const ctaContent = pageData?.cta?.content || 
    'Contact us today to learn more about how we can help with your automotive needs.'
  const ctaButtonText = pageData?.cta?.buttonText || 'Contact Us Today'
  const ctaButtonUrl = pageData?.cta?.buttonUrl || '/contact'
  const ctaBackgroundColor = pageData?.cta?.backgroundColor === 'red' ? 'bg-red-600' :
    pageData?.cta?.backgroundColor === 'blue' ? 'bg-blue-600' :
    pageData?.cta?.backgroundColor === 'green' ? 'bg-green-600' :
    pageData?.cta?.backgroundColor === 'purple' ? 'bg-purple-600' :
    pageData?.cta?.backgroundColor === 'black' ? 'bg-black' :
    'bg-red-600'

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] lg:h-[70vh] lg:min-h-[600px] flex items-center bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Our Services"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-white max-w-2xl mb-8">
            {heroSubtitle}
          </p>
        </div>
        {/* Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-20 w-full overflow-hidden">
          <svg
            viewBox="0 0 1440 140"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            width="100%"
            style={{ display: 'block', marginBottom: '-1px' }}
          >
            <path
              d="M0 0L48 5.33333C96 10.6667 192 21.3333 288 32C384 42.6667 480 53.3333 576 53.3333C672 53.3333 768 42.6667 864 26.6667C960 10.6667 1056 -10.6667 1152 5.33333C1248 21.3333 1344 74.6667 1392 100L1440 125L1440 140L0 140Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionTitle}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {sectionSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon)
              
              return (
                <div key={index} className="group h-full">
                  <Card className={`h-full border-0 shadow-md overflow-hidden ${service.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-2`}>
                    <CardContent className="pt-6">
                      <div className={`w-14 h-14 mb-5 rounded-lg flex items-center justify-center ${service.iconColor} bg-white dark:bg-zinc-900`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="ghost" className="p-0 hover:bg-transparent hover:underline">
                        <Link href={service.link} className="inline-flex items-center">
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${ctaBackgroundColor} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {ctaTitle}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {ctaContent}
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-red-600 hover:bg-gray-100 border-white hover:text-red-700 rounded-full px-8">
            <Link href={ctaButtonUrl}>
              {ctaButtonText}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
} 