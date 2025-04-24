"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

export const MotCheckForm = () => {
  const [regNumber, setRegNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { getToken, isLoading: isRecaptchaLoading } = useRecaptcha('mot_check')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!regNumber.trim()) {
      setError('Please enter a valid registration number')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getToken();
      
      if (!recaptchaToken) {
        setError("Verification failed. Please try again later.");
        setIsLoading(false);
        return;
      }
      
      // Store token in session storage for use on results page
      sessionStorage.setItem('motRecaptchaToken', recaptchaToken);
      sessionStorage.setItem('motRecaptchaAction', 'mot_check');
      
      // Redirect to results page with the registration number
      window.location.href = `/mot-check/results?registration=${encodeURIComponent(regNumber.trim())}`;
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
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
          disabled={isLoading || isRecaptchaLoading}
        >
          {isLoading || isRecaptchaLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isLoading ? 'Checking...' : 'Verifying...'}
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