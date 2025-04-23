'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Shield, Sparkles, Clock, Brush, Check, Car, Star, Droplet, Clipboard, ArrowRight, ChevronDown } from 'lucide-react'
import CarDetailingForm from '@/components/forms/CarDetailingForm'
import { CarDetailingPageData } from './types'
import { urlFor } from '@/sanity/lib/image'

interface CarDetailingPageClientProps {
  pageData: CarDetailingPageData
}

export function CarDetailingPageClient({ pageData }: CarDetailingPageClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="h-6 w-6 text-red-600" />
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-red-600" />
      case 'clock':
        return <Clock className="h-6 w-6 text-red-600" />
      case 'brush':
        return <Brush className="h-6 w-6 text-red-600" />
      case 'check':
        return <Check className="h-6 w-6 text-red-600" />
      case 'car':
        return <Car className="h-6 w-6 text-red-600" />
      case 'star':
        return <Star className="h-6 w-6 text-red-600" />
      case 'droplet':
        return <Droplet className="h-6 w-6 text-red-600" />
      case 'clipboard':
        return <Clipboard className="h-6 w-6 text-red-600" />
      default:
        return <Check className="h-6 w-6 text-red-600" />
    }
  }

  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70 z-10"></div>
        <div className="absolute inset-0">
          {pageData.hero?.backgroundType === 'image' && (
            <Image
              src={urlFor(pageData.hero?.backgroundImage).url()}
              alt={pageData.hero?.backgroundImage?.alt || "Car detailing services"}
              fill
              className="object-cover"
              priority
            />
          )}
          {pageData.hero?.backgroundType === 'color' && (
            <div className={`w-full h-full ${pageData.hero?.backgroundColor || 'bg-red-600'}`}></div>
          )}
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {pageData.hero?.title || 'Professional Car Detailing Services'}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-8 drop-shadow-md">
            {pageData.hero?.subtitle || 'Premium car detailing and valeting services in Birmingham and surrounding areas'}
          </p>
          {pageData.hero?.ctaText && (
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg font-medium"
            >
              {pageData.hero?.ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
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

      {/* Introduction Section */}
      {pageData.introduction && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className={`grid grid-cols-1 ${pageData.introduction.imagePosition === 'left' ? 'lg:grid-cols-[40%_1fr]' : 'lg:grid-cols-[1fr_40%]'} gap-12 items-center`}>
              {pageData.introduction.imagePosition === 'left' && (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(pageData.introduction.image).url()}
                    alt={pageData.introduction.image?.alt || "Car detailing"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {pageData.introduction.title || 'Expert Car Detailing Services'}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <PortableText value={pageData.introduction.content} />
                </div>
              </div>
              
              {pageData.introduction.imagePosition === 'right' && (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(pageData.introduction.image).url()}
                    alt={pageData.introduction.image?.alt || "Car detailing"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {pageData.benefits?.items && pageData.benefits.items.length > 0 && (
        <section 
          className={`py-16 ${
            pageData.benefits?.backgroundType === 'light' ? 'bg-gray-50' :
            pageData.benefits?.backgroundType === 'dark' ? 'bg-gray-900 text-white' :
            pageData.benefits?.backgroundColor || 'bg-red-50'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${pageData.benefits?.backgroundType === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {pageData.benefits?.title || 'Why Choose Our Detailing Services?'}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${pageData.benefits?.backgroundType === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {pageData.benefits?.subtitle || 'We provide exceptional car detailing with attention to every detail'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageData.benefits.items.map((benefit, index) => (
                <Card key={index} className={`h-full border ${pageData.benefits?.backgroundType === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {renderIcon(benefit.icon)}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${pageData.benefits?.backgroundType === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {benefit.title}
                    </h3>
                    <p className={pageData.benefits?.backgroundType === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {pageData.process && pageData.process.steps && pageData.process.steps.length > 0 && (
        <section className="py-16 bg-white" id="process">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {pageData.process.title || 'Our Car Detailing Process'}
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600">
                {pageData.process.subtitle || 'A meticulous approach to car detailing that delivers exceptional results'}
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {pageData.process.steps.map((step, index) => (
                <div key={index} className="flex items-start mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-6">
                    <span className="text-red-600 font-bold text-xl">{step.stepNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="mr-3">
                        {renderIcon(step.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {pageData.process.ctaText && (
              <div className="text-center mt-10">
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
                >
                  {pageData.process.ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services Grid */}
      {pageData.services && pageData.services.items && pageData.services.items.length > 0 && (
        <section className="py-16 bg-gray-50" id="services">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {pageData.services.title || 'Our Detailing Services'}
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600">
                {pageData.services.subtitle || 'We offer a range of professional detailing services for all vehicle types'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pageData.services.items.map((service, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="relative h-64">
                    <Image
                      src={urlFor(service.image).url()}
                      alt={service.image?.alt || service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {pageData.testimonials && pageData.testimonials.items && pageData.testimonials.items.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {pageData.testimonials.title || 'What Our Customers Say'}
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600">
                {pageData.testimonials.subtitle || 'Read what clients have to say about our car detailing services'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageData.testimonials.items.map((testimonial, index) => (
                <Card key={index} className="h-full border-gray-200">
                  <CardContent className="p-6">
                    <div className="mb-3">
                      {renderRating(testimonial.rating || 5)}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="mr-3">
                        {testimonial.image ? (
                          <div className="h-12 w-12 rounded-full overflow-hidden relative">
                            <Image
                              src={urlFor(testimonial.image).url()}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{testimonial.name.substring(0, 1)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <div className="text-sm text-gray-500">
                          {testimonial.carModel && (
                            <span className="block">{testimonial.carModel}</span>
                          )}
                          {testimonial.location && (
                            <span>{testimonial.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {pageData.faq && pageData.faq.faqs && pageData.faq.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {pageData.faq.title || 'Frequently Asked Questions'}
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600">
                {pageData.faq.subtitle || 'Find answers to common questions about our car detailing services'}
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {pageData.faq.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="py-4 text-left font-medium text-gray-900">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none pb-4 text-gray-600">
                      <PortableText value={faq.answer} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      {pageData.seoContent && pageData.seoContent.enabled && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {pageData.seoContent.title || 'Professional Car Detailing Services in Birmingham'}
                  </h2>
                  <div className="ml-4 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500">
                    <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                  </div>
                </summary>
                <div className="prose prose-lg max-w-none text-gray-600 mt-4">
                  <PortableText value={pageData.seoContent.content} />
                </div>
              </details>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {pageData.cta && (
        <section className={`py-16 ${pageData.cta.backgroundColor || 'bg-red-600'} text-white`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {pageData.cta.title || 'Ready to Transform Your Vehicle?'}
            </h2>
            <div className="prose prose-lg max-w-2xl mx-auto text-white mb-8">
              <PortableText value={pageData.cta.content} />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {pageData.cta.primaryButton && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
                >
                  {pageData.cta.primaryButton.text || 'Book Now'}
                </Button>
              )}
              {pageData.cta.secondaryButton && (
                <Button
                  // variant="outline"
                  asChild
                  className=" hover:bg-white hover:text-red-600 px-6 py-3 rounded-md font-medium"
                >
                  <Link href={pageData.cta.secondaryButton.url || '#services'}>
                    {pageData.cta.secondaryButton.text || 'Our Services'}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Car Detailing Form Dialog */}
      <CarDetailingForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  )
} 