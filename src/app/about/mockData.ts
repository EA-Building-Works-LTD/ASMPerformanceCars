import type { AboutPageData } from '@/app/about/types';

// Mock fallback data
export const mockAboutData: AboutPageData = {
  title: "About Our Modified Cars & Values | ASM Performance Cars",
  description: "Discover our story, our team, and our commitment to providing exceptional modified vehicles.",
  seo: {
    title: "About Our Modified Cars & Values | ASM Performance Cars",
    description: "Learn about ASM Performance Cars, our journey, our team, and our passion for high-performance and modified vehicles.",
    keywords: ["about ASM", "car dealership history", "performance car specialists", "modified car experts", "luxury car team"]
  },
  hero: {
    title: "About Our Modified Cars & Values",
    subtitle: "We're passionate about performance vehicles and dedicated to finding the perfect car for every enthusiast.",
    backgroundType: "image",
    backgroundImage: null, // Will use default image in the component
  },
  introduction: {
    title: "Our Passion for Performance",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Founded in 2015, ASM Performance Cars has grown from a small specialist dealership to one of the UK's premier destinations for performance, modified, and luxury vehicles. Our journey began with a simple mission: to provide car enthusiasts with exceptional vehicles that deliver both performance and style."
          }
        ],
        markDefs: [],
        style: "normal"
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Today, we continue that mission with an expanded team of dedicated professionals who share the same passion for automotive excellence. Every vehicle in our collection is personally selected and inspected to ensure it meets our exacting standards."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    imagePosition: "right",
  },
  story: {
    title: "Our Journey",
    subtitle: "From humble beginnings to becoming a trusted name in performance vehicles",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "ASM Performance Cars began with two friends who shared a passion for modified vehicles and a vision to create a different kind of dealership experience. What started as a small showroom with just five vehicles has grown into a comprehensive automotive destination with a reputation for quality and expertise."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    milestones: [
      {
        year: "2015",
        title: "The Beginning",
        description: "ASM Performance Cars was founded in Stafford with a small team of just three people and a collection of five premium vehicles."
      },
      {
        year: "2017",
        title: "Expansion",
        description: "We moved to a larger showroom and expanded our team to accommodate our growing inventory and customer base."
      },
      {
        year: "2019",
        title: "Service Department",
        description: "We established our dedicated service department to provide specialist maintenance for performance and modified vehicles."
      },
      {
        year: "2021",
        title: "Online Presence",
        description: "We launched our comprehensive online platform, making it easier for customers to browse our inventory and access our services."
      },
      {
        year: "2023",
        title: "Industry Recognition",
        description: "ASM Performance Cars was recognized as one of the top specialist dealerships in the Midlands."
      }
    ]
  },
  team: {
    title: "Meet Our Team",
    subtitle: "The passionate professionals behind ASM Performance Cars",
    members: [
      {
        name: "John Smith",
        role: "Founder & Managing Director",
        bio: "With over 20 years in the automotive industry, John's expertise and passion for performance vehicles led to the creation of ASM Performance Cars. His vision continues to drive our growth and commitment to excellence.",
        socialLinks: [
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/"
          }
        ]
      },
      {
        name: "Sarah Johnson",
        role: "Sales Director",
        bio: "Sarah brings 15 years of experience in premium automotive sales. Her in-depth knowledge of the performance car market ensures our customers find the perfect vehicle to match their requirements.",
        socialLinks: [
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/"
          },
          {
            platform: "twitter",
            url: "https://twitter.com/"
          }
        ]
      },
      {
        name: "Michael Chen",
        role: "Head of Technical Services",
        bio: "Michael leads our technical team with his extensive background in performance vehicle engineering. His expertise ensures every vehicle we sell meets our exacting standards for performance and reliability.",
        socialLinks: [
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/"
          }
        ]
      },
      {
        name: "Emma Williams",
        role: "Customer Experience Manager",
        bio: "Emma's dedication to customer satisfaction has helped establish our reputation for exceptional service. She ensures every interaction with ASM Performance Cars exceeds expectations.",
        socialLinks: [
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/"
          },
          {
            platform: "instagram",
            url: "https://www.instagram.com/"
          }
        ]
      }
    ]
  },
  values: {
    title: "Our Core Values",
    subtitle: "The principles that guide everything we do",
    values: [
      {
        title: "Passion",
        description: "We're genuinely passionate about performance vehicles. This isn't just a business for us – it's a way of life.",
        icon: "heart"
      },
      {
        title: "Expertise",
        description: "Our team comprises automotive specialists with deep knowledge and experience in the performance and luxury vehicle market.",
        icon: "award"
      },
      {
        title: "Integrity",
        description: "We operate with complete transparency and honesty in every aspect of our business.",
        icon: "shield"
      },
      {
        title: "Quality",
        description: "We maintain the highest standards for every vehicle in our collection, ensuring exceptional performance and reliability.",
        icon: "check-circle"
      },
      {
        title: "Customer-Focused",
        description: "Our customers are at the heart of everything we do. We're dedicated to providing an exceptional experience from start to finish.",
        icon: "users"
      }
    ],
    backgroundColor: "bg-gray-100"
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Hear from the enthusiasts who've experienced the ASM Performance Cars difference",
    testimonials: [
      {
        name: "David Thompson",
        quote: "The team at ASM Performance Cars made finding my dream car an absolute pleasure. Their knowledge and passion for performance vehicles are unmatched.",
        role: "BMW M3 Owner",
        rating: 5
      },
      {
        name: "Rebecca Clarke",
        quote: "From the initial enquiry to driving away in my modified Audi RS6, the experience was exceptional. The attention to detail and customer service are fantastic.",
        role: "Audi Enthusiast",
        rating: 5
      },
      {
        name: "James Wilson",
        quote: "Having purchased three vehicles from ASM Performance Cars, I wouldn't go anywhere else. Their expertise and the quality of their vehicles are consistently excellent.",
        role: "Repeat Customer",
        rating: 5
      }
    ]
  },
  cta: {
    title: "Ready to Experience ASM Performance Cars?",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Whether you're looking to purchase a performance vehicle or simply want to learn more about what we offer, we're here to help. Get in touch with our team today."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    primaryButton: {
      text: "View Our Inventory",
      url: "/our-cars"
    },
    secondaryButton: {
      text: "Contact Us",
      url: "/contact"
    },
    backgroundColor: "bg-red-600"
  }
} 