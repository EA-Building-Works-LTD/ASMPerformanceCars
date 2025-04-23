"use client"

import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

// Custom TikTok icon component
const TikTokIcon = () => (
  <svg 
    className="h-5 w-5" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.86 4.44l.13-.19v-8.8a8.16 8.16 0 005.69 2.23l.01-3.64c-.01-.01-.09-.01-.1-.01z"/>
  </svg>
);

interface OpeningHours {
  days: string;
  hours: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactInfoProps {
  title: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: OpeningHours[];
  socialLinks?: SocialLink[];
}

export default function ContactInfo({
  title,
  subtitle,
  address,
  phone,
  email,
  openingHours,
  socialLinks,
}: ContactInfoProps) {
  // Function to render the appropriate social media icon
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'tiktok':
        return <TikTokIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-zinc-600 dark:text-zinc-300 mb-6">{subtitle}</p>}

      <div className="space-y-6">
        {/* Address */}
        {address && (
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">Address</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{address}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">Phone</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-red-600 transition-colors">
                  {phone}
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">Email</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                <a href={`mailto:${email}`} className="hover:text-red-600 transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {openingHours && openingHours.length > 0 && (
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">Opening Hours</h3>
              <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                {openingHours.map((schedule, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="font-medium mr-4">{schedule.days}</span>
                    <span>{schedule.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                aria-label={`Follow us on ${link.platform}`}
              >
                {renderSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}