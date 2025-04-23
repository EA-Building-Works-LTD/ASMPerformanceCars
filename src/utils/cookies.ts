import Cookies from 'js-cookie';

/**
 * Cookie utility functions for managing user preferences and session data
 */

// Default cookie options with secure settings for production
const defaultOptions = {
  expires: 30, // 30 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const
};

type CookieOptions = Partial<{
  expires: number | Date;
  path: string;
  domain: string;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}>;

/**
 * Set a cookie with the given name and value
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  Cookies.set(name, value, { ...defaultOptions, ...options });
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string, options: CookieOptions = {}) => {
  Cookies.remove(name, { ...defaultOptions, ...options });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== undefined;
};

/**
 * Parse a cookie value as JSON
 */
export const getJSONCookie = <T>(name: string): T | null => {
  const value = getCookie(name);
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.error(`Failed to parse cookie '${name}' as JSON:`, e);
    return null;
  }
};

/**
 * Store an object as a JSON cookie
 */
export const setJSONCookie = <T>(name: string, value: T, options: CookieOptions = {}) => {
  setCookie(name, JSON.stringify(value), options);
};

/**
 * Set a session cookie (expires when browser is closed)
 */
export const setSessionCookie = (name: string, value: string) => {
  setCookie(name, value, { expires: undefined });
}; 