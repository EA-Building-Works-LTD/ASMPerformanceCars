"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

// Form validation schema
const formSchema = z.object({
  registration: z.string().min(1, 'Registration is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Year is required'),
  mileage: z.string().min(1, 'Mileage is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  honeypot: z.string().max(0)
})

type FormValues = z.infer<typeof formSchema>

interface ExchangeValuationProps {
  title: string
  subtitle?: string
  description?: PortableTextBlock[] // Properly typed Portable Text content
  ctaText?: string
  ctaUrl?: string
}

export const ExchangeValuation: React.FC<ExchangeValuationProps> = ({
  title,
  subtitle,
  description,
  ctaText = "Get Your Valuation",
  ctaUrl = "/contact"
}) => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      honeypot: '',
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    
    try {
      // Submit form data to API endpoint
      const response = await fetch('/api/send-valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send valuation request')
      }

      // Success
      setIsSubmitted(true)
      toast.success('Your valuation request has been sent successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to send request. Please try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    setStep(2)
  }

  return (
    <section id="valuation" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Content */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            {subtitle && (
              <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
            )}
            {description && (
              <div className="prose max-w-none mb-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
                <PortableText value={description} components={portableTextComponents} />
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-1/2">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">
                  {step === 1 ? "Vehicle Details" : "Your Contact Information"}
                </h3>
                
                {/* Hidden honeypot field for spam prevention */}
                <div className="hidden">
                  <input {...register('honeypot')} />
                </div>
                
                {step === 1 ? (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="registration">Registration Number*</Label>
                      <Input
                        id="registration"
                        {...register('registration')}
                        placeholder="Enter your vehicle registration"
                        className="w-full"
                      />
                      {errors.registration && (
                        <p className="text-red-500 text-sm mt-1">{errors.registration.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <Label htmlFor="make">Make*</Label>
                        <Input
                          id="make"
                          {...register('make')}
                          placeholder="e.g. Ford"
                          className="w-full"
                        />
                        {errors.make && (
                          <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="model">Model*</Label>
                        <Input
                          id="model"
                          {...register('model')}
                          placeholder="e.g. Focus"
                          className="w-full"
                        />
                        {errors.model && (
                          <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <Label htmlFor="year">Year*</Label>
                        <Input
                          id="year"
                          {...register('year')}
                          placeholder="e.g. 2018"
                          className="w-full"
                        />
                        {errors.year && (
                          <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="mileage">Mileage*</Label>
                        <Input
                          id="mileage"
                          {...register('mileage')}
                          placeholder="e.g. 45,000"
                          className="w-full"
                        />
                        {errors.mileage && (
                          <p className="text-red-500 text-sm mt-1">{errors.mileage.message}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Next Step
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="name">Full Name*</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter your email address"
                        className="w-full"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="Enter your phone number"
                        className="w-full"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : ctaText}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-700 mb-4">We've received your information and will be in touch with your valuation shortly.</p>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    if (ctaUrl) {
                      window.location.href = ctaUrl
                    }
                  }}
                >
                  Contact Us
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 