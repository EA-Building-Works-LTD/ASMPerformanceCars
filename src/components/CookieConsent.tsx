'use client';

import { useState, useEffect } from 'react';
import { setCookie, getCookie, hasCookie } from '@/utils/cookies';

// Add these type declarations at the top of the file, before other code
declare global {
  interface Window {
    fbq?: (event: string, action: string, options?: unknown) => void;
    [key: string]: any; // Allow dynamic property access for Google Analytics
  }
}

const COOKIE_CONSENT_KEY = 'cookie_consent';

type CookiePreferences = {
  essential: boolean;  // Always true, can't be toggled
  performance: boolean;
  functional: boolean;
  targeting: boolean;
};

const defaultPreferences: CookiePreferences = {
  essential: true,
  performance: false,
  functional: false,
  targeting: false
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already set cookie preferences
    const hasConsent = hasCookie(COOKIE_CONSENT_KEY);
    
    if (!hasConsent) {
      // Show banner if no consent has been given yet
      setVisible(true);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(getCookie(COOKIE_CONSENT_KEY) || '');
        setPreferences(savedPreferences);
      } catch (e) {
        console.error('Failed to parse cookie preferences:', e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    // Save preferences to cookie
    setCookie(COOKIE_CONSENT_KEY, JSON.stringify(prefs), {
      expires: 365, // Valid for one year
      path: '/'
    });
    
    // Apply preferences (in a real implementation, this would manage various tracking scripts)
    applyPreferences(prefs);
    
    // Hide banner
    setVisible(false);
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true
    };
    setPreferences(allEnabled);
    savePreferences(allEnabled);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential can't be toggled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // This function actually applies the cookie preferences by enabling/disabling scripts
    
    // Handle Google Analytics cookies
    if (typeof window !== 'undefined') {
      // Google Analytics - disable if performance cookies are declined
      if (!prefs.performance) {
        // Disable Google Analytics tracking
        window[`ga-disable-${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`] = true;
        
        // Remove existing GA cookies
        const gaCookies = document.cookie.split('; ').filter(c => 
          c.startsWith('_ga') || c.startsWith('_gid') || c.startsWith('_gat')
        );
        
        gaCookies.forEach(cookie => {
          const name = cookie.split('=')[0];
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        console.log('Performance cookies disabled');
      } else {
        // Enable Google Analytics
        window[`ga-disable-${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`] = false;
        console.log('Performance cookies enabled');
      }
      
      // Facebook Pixel - disable if targeting cookies are declined
      if (!prefs.targeting) {
        // Remove Facebook Pixel cookies
        const fbCookies = document.cookie.split('; ').filter(c => 
          c.startsWith('_fbp') || c.startsWith('fr')
        );
        
        fbCookies.forEach(cookie => {
          const name = cookie.split('=')[0];
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        // Disable Facebook Pixel if it exists
        if (window.fbq) {
          window.fbq('consent', 'revoke');
        }
        
        console.log('Targeting cookies disabled');
      } else {
        // Enable Facebook Pixel if it exists
        if (window.fbq) {
          window.fbq('consent', 'grant');
        }
        console.log('Targeting cookies enabled');
      }
      
      // Handle functional cookies
      if (!prefs.functional) {
        // Remove functional cookies
        const functionalCookies = document.cookie.split('; ').filter(c => 
          c.startsWith('user_preferences') || c.startsWith('recently_viewed_vehicles')
        );
        
        functionalCookies.forEach(cookie => {
          const name = cookie.split('=')[0];
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        console.log('Functional cookies disabled');
      } else {
        console.log('Functional cookies enabled');
      }
    }
  };

  const openCookieSettings = () => {
    setVisible(true);
    setShowDetails(true);
  };

  // If banner is not visible, render only the settings button in the footer
  if (!visible) {
    return (
      <button 
        onClick={openCookieSettings}
        className="fixed bottom-4 left-4 bg-gray-800 text-white text-sm py-2 px-4 rounded-md shadow-md hover:bg-gray-700 z-50 opacity-70 hover:opacity-100 transition-opacity"
      >
        Cookie Settings
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 sm:py-5">
        <div className="flex flex-col space-y-4">
          {/* Banner Header */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {/* Main Banner Content */}
          <div className="text-sm text-gray-700">
            <p>
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. Read our{' '}
              <a href="/cookie-policy" className="text-red-600 hover:underline">Cookie Policy</a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</a>{' '}
              to learn more.
            </p>
          </div>
          
          {/* Detailed Cookie Preferences */}
          {showDetails && (
            <div className="mt-2 border rounded-md p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Essential Cookies</p>
                    <p className="text-xs text-gray-600 mt-1">Necessary for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.essential} 
                      disabled={true}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Performance Cookies</p>
                    <p className="text-xs text-gray-600 mt-1">Help us analyze how our website is used to improve its performance.</p>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.performance} 
                      onChange={() => handlePreferenceChange('performance')}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Functional Cookies</p>
                    <p className="text-xs text-gray-600 mt-1">Enable enhanced functionality and personalization.</p>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.functional} 
                      onChange={() => handlePreferenceChange('functional')}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Targeting Cookies</p>
                    <p className="text-xs text-gray-600 mt-1">Used to deliver advertisements more relevant to you and your interests.</p>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.targeting} 
                      onChange={() => handlePreferenceChange('targeting')}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-end">
            <button 
              onClick={handleRejectNonEssential}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              Reject All
            </button>
            
            {showDetails && (
              <button 
                onClick={handleAcceptSelected}
                className="text-white bg-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Save Preferences
              </button>
            )}
            
            <button 
              onClick={handleAcceptAll}
              className="text-white bg-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 