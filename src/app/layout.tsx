import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

// Configure Saira font family with all weights
const saira = localFont({
  src: [
    {
      path: './fonts/Saira-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Saira-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Saira-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Saira-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-saira',
  display: 'swap',
});

// Configure Agency Bold as the heading font
const agencyBold = localFont({
  src: './fonts/AGENCYB.ttf',
  variable: '--font-agency',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: "Modified Cars For Sale UK | ASM Performance Cars",
    template: "%s | ASM Performance Cars",
  },
  description: "Specialists in high-performance, modified and luxury vehicles based in the UK.",
  keywords: [
    "performance cars", 
    "luxury vehicles", 
    "modified cars", 
    "supercars", 
    "car dealership", 
    "MOT check", 
    "UK cars"
  ],
  authors: [{ name: "ASM Performance Cars" }],
  creator: "ASM Performance Cars",
  publisher: "ASM Performance Cars",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://asmperformancecars.co.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asmperformancecars.co.uk",
    title: "Modified Cars For Sale UK | ASM Performance Cars",
    description: "Specialists in high-performance, modified and luxury vehicles based in the UK.",
    siteName: "ASM Performance Cars",
    images: [
      {
        url: "https://asmperformancecars.co.uk/social/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ASM Performance Cars",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modified Cars For Sale UK | ASM Performance Cars",
    description: "Specialists in high-performance, modified and luxury vehicles based in the UK.",
    images: ["https://asmperformancecars.co.uk/social/twitter-image.jpg"],
    creator: "@asmperformance",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Remove the Google verification code since you're using domain verification
  },
  category: "Automotive",
};

// Define the structured schema data for the car dealership
const schemaData = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "name": "ASM Performance Cars",
  "image": "https://asmperformancecars.co.uk/logo.jpg",
  "url": "https://asmperformancecars.co.uk",
  "telephone": "+447306657000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "74 Cooperative Street",
    "addressLocality": "Stafford",
    "postalCode": "ST16 3DA",
    "addressCountry": "GB"
  },
  "priceRange": "££££",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/asmperformance",
    "https://www.instagram.com/asmperformance",
    "https://twitter.com/asmperformance"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Performance Vehicles",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Car",
          "name": "Luxury & Supercars",
          "description": "Premium luxury vehicles and supercars"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Car",
          "name": "Modified Performance Vehicles",
          "description": "Modified vehicles with enhanced performance"
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          saira.variable,
          agencyBold.variable
        )}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        
        {/* Schema.org structured data for car dealership */}
        <Script
          id="schema-org-script"
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </body>
    </html>
  );
}
