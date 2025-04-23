"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, ArrowRight, Car, History, Zap, ShieldCheck, CircleDollarSign } from 'lucide-react'

// Add a custom motion div component that correctly handles className
const MotionDiv = motion.div

export const MOTCheckTool = () => {
  const [regNumber, setRegNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const benefitPoints = [
    {
      icon: <History className="w-5 h-5" />,
      title: 'Comprehensive History',
      description: 'Access complete MOT test history, including advisory notes and failures'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Instant Results',
      description: 'Get immediate access to DVLA data for any UK registered vehicle'
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Make Informed Decisions',
      description: 'Understand a vehicle\'s condition before purchasing'
    },
    {
      icon: <CircleDollarSign className="w-5 h-5" />,
      title: 'Free Service',
      description: 'No hidden charges or subscription fees'
    }
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!regNumber.trim()) {
      setError('Please enter a valid registration number')
      return
    }
    
    // In production, this would call an API endpoint
    setIsLoading(true)
    setError('')
    
    // Redirect to results page with the registration number
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = `/mot-check/results?registration=${encodeURIComponent(regNumber.trim())}`
    }, 1000)
  }
  
  return (
    <section id="mot-check-section" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Tool Description */}
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <Badge variant="outline" className="mb-4 border-red-500 text-red-500 bg-transparent hover:bg-red-950">Free Tool</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Check Any Vehicle's MOT History
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Get instant access to a vehicle's complete MOT test history, mileage records, and advisory notes to make informed decisions before purchasing.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {benefitPoints.map((point, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-900/20">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-2">{point.title}</h3>
                    <p className="text-sm text-gray-400">
                      {point.description}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
          
          {/* Right Column - Search Card */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 rounded-xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Car className="w-6 h-6" />
                  MOT History Check
                </CardTitle>
                <CardDescription className="text-white/90 text-base mt-1">
                  Enter a UK vehicle registration to check its MOT history
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="registration" className="block text-sm font-medium mb-2 dark:text-gray-200">
                        Vehicle Registration
                      </label>
                      <Input
                        id="registration"
                        placeholder="E.g., AB12 CDE"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                        className="text-lg placeholder:text-gray-500 border-gray-300 dark:border-gray-700 h-12 font-medium tracking-wider"
                      />
                      {error && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                          {error}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 inline" />
                        We check against the DVLA database for accuracy
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 transition-all duration-200 text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          Checking
                          <span className="ml-2 animate-pulse">...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Check MOT History
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 px-6 py-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p>
                    Your search will provide MOT history, advisory notes, mileage readings, and test locations. Popular with car buyers and sellers.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
} 