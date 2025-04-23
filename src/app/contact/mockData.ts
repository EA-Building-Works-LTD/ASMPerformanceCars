import type { ContactPageData } from '@/app/contact/types';

// Mock fallback data
export const mockContactData: ContactPageData = {
  title: "Contact Us",
  description: "Get in touch with our team for any inquiries about our vehicles, services, or to schedule a viewing.",
  seo: {
    title: "Contact Us | ASM Performance Cars",
    description: "Reach out to our team for inquiries about our premium vehicles. Visit our showroom in Stafford or call us to discuss your requirements.",
    keywords: ["contact ASM", "car dealership contact", "performance cars inquiry", "Stafford car dealer", "contact car sales"]
  },
  hero: {
    title: "Contact ASM Performance Cars",
    subtitle: "We're here to help with any inquiries about our vehicles and services. Get in touch with our team today.",
    backgroundType: "image",
    backgroundImage: null, // Will use default image in the component
  },
  contactInfo: {
    title: "Our Contact Details",
    subtitle: "Multiple ways to get in touch with our team",
    address: "74 Co-operative St, Stafford ST16 3DA",
    phone: "+44 7306 657 000",
    email: "info@asmperformancecars.co.uk",
    openingHours: [
      {
        days: "Monday - Friday",
        hours: "9:00 AM - 6:00 PM"
      },
      {
        days: "Saturday",
        hours: "9:00 AM - 5:00 PM"
      },
      {
        days: "Sunday",
        hours: "Closed"
      }
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/asmperformance"
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/asmperformance"
      },
      {
        platform: "twitter",
        url: "https://twitter.com/asmperformance"
      }
    ]
  },
  contactForm: {
    title: "Send Us a Message",
    subtitle: "Fill out the form below and we'll get back to you as soon as possible",
    submitButtonText: "Send Message",
    successMessage: "Thank you for your message! We will get back to you shortly."
  },
  map: {
    title: "Visit Our Showroom",
    subtitle: "Come and see our collection of premium vehicles in person",
    latitude: 52.8085, // Approximate location for Stafford - should be updated with exact coordinates
    longitude: -2.1169,
    zoom: 15,
    showDirectionsLink: true,
    directionsLinkText: "Get Directions"
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Answers to common questions about contacting us and our services",
    faqs: [
      {
        question: "Do I need to make an appointment to view a vehicle?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "While walk-ins are welcome during our opening hours, we recommend booking an appointment to ensure the vehicle you're interested in is available and to receive our full attention. You can book an appointment by phone or through our contact form."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How quickly do you respond to inquiries?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, we recommend calling our phone number directly."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Can I request more information or photos of a specific vehicle?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Absolutely! If you need additional information or specific photos of any vehicle in our inventory, please mention this in your message or call us directly. We're happy to provide any details that will help with your decision."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Do you offer vehicle delivery services?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Yes, we offer nationwide delivery services for purchased vehicles. Delivery costs will vary depending on your location. Please contact us for a specific quote."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How can I check the status of my order or inquiry?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "You can check the status of your order or inquiry by contacting us via phone or email. Please have your reference number or vehicle details ready so we can assist you more efficiently."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ]
  },
  cta: {
    title: "Interested in Our Premium Vehicles?",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Browse our extensive collection of modified and luxury vehicles. Find your perfect match today."
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
      text: "Learn About Finance",
      url: "/services/finance"
    },
    backgroundColor: "bg-red-600"
  }
} 