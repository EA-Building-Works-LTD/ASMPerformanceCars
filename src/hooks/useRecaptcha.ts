"use client";

import { useEffect, useState, useCallback } from 'react';

// Types for the reCAPTCHA object from Google
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    onRecaptchaLoaded?: () => void;
  }
}

/**
 * React hook to use Google reCAPTCHA v3 in forms
 * @param action The action name to associate with token requests
 * @returns Object with loading state and function to get tokens
 */
export function useRecaptcha(action: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load the reCAPTCHA script
  useEffect(() => {
    // Skip if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      console.log('reCAPTCHA already loaded');
      setIsLoaded(true);
      return;
    }
    
    // Check if script is already in the document
    if (document.querySelector('script[src*="recaptcha"]')) {
      // Script exists but hasn't initialized yet, wait for it
      window.onRecaptchaLoaded = () => {
        console.log('reCAPTCHA script loaded via callback');
        setIsLoaded(true);
      };
      return;
    }
    
    // Get site key from environment variable
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error('reCAPTCHA site key not configured');
      setError('reCAPTCHA site key not configured');
      return;
    }
    
    console.log('Loading reCAPTCHA script...');
    
    // Set up the callback function for when reCAPTCHA loads
    window.onRecaptchaLoaded = () => {
      console.log('reCAPTCHA script loaded via callback');
      setIsLoaded(true);
    };
    
    // Create and append the script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=onRecaptchaLoaded`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('reCAPTCHA script element loaded');
      // Note: The actual reCAPTCHA API may not be ready yet, we'll rely on the callback
    };
    
    script.onerror = (e) => {
      console.error('Error loading reCAPTCHA script:', e);
      setError('Failed to load verification service');
    };
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      // Only remove the script if we added it and it still exists
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Remove the global callback
      if (window.onRecaptchaLoaded) {
        delete window.onRecaptchaLoaded;
      }
    };
  }, []);
  
  // Function to get a reCAPTCHA token
  const getToken = useCallback(async (): Promise<string | null> => {
    // If reCAPTCHA isn't loaded yet, we can't get a token
    if (!isLoaded) {
      console.warn('reCAPTCHA not loaded yet, cannot get token');
      return null;
    }
    
    if (!window.grecaptcha) {
      console.error('grecaptcha object not available');
      setError('Verification service not available');
      return null;
    }
    
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error('reCAPTCHA site key not configured');
      setError('reCAPTCHA site key not configured');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Get a token from Google reCAPTCHA
      console.log('Executing reCAPTCHA with action:', action);
      return await window.grecaptcha.execute(siteKey, { action });
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      setError('Failed to verify: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, action]);
  
  return { isLoaded, isLoading, error, getToken };
} 