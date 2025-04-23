"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CarFront, MapPinHouse, ClipboardCheck, Sparkles, BadgePoundSterling, ShieldCheck, LucideIcon } from 'lucide-react'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: LucideIcon
  link: string
  color: string
  iconColor: string
}

// Service data - would come from Sanity in production
const services: ServiceItem[] = [
  {
    id: '1',
    title: 'Current Stock',
    description: 'Search our wide range of vehicles from modified cars to luxury supercars.',
    icon: CarFront,
    link: '/our-cars',
    color: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: '2',
    title: 'MOT History Check',
    description: 'Free comprehensive MOT history check for any UK vehicle with our advanced tool.',
    icon: ClipboardCheck,
    link: '/mot-check',
    color: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: '3',
    title: 'Car Detailing',
    description: 'Partnered with a professional detailing business to maintain your modified car in showroom condition.',
    icon: Sparkles,
    link: '/services/car-detailing',
    color: 'bg-emerald-50 dark:bg-emerald-950',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: '4',
    title: 'Car Transportation',
    description: 'We are able to deliver your car all over the UK. All vehicles are delivered by our experienced staff, with the relevant insurance in place.',
    icon: MapPinHouse,
    link: '/services/car-transportation',
    color: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  {
    id: '5',
    title: 'Consignment Car Sales',
    description: 'Are you looking to sell your modified car hassle free? We aim to consign a wide range of vehicles from modified cars to luxury supercars. ',
    icon: BadgePoundSterling,
    link: '/services/consignment-car-sales',
    color: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: '6',
    title: 'Part Exchange',
    description: 'We will provide a fair valuation for your modified car, compared to other dealers in the UK.',
    icon: ShieldCheck,
    link: '/services/part-exchange',
    color: 'bg-indigo-50 dark:bg-indigo-950',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  }
]

const ServiceCard = ({ service, index }: { service: ServiceItem, index: number }) => {
  const IconComponent = service.icon
  
  return (
    <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
      <Card className={`h-full border-0 shadow-md overflow-hidden ${service.color}`}>
        <CardContent className="pt-6">
          <div className={`w-14 h-14 mb-5 rounded-lg flex items-center justify-center ${service.iconColor} bg-white dark:bg-zinc-900`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3">{service.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="ghost" className="p-0 hover:bg-transparent hover:underline">
            <Link href={service.link}>
              Learn more
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export const Services = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We offer a comprehensive range of automotive services, from performance modifications to routine maintenance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-md px-8">
            <Link href="/services">
              View All Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 