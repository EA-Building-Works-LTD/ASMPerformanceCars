"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

export function NewsletterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Initialize reCAPTCHA hook with action name
  const { getToken, isLoading: isRecaptchaLoading } = useRecaptcha('newsletter_subscription')
  
  // Form validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to subscribe",
        variant: "destructive"
      })
      return
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getToken();
      
      if (!recaptchaToken) {
        toast({
          title: "Verification failed",
          description: "Unable to verify you are human. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // Submit to Klaviyo API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email,
          // Include the value of the honeypot field (should be empty for real users)
          honeypot: (document.getElementById('newsletter-url') as HTMLInputElement)?.value || '',
          // Include reCAPTCHA token
          recaptchaToken,
          recaptchaAction: 'newsletter_subscription'
        }),
      })
      
      // Get response as text first to handle potential non-JSON responses
      const responseText = await response.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      // Success
      setIsSubmitted(true)
      setName('')
      setEmail('')
      
      toast({
        title: "Subscription successful!",
        description: "You have been added to our newsletter",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isSubmitted ? (
        <div className="bg-green-900/20 border border-green-700 text-green-400 rounded-lg p-4 max-w-xl mx-auto">
          Thank you for subscribing! You'll receive our latest updates soon.
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          {/* Honeypot field - hidden from real users but attracts bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden', }}>
            <label htmlFor="newsletter-url">Website URL (Leave this empty)</label>
            <input 
              type="text" 
              id="newsletter-url" 
              name="url" 
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-white/75 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-white/75 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl shadow-red-900/20"
            disabled={isLoading || isRecaptchaLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Subscribe"}
          </Button>
        </form>
      )}
    </>
  );
} 