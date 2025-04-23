import { CarTransportationPageData } from './types'

export const mockCarTransportationData: CarTransportationPageData = {
  title: "Car Transportation Services | ASM Performance Cars",
  description: "Professional car transportation and vehicle delivery services across the UK. Safe, secure and reliable transportation for all vehicle types.",
  seo: {
    title: "Car Transportation & Vehicle Delivery Services | ASM Performance",
    description: "Professional car transportation services from ASM Performance. Safe, secure and reliable vehicle delivery across the UK for all car types.",
    keywords: ["car transporter", "car delivery service", "car delivery", "car transportation", "car transport"]
  },
  hero: {
    title: "Professional Car Transportation Services",
    subtitle: "Safe, secure and reliable vehicle transportation across the UK",
    backgroundType: "image",
    backgroundImage: {
      asset: {
        url: "/images/services/car-transport-hero.jpg"
      },
      alt: "Car transporter with luxury vehicles"
    },
    ctaText: "Get a Quote",
    ctaUrl: "/contact"
  },
  introduction: {
    title: "Expert Car Transportation Services",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "ASM Performance provides professional car transportation services, ensuring your vehicle arrives safely at its destination. Whether you've purchased a vehicle that needs collecting, require delivery to a buyer, or need transportation for a special event, our dedicated team offers reliable and efficient solutions."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "With our specialised equipment and experienced team, we handle all types of vehicles including luxury cars, sports cars, classic vehicles, and standard vehicles. Our comprehensive insurance and careful handling procedures ensure your vehicle is protected throughout its journey."
          }
        ]
      }
    ],
    image: {
      asset: {
        url: "/images/services/car-transport-intro.jpg"
      },
      alt: "Car being loaded onto transporter"
    },
    imagePosition: "right"
  },
  benefits: {
    title: "Why Choose Our Transportation Services?",
    subtitle: "We provide exceptional vehicle transportation with complete peace of mind",
    items: [
      {
        title: "Fully Insured Service",
        description: "Comprehensive insurance coverage for your vehicle during transportation for complete peace of mind.",
        icon: "shield"
      },
      {
        title: "Experienced Drivers",
        description: "Our skilled team has years of experience in safely transporting vehicles of all types and values.",
        icon: "truck"
      },
      {
        title: "Nationwide Coverage",
        description: "Door-to-door service throughout the entire UK with flexible pickup and delivery options.",
        icon: "map"
      },
      {
        title: "Specialist Equipment",
        description: "Purpose-built transporters with advanced securing systems to protect your vehicle during transit.",
        icon: "car"
      },
      {
        title: "Competitive Pricing",
        description: "Transparent, competitive rates with no hidden fees or unexpected charges.",
        icon: "pound"
      },
      {
        title: "Timely Delivery",
        description: "Reliable scheduling and prompt delivery to meet your specific timeframe requirements.",
        icon: "clock"
      }
    ],
    backgroundType: "light"
  },
  process: {
    title: "Our Car Transportation Process",
    subtitle: "A simple, seamless process from booking to delivery",
    steps: [
      {
        stepNumber: 1,
        title: "Contact & Quote",
        description: "Get in touch with our team to discuss your transportation requirements and receive a detailed quote.",
        icon: "phone"
      },
      {
        stepNumber: 2,
        title: "Schedule Collection",
        description: "Once confirmed, we'll arrange a convenient collection time that works with your schedule.",
        icon: "calendar"
      },
      {
        stepNumber: 3,
        title: "Vehicle Inspection",
        description: "We thoroughly inspect and document your vehicle's condition before loading it onto our transporter.",
        icon: "clipboard"
      },
      {
        stepNumber: 4,
        title: "Secure Transportation",
        description: "Your vehicle is safely secured on our specialised transporter for its journey to the destination.",
        icon: "truck"
      },
      {
        stepNumber: 5,
        title: "Delivery & Handover",
        description: "We deliver your vehicle to the specified location and complete a final inspection with you.",
        icon: "key"
      }
    ],
    ctaText: "Book Transportation",
    ctaUrl: "/contact"
  },
  services: {
    title: "Our Transportation Services",
    subtitle: "We offer a range of transportation solutions for your vehicle",
    items: [
      {
        title: "Single Vehicle Transport",
        description: "Dedicated transportation for individual vehicles with personalised service and direct delivery.",
        image: {
          asset: {
            url: "/images/services/single-car-transport.jpg"
          },
          alt: "Single car being transported"
        }
      },
      {
        title: "Multi-Vehicle Transport",
        description: "Efficient transportation for multiple vehicles, ideal for dealerships or collection relocations.",
        image: {
          asset: {
            url: "/images/services/multi-car-transport.jpg"
          },
          alt: "Multiple cars on transporter"
        }
      },
      {
        title: "Enclosed Transport",
        description: "Premium enclosed transportation providing additional protection for luxury, classic or high-value vehicles.",
        image: {
          asset: {
            url: "/images/services/enclosed-transport.jpg"
          },
          alt: "Enclosed car transporter"
        }
      },
      {
        title: "Event Transportation",
        description: "Specialised transportation services for shows, exhibitions and automotive events.",
        image: {
          asset: {
            url: "/images/services/event-transport.jpg"
          },
          alt: "Car being delivered to event"
        }
      }
    ]
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Read what clients have to say about our car transportation services",
    items: [
      {
        name: "Michael Thompson",
        quote: "Excellent service from start to finish. My Porsche was transported with the utmost care and delivered exactly when promised. Highly recommended!",
        transportedCar: "Porsche 911",
        location: "Manchester",
        rating: 5
      },
      {
        name: "Sarah Williams",
        quote: "I was nervous about having my classic car transported, but the team at ASM were fantastic. They kept me informed throughout and the car arrived in perfect condition.",
        transportedCar: "Jaguar E-Type",
        location: "Edinburgh",
        rating: 5
      },
      {
        name: "David Chen",
        quote: "Professional, punctual and reasonably priced. The driver was courteous and took great care with my vehicle. Will definitely use again.",
        transportedCar: "BMW M4",
        location: "London",
        rating: 4
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our car transportation services",
    faqs: [
      {
        question: "How far in advance should I book car transportation?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "We recommend booking at least 1-2 weeks in advance to ensure availability, especially during busy periods. However, we can often accommodate last-minute requests depending on our schedule, so don't hesitate to contact us."
              }
            ]
          }
        ]
      },
      {
        question: "Is my vehicle insured during transportation?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Yes, all vehicles transported by ASM are fully insured during transit. We provide comprehensive coverage to ensure your vehicle is protected throughout its journey. We'll provide you with all insurance details before transport."
              }
            ]
          }
        ]
      },
      {
        question: "What types of vehicles do you transport?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "We transport all types of vehicles, including luxury cars, sports cars, classics, standard vehicles, and even modified vehicles. Our specialised equipment allows us to safely transport vehicles of various sizes and values."
              }
            ]
          }
        ]
      },
      {
        question: "How do you secure vehicles during transport?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "We use industry-leading securing systems including wheel straps, soft tie-downs, and specialised restraints designed to protect your vehicle. Our methods prevent movement during transit while avoiding any damage to your vehicle's components."
              }
            ]
          }
        ]
      },
      {
        question: "Do I need to be present for pickup and delivery?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "While it's preferred that you or an authorised representative is present for inspection and handover, we can make alternative arrangements if necessary. Just let us know your requirements when booking."
              }
            ]
          }
        ]
      },
      {
        question: "How do you determine the cost of transportation?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Our pricing is based on several factors including distance, vehicle type, specific requirements (such as enclosed transport), and timing. We provide transparent quotes with no hidden fees so you know exactly what you're paying for."
              }
            ]
          }
        ]
      }
    ]
  },
  seoContent: {
    enabled: true,
    title: "Professional Car Transportation Services",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "ASM Performance offers professional car transportation and vehicle delivery services across the UK. Our car transporter services ensure your vehicle reaches its destination safely and securely, whether you're moving a luxury sports car, classic vehicle, or standard car."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "With our dedicated car delivery service, you can trust that your vehicle will be handled with the utmost care by our experienced team. We utilise specialised equipment and follow strict protocols to ensure your vehicle arrives in the same condition it left."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our car transport services cover the entire UK, offering convenient door-to-door delivery. Whether you need a single vehicle moved or multiple cars transported, our flexible options can accommodate your specific requirements."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "When choosing a car transportation provider, reliability and professionalism are paramount. ASM Performance combines industry expertise with exceptional customer service to deliver a seamless experience from booking to delivery. Contact us today to discuss your car transportation needs and receive a competitive quote."
          }
        ]
      }
    ]
  },
  cta: {
    title: "Ready to Transport Your Vehicle?",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Contact our team today to discuss your car transportation requirements and receive a personalised quote."
          }
        ]
      }
    ],
    primaryButton: {
      text: "Get a Quote",
      url: "/contact"
    },
    secondaryButton: {
      text: "Learn More",
      url: "#process"
    },
    backgroundColor: "bg-red-600"
  }
} 