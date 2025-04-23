"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'

export const MotCheckForm = () => {
  const [regNumber, setRegNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!regNumber.trim()) {
      setError('Please enter a valid registration number')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    // Redirect to results page with the registration number
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = `/mot-check/results?registration=${encodeURIComponent(regNumber.trim())}`
    }, 1000)
  }
  
  return (
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
  )
} 