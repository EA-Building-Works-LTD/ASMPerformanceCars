import React from 'react'
import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PortableText } from '@portabletext/react'
import { getMotCheckPage } from '@/sanity/lib/client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MotCheckForm } from '@/components/mot-check/MotCheckForm'
import { FaqItem } from '@/components/mot-check/FaqItem'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: "Check Car MOT",
  description: "Free MOT history check for any UK registered vehicle. Get instant access to comprehensive MOT history, advisory notes, and mileage information.",
}

// Fallback placeholder image URLs
const PLACEHOLDER_IMAGE = '/images/mot-check-placeholder.jpg'

export default async function MotCheckPage() {
  // Fetch page content from Sanity
  const pageData = await getMotCheckPage()
  
  // Check if this is a development environment
  const isDev = process.env.NODE_ENV === 'development'
  
  // Default content in case Sanity data isn't available yet
  const defaultContent = {
    title: 'MOT History Check',
    subtitle: 'Free MOT history check for any UK registered vehicle',
    whatIsMotTitle: 'What is an MOT?',
    whatIsMotContent: [],
    reportIncludesTitle: 'What does a FREE MOT history Report include?',
    reportIncludesItems: [
      { text: 'Check if a car has a valid MOT.' },
      { text: 'Keep upto date with your MOT.' },
      { text: 'Your MOT certificate expiry date.' },
      { text: 'Previous MOT history including advisories.' },
      { text: 'Mileage history to determine any discrepancies.' },
      { text: 'Failure notes. They provide a valuable insight into any car repairs carried out on a vehicle.' }
    ],
    whyFailTitle: 'Why would a car fail its MOT?',
    whyFailContent: [],
    howHelpfulTitle: 'How is MOT history helpful?',
    howHelpfulContent: [],
    dvlaCheckTitle: 'Can you check a car\'s MOT history through DVLA?',
    dvlaCheckContent: [],
    ctaTitle: 'Check Your Vehicle\'s MOT History Today',
    ctaSubtitle: 'Get instant access to comprehensive MOT history, advisory notes, and more'
  }
  
  // Merge data, using defaults if Sanity data isn't available
  const content = { ...defaultContent, ...pageData }
  
  // Predefined content for demo purposes if no Sanity content available
  const whatIsMotText = `Once your vehicle is around three years old, an MOT test is required every year. It ensures your car meets road safety and environmental standards, allowing drivers to stay safe and be legal to drive.
  
If you own a vehicle, it is your job to ensure your MOT is valid. Without a valid MOT, your car insurance may become void. In the UK, it is illegal to drive your car without an MOT and insurance. You have the possibility of facing a fine of up to £1000 as well as 6/8 points on your license. This is covered under the Section 47 of the Road Traffic Act 1988.

At the time of an MOT test, it is vital that every car meets the required minimum legal requirements. The certified individual, carrying out the MOT, will check essential items on your car to ensure it is fully complied. When an MOT is completed, you will receive an MOT certificate. It is important you understand what an MOT certificate means.

The certificate does not guarantee the general mechanical condition of the vehicle. The MOT certificate confirms that the vehicle meets the legal minimum environmental and road safety requirements at the time of the test without disassembly. The certificate does not replace regular maintenance. The test does not include the condition of the engine, clutch or transmission.`

  const whyFailText = `A car may fail its MOT for many reasons. These reasons can be in the form of advisories or failures. You can see these reasons when you run a vehicle reg check using our MOT checker above.

Every MOT includes the same information which is legally required from an MOT test station. It is important to keep an eye on any advisories or failures as this can be the reason for an MOT failure.`

  const howHelpfulText = `An MOT history check can help you keep up with how many days are left before your next MOT is required.

It is important to ensure you are on top of your MOT to avoid driving your vehicle illegally. You may get stopped by the police if a car does not have a valid MOT.`

  const dvlaCheckText = `Yes, you are able to use the gov website to check the MOT status of any vehicle, provided you have the registration number to hand.

If you ever lose an MOT certificate, you can simply use DVLA's online service to request a new one.`

  // Common reasons for MOT failures for FAQ section
  const commonFailures = [
    {
      question: 'Lighting and Signaling',
      answer: 'Faulty bulbs, misaligned headlights, and damaged light lenses are among the most common reasons for MOT failures. Regular checks of all lights can help prevent this issue.'
    },
    {
      question: 'Suspension Issues',
      answer: 'Worn shock absorbers, damaged springs, and deteriorated bushings can all cause MOT failures. Regular maintenance can help identify these issues before they become serious problems.'
    },
    {
      question: 'Brake Problems',
      answer: 'Worn brake pads, discs, and fluid issues are common reasons for MOT failures. Regular brake inspections can help ensure your vehicle passes this critical safety check.'
    },
    {
      question: 'Tire Condition',
      answer: 'Insufficient tread depth (below 1.6mm), damaged sidewalls, or uneven wear can all result in MOT failures. Regular tire checks and rotation can help prevent these issues.'
    },
    {
      question: 'Visibility Issues',
      answer: 'Damaged windscreen (especially in the driver\'s line of sight), faulty wipers, and non-functioning washers can all lead to MOT failures. Regular checks of these components are essential.'
    }
  ]

  return (
    <Layout>
      {/* Admin Notice (only shown in development when no Sanity data exists) */}
      {isDev && !pageData && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <div className="container mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong className="font-medium">Admin Notice:</strong> No MOT Check Page document found in Sanity.
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  The page is currently using fallback content. To manage this content in Sanity Studio, either:
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-amber-700">
                  <li>Create a new "MOT Check Page" document in Sanity Studio, or</li>
                  <li>Use the <a href="/api/seed-mot-data" target="_blank" className="font-medium underline">data initialization API</a> with proper permissions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-black py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <Image 
            src={content.heroImage || PLACEHOLDER_IMAGE}
            alt="MOT check hero background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 items-center">
            <div className="text-white space-y-6">
              <Badge variant="outline" className="border-red-500 text-red-400 bg-transparent mb-4 mt-6 md:mt-0">
                FREE MOT Check Tool
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {content.title}
              </h1>
              <p className="text-lg text-gray-300">
                {content.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#what-is-mot" className="hidden md:inline-block">
                  <Button className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-6 h-auto text-lg">
                    What is an MOT?
                  </Button>
                </a>
              </div>
            </div>
            
            {/* MOT Check Form Card */}
            <div id="check-mot" className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Check MOT History
                </h2>
                <p className="text-white/80 mt-1">
                  Enter a UK vehicle registration
                </p>
              </div>
              <div className="p-6">
                <MotCheckForm />
                <p className="text-sm text-gray-500 mt-4 flex items-start">
                  <ShieldCheck className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                  <span>Your search will provide MOT history, advisory notes, mileage readings, and test locations.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <section className="bg-gray-50 dark:bg-zinc-800 py-8 border-y border-gray-200 dark:border-zinc-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold">100% Free</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No hidden charges</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold">Instant Results</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get data in seconds</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold">Official Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Direct from DVLA</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold">Complete History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full MOT records</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* What is an MOT Section */}
      <section id="what-is-mot" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{content.whatIsMotTitle}</h2>
              
              {content.whatIsMotContent && content.whatIsMotContent.length > 0 ? (
                <div className="prose dark:prose-invert max-w-none">
                  <PortableText value={content.whatIsMotContent} components={portableTextComponents} />
                </div>
              ) : (
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  {whatIsMotText.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
              <Image 
                src={content.whatIsMotImage || '/images/mot-test-inspection.jpg'} 
                alt="MOT Test"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* What's Included in Report */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">{content.reportIncludesTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our comprehensive MOT history check provides everything you need to know about a vehicle's testing history
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-lg h-[400px]">
              <Image 
                src={content.reportIncludesImage || '/images/mot-report-example.jpg'} 
                alt="MOT Report Example"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <ul className="space-y-5">
                {(content.reportIncludesItems || defaultContent.reportIncludesItems).map((item: { text: string }, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
                  <CardContent className="p-4 flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Remember that an MOT certificate only confirms the vehicle met the legal minimum standards at the time of the test. It doesn't guarantee the vehicle's overall mechanical condition or that it will remain roadworthy for the duration of the certificate.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* MOT Information Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Essential MOT Information</h2>
            
            <Tabs defaultValue="why-fail" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="why-fail">Why Cars Fail</TabsTrigger>
                <TabsTrigger value="helpful">How It Helps</TabsTrigger>
                <TabsTrigger value="dvla">DVLA Checks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="why-fail" className="space-y-4">
                <h3 className="text-xl font-semibold">{content.whyFailTitle}</h3>
                {content.whyFailContent && content.whyFailContent.length > 0 ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <PortableText value={content.whyFailContent} components={portableTextComponents} />
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    {whyFailText.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                <div className="relative rounded-xl overflow-hidden shadow-lg h-[300px] mt-6">
                  <Image 
                    src={content.whyFailImage || '/images/mot-failure-inspection.jpg'} 
                    alt="MOT Failure Inspection"
                    fill
                    className="object-cover"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="helpful" className="space-y-4">
                <h3 className="text-xl font-semibold">{content.howHelpfulTitle}</h3>
                {content.howHelpfulContent && content.howHelpfulContent.length > 0 ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <PortableText value={content.howHelpfulContent} components={portableTextComponents} />
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    {howHelpfulText.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 mt-4">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Pro Tip
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Set calendar reminders 1 month before your MOT is due to allow time for any necessary repairs. This helps avoid last-minute stress and potential failures.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dvla" className="space-y-4">
                <h3 className="text-xl font-semibold">{content.dvlaCheckTitle}</h3>
                {content.dvlaCheckContent && content.dvlaCheckContent.length > 0 ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <PortableText value={content.dvlaCheckContent} components={portableTextComponents} />
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    {dvlaCheckText.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="bg-gray-50 dark:bg-zinc-800 p-4">
                    <div className="flex items-start">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                        <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Our Service</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive MOT history with detailed test results, advisories, and mileage information</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-gray-50 dark:bg-zinc-800 p-4">
                    <div className="flex items-start">
                      <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full mr-3">
                        <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">DVLA Service</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Basic MOT status information showing valid/invalid status and expiry date</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Common MOT Failure Reasons</h2>
            
            <div className="space-y-4">
              {(content.faqItems || commonFailures).map((faq: { question: string, answer: string | any[] }, index: number) => (
                <FaqItem 
                  key={index} 
                  question={faq.question} 
                  answer={typeof faq.answer === 'string' ? faq.answer : Array.isArray(faq.answer) ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <PortableText value={faq.answer} components={portableTextComponents} />
                    </div>
                  ) : ''}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.ctaTitle}
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              {content.ctaSubtitle}
            </p>
            <a href="#check-mot" className="inline-block">
              <Button className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 h-auto text-lg">
                Check MOT History Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
} 