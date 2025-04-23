'use client';

import { useState, useEffect } from 'react';
import { 
  setCookie, 
  getCookie, 
  removeCookie, 
  hasCookie,
  setJSONCookie,
  getJSONCookie
} from '@/utils/cookies';

export default function CookieTest() {
  const [cookieName, setCookieName] = useState('test-cookie');
  const [cookieValue, setCookieValue] = useState('test-value');
  const [currentCookies, setCurrentCookies] = useState<Record<string, string>>({});
  
  // Refresh the list of cookies on component mount and after any operation
  const refreshCookies = () => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) cookies[name] = value || '';
    });
    setCurrentCookies(cookies);
  };
  
  useEffect(() => {
    refreshCookies();
  }, []);
  
  const handleSetCookie = () => {
    setCookie(cookieName, cookieValue);
    refreshCookies();
  };
  
  const handleSetJSONCookie = () => {
    setJSONCookie(cookieName, { test: cookieValue, timestamp: Date.now() });
    refreshCookies();
  };
  
  const handleGetCookie = () => {
    const value = getCookie(cookieName);
    alert(`Cookie value: ${value || 'Not found'}`);
  };
  
  const handleGetJSONCookie = () => {
    const value = getJSONCookie(cookieName);
    alert(`JSON Cookie value: ${JSON.stringify(value) || 'Not found'}`);
  };
  
  const handleRemoveCookie = () => {
    removeCookie(cookieName);
    refreshCookies();
  };
  
  const handleCheckCookie = () => {
    alert(`Cookie exists: ${hasCookie(cookieName)}`);
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md my-8">
      <h2 className="text-xl font-bold mb-4">Cookie Tester</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cookieName" className="block text-sm font-medium text-gray-700 mb-1">
              Cookie Name
            </label>
            <input
              id="cookieName"
              type="text"
              value={cookieName}
              onChange={(e) => setCookieName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="cookieValue" className="block text-sm font-medium text-gray-700 mb-1">
              Cookie Value
            </label>
            <input
              id="cookieValue"
              type="text"
              value={cookieValue}
              onChange={(e) => setCookieValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleSetCookie}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Set Cookie
          </button>
          <button 
            onClick={handleSetJSONCookie}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Set JSON Cookie
          </button>
          <button 
            onClick={handleGetCookie}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
          >
            Get Cookie
          </button>
          <button 
            onClick={handleGetJSONCookie}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Get JSON Cookie
          </button>
          <button 
            onClick={handleCheckCookie}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Check Cookie
          </button>
          <button 
            onClick={handleRemoveCookie}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Remove Cookie
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Current Cookies</h3>
          <div className="border rounded p-3 bg-gray-50 max-h-40 overflow-auto">
            {Object.keys(currentCookies).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(currentCookies).map(([name, value]) => (
                  <li key={name}>
                    <span className="font-medium">{name}</span>: {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No cookies found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 