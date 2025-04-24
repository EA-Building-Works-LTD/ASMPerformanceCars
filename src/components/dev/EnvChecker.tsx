"use client";

import { useEffect, useState } from 'react';

/**
 * Development-only component to check if essential environment variables are set.
 * This should only be used in development mode and never in production.
 */
export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{
    [key: string]: { exists: boolean; value?: string };
  }>({});
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    // Get environment variables we want to check
    const envVars = {
      // reCAPTCHA variables
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
      
      // Other public variables can be added here
      NODE_ENV: process.env.NODE_ENV || '',
    };
    
    // Check which variables are set
    const result: { [key: string]: { exists: boolean; value?: string } } = {};
    
    for (const [key, value] of Object.entries(envVars)) {
      result[key] = {
        exists: !!value,
        // Only show partial value for security, or full value for non-sensitive vars
        value: key === 'NODE_ENV' ? value : value ? `${value.substring(0, 3)}...` : undefined,
      };
    }
    
    setEnvStatus(result);
  }, []);
  
  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg z-50 text-xs border border-red-500 opacity-70 hover:opacity-100 transition-opacity">
      <div className="font-bold mb-2 text-red-500">Environment Variables (dev only)</div>
      <ul className="space-y-1">
        {Object.entries(envStatus).map(([key, { exists, value }]) => (
          <li key={key} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${exists ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-mono">{key}</span>
            {exists && value && <span className="text-gray-500">{value}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
} 