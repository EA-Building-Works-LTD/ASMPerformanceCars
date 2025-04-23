'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, Gauge, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type TestResult = 'PASSED' | 'FAILED'

type Defect = {
  text: string
  type: string
}

type MotTest = {
  testResult: TestResult
  completedDate: string
  expiryDate?: string
  odometerValue: number
  odometerUnit: string
  defects: Defect[]
}

type MotData = {
  make: string
  model: string
  primaryColour: string
  fuelType: string
  manufactureDate: string
  engineSize: string
  motTests: MotTest[]
  ulezCompliant: boolean
}

function MotCheckResultsContent() {
  const searchParams = useSearchParams()
  const registration = searchParams.get('registration')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [motData, setMotData] = useState<MotData | null>(null)
  const [showAllTests, setShowAllTests] = useState(false)
  
  useEffect(() => {
    if (!registration) {
      setError('No registration provided')
      setLoading(false)
      return
    }
    
    const fetchMotData = async () => {
      try {
        const response = await fetch(`/api/mot-check?registration=${encodeURIComponent(registration)}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to retrieve MOT data')
        }
        
        const data = await response.json()
        setMotData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMotData()
  }, [registration])
  
  // Calculate pass/fail counts
  const totalPass = motData?.motTests?.filter(test => test.testResult === 'PASSED').length || 0
  const totalFail = motData?.motTests?.filter(test => test.testResult === 'FAILED').length || 0
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-red-600 border-red-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading MOT history...</h2>
          <p className="text-gray-500 mt-2">Retrieving information for {registration}</p>
        </div>
      </div>
    )
  }
  
  if (error || !motData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">MOT Check Failed</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Failed to retrieve MOT data'}</p>
            <Link href="/mot-check">
              <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                <ArrowLeft className="w-4 h-4" />
                Try Another Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Registration and Vehicle Info Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-block bg-black text-white dark:bg-zinc-800 rounded-lg px-4 py-2 font-mono tracking-wider text-lg font-bold mb-4">
                <span className="text-xs mr-2 opacity-70">GB</span>
                {registration?.toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold">
                {motData.make} {motData.model}
              </h1>
            </div>
            <Link href="/mot-check">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Check Another Vehicle
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Vehicle Details and MOT Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Vehicle Details Card */}
          <Card className="col-span-2 shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Vehicle Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Make & Model</p>
                  <p className="font-medium">{motData.make} {motData.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Year of Manufacture</p>
                  <p className="font-medium">{motData.manufactureDate ? new Date(motData.manufactureDate).getFullYear() : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Colour</p>
                  <p className="font-medium">{motData.primaryColour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</p>
                  <p className="font-medium">{motData.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engine Size</p>
                  <p className="font-medium">{motData.engineSize} cc</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ULEZ Compliance</p>
                  <div className="flex items-center">
                    {motData.ulezCompliant ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Compliant</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Not Compliant</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* MOT History Summary Card */}
          <Card className="shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                MOT Summary
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Most Recent Mileage</p>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Gauge className="w-5 h-5 text-gray-500" />
                    {motData.motTests.length ? (
                      <>
                        {motData.motTests[0].odometerValue.toLocaleString()} {motData.motTests[0].odometerUnit}
                      </>
                    ) : (
                      'No MOT data'
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">MOT Status</p>
                  <div className="flex items-center gap-2">
                    {motData.motTests.length && motData.motTests[0].expiryDate ? (
                      new Date(motData.motTests[0].expiryDate) > new Date() ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Valid until {new Date(motData.motTests[0].expiryDate).toLocaleDateString()}</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Expired</Badge>
                      )
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Unknown</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Test History</p>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{motData.motTests.length} tests</div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-sm">{totalPass}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-sm">{totalFail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* MOT Test History */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">MOT Test History</h2>
            {motData.motTests.length > 2 && (
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => setShowAllTests(!showAllTests)}
              >
                {showAllTests ? (
                  <>
                    Show Less
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show All Tests
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
          
          {motData.motTests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No MOT Tests Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There is no MOT history available for this vehicle. This could be because the vehicle is new, exempt from MOT testing, or has not been tested in the UK.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {motData.motTests
                .slice(0, showAllTests ? undefined : 2)
                .map((test, index) => {
                  const isPassed = test.testResult === 'PASSED';
                  
                  return (
                    <div 
                      key={index}
                      className={`border rounded-lg p-5 ${
                        isPassed 
                          ? 'border-green-200 dark:border-green-800' 
                          : 'border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isPassed 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {isPassed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <AlertTriangle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {isPassed ? 'PASSED' : 'FAILED'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(test.completedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Mileage</p>
                            <p className="font-medium">{test.odometerValue.toLocaleString()} {test.odometerUnit}</p>
                          </div>
                          {isPassed && test.expiryDate && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</p>
                              <p className="font-medium">{new Date(test.expiryDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {test.defects && test.defects.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Issues Found:</h4>
                          <ul className="space-y-2">
                            {test.defects.map((defect, i) => (
                              <li key={i} className="flex gap-2">
                                <Badge className={
                                  defect.type === 'FAIL' 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 whitespace-nowrap' 
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 whitespace-nowrap'
                                }>
                                  {defect.type === 'FAIL' ? 'FAILED' : 'ADVISORY'}
                                </Badge>
                                <span className="text-sm">{defect.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MotCheckResultsPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-red-600 border-red-200 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold">Loading MOT check...</h2>
          </div>
        </div>
      }>
        <MotCheckResultsContent />
      </Suspense>
    </Layout>
  )
} 