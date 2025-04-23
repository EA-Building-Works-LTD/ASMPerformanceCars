import { CarDetailingPageData } from './types'

export const mockCarDetailingData: CarDetailingPageData = {
  title: "Car Detailing Services | ASM Performance Cars",
  description: "Professional car detailing and valeting services in Birmingham. Premium hand car wash and interior detailing for all vehicle types.",
  seo: {
    title: "Car Detailing & Valeting Services Birmingham | ASM Performance",
    description: "Professional car detailing services in Birmingham. Premium hand car wash, interior valeting and paint correction from ASM Performance partners.",
    keywords: ["car detailing", "car detailing birmingham", "car wash", "car valet", "hand car wash near me"]
  },
  hero: {
    title: "Professional Car Detailing Services",
    subtitle: "Premium car detailing and valeting services in Birmingham and surrounding areas",
    backgroundType: "image",
    backgroundImage: {
      asset: {
        url: "/images/services/car-detailing-hero.jpg"
      },
      alt: "Professional car detailing service"
    },
    ctaText: "Book a Detailing Service",
    ctaUrl: "/contact"
  },
  introduction: {
    title: "Expert Car Detailing Services",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "ASM Performance partners with expert detailers to provide comprehensive car detailing services to ensure your vehicle looks its absolute best. Whether you're preparing your car for sale, attending a special event, or simply want to maintain its pristine condition, our professional detailing services will exceed your expectations."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our detailing specialists utilise premium products and advanced techniques to clean, correct, and protect your vehicle's exterior and interior. From showroom-quality shine to meticulous interior cleaning, we take pride in delivering exceptional results that enhance both the appearance and value of your vehicle."
          }
        ]
      }
    ],
    image: {
      asset: {
        url: "/images/services/car-detailing-intro.jpg"
      },
      alt: "Car detailing in progress"
    },
    imagePosition: "right"
  },
  benefits: {
    title: "Why Choose Our Detailing Services?",
    subtitle: "We provide exceptional car detailing with attention to every detail",
    items: [
      {
        title: "Premium Products",
        description: "We use only the highest quality detailing products and materials to ensure superior results and protection for your vehicle.",
        icon: "sparkles"
      },
      {
        title: "Experienced Detailers",
        description: "Our skilled detailing specialists have years of experience working with all types of vehicles, from everyday cars to luxury models.",
        icon: "brush"
      },
      {
        title: "Comprehensive Services",
        description: "From basic washing to complete paint correction and ceramic coating, we offer a full range of detailing services.",
        icon: "check"
      },
      {
        title: "Attention to Detail",
        description: "We meticulously address every aspect of your vehicle, including hard-to-reach areas that are often overlooked.",
        icon: "star"
      },
      {
        title: "Convenient Service",
        description: "Flexible booking options and efficient service to minimise disruption to your schedule.",
        icon: "clock"
      },
      {
        title: "Long-lasting Results",
        description: "Our treatments don't just clean but protect your vehicle, maintaining its appearance for longer periods.",
        icon: "shield"
      }
    ],
    backgroundType: "light"
  },
  process: {
    title: "Our Car Detailing Process",
    subtitle: "A meticulous approach to car detailing that delivers exceptional results",
    steps: [
      {
        stepNumber: 1,
        title: "Initial Assessment",
        description: "We thoroughly inspect your vehicle to assess its condition and determine the most suitable detailing approach.",
        icon: "clipboard"
      },
      {
        stepNumber: 2,
        title: "Pre-wash & Decontamination",
        description: "We remove surface dirt and contaminants with a careful pre-wash process, preparing the vehicle for detailed cleaning.",
        icon: "droplet"
      },
      {
        stepNumber: 3,
        title: "Deep Cleaning",
        description: "Every surface is meticulously cleaned, from the exterior paintwork to the interior upholstery and trim.",
        icon: "brush"
      },
      {
        stepNumber: 4,
        title: "Paint Correction (if required)",
        description: "We address any imperfections, swirl marks, or scratches in the paintwork to restore a flawless finish.",
        icon: "sparkles"
      },
      {
        stepNumber: 5,
        title: "Protection Application",
        description: "High-quality wax, sealant, or ceramic coating is applied to protect the paintwork and enhance its shine.",
        icon: "shield"
      },
      {
        stepNumber: 6,
        title: "Final Inspection",
        description: "We conduct a comprehensive quality check to ensure every aspect of the detailing meets our exacting standards.",
        icon: "check"
      }
    ],
    ctaText: "Book a Detailing Service",
    ctaUrl: "/contact"
  },
  services: {
    title: "Our Detailing Services",
    subtitle: "We offer a range of professional detailing services for all vehicle types",
    items: [
      {
        title: "Exterior Detailing",
        description: "Comprehensive cleaning, polishing, and protection of your car's exterior surfaces, including paintwork, wheels, windows, and trim.",
        image: {
          asset: {
            url: "/images/services/exterior-detailing.jpg"
          },
          alt: "Exterior car detailing"
        }
      },
      {
        title: "Interior Detailing",
        description: "Thorough cleaning and conditioning of all interior surfaces, including upholstery, carpet, dashboard, and air vents.",
        image: {
          asset: {
            url: "/images/services/interior-detailing.jpg"
          },
          alt: "Interior car detailing"
        }
      },
      {
        title: "Paint Correction",
        description: "Professional removal of swirl marks, fine scratches, and other paint imperfections to restore your car's original shine.",
        image: {
          asset: {
            url: "/images/services/paint-correction.jpg"
          },
          alt: "Paint correction process"
        }
      },
      {
        title: "Ceramic Coating",
        description: "Advanced protection for your vehicle's paintwork, providing long-lasting shine, hydrophobic properties, and resistance to contaminants.",
        image: {
          asset: {
            url: "/images/services/ceramic-coating.jpg"
          },
          alt: "Ceramic coating application"
        }
      }
    ]
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Read what clients have to say about our car detailing services",
    items: [
      {
        name: "James Wilson",
        quote: "The detailing service was absolutely outstanding. My Audi looks better than when I first purchased it. The attention to detail was impressive, and the ceramic coating has made maintenance so much easier.",
        carModel: "Audi RS6",
        location: "Birmingham",
        rating: 5
      },
      {
        name: "Charlotte Taylor",
        quote: "I was amazed by the transformation of my car's interior. Every surface was meticulously cleaned, and all the stubborn stains were removed. Excellent service and highly professional team.",
        carModel: "Range Rover Sport",
        location: "Solihull",
        rating: 5
      },
      {
        name: "Oliver Hughes",
        quote: "Brilliant service from start to finish. The paint correction removed years of swirl marks and scratches. My BMW looks showroom fresh again. Well worth the investment.",
        carModel: "BMW M3",
        location: "Sutton Coldfield",
        rating: 5
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our car detailing services",
    faqs: [
      {
        question: "How long does a full car detailing service take?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "A comprehensive car detailing service typically takes between 4-10 hours, depending on the size and condition of your vehicle and the specific services requested. For extensive paint correction or ceramic coating applications, the process may extend over multiple days to ensure the best results."
              }
            ]
          }
        ]
      },
      {
        question: "What's the difference between car valeting and car detailing?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Car valeting typically focuses on cleaning the vehicle, both inside and out, to a high standard. Car detailing goes much further, involving meticulous attention to every detail of the vehicle. This includes deep cleaning, paint correction, machine polishing, and applying protective treatments. Detailing aims not just to clean but to restore and enhance the vehicle's appearance to the highest possible standard."
              }
            ]
          }
        ]
      },
      {
        question: "How often should I have my car professionally detailed?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "For optimal results, we recommend professional detailing 2-4 times per year, depending on your driving conditions, exposure to the elements, and how frequently you wash your car. Regular maintenance details can be performed more frequently, while more intensive services like paint correction may be needed less often."
              }
            ]
          }
        ]
      },
      {
        question: "Is ceramic coating worth the investment?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Ceramic coating provides significant benefits including superior protection against environmental contaminants, enhanced gloss, and hydrophobic properties that make cleaning easier. While it represents a higher initial investment compared to traditional waxes or sealants, it offers much longer-lasting protection (typically 2-5 years depending on the coating) and can help maintain your vehicle's value. For those who want the best protection and appearance for their vehicle, ceramic coating is definitely worth considering."
              }
            ]
          }
        ]
      },
      {
        question: "Do you offer mobile detailing services?",
        answer: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Yes, through our partners we offer mobile detailing services within Birmingham and surrounding areas. Our mobile service brings professional-grade equipment and products to your location, whether that's your home or workplace. However, for certain services like extensive paint correction or ceramic coating application, we recommend bringing your vehicle to a controlled environment for optimal results."
              }
            ]
          }
        ]
      }
    ]
  },
  seoContent: {
    enabled: true,
    title: "Professional Car Detailing Services in Birmingham",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "At ASM Performance Cars, we partner with the finest car detailing specialists in Birmingham to offer comprehensive detailing services for all vehicle types. Our detailing services go beyond standard car washing to deliver a truly exceptional finish that enhances your vehicle's appearance and protects its surfaces."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Based in Birmingham, our detailing services are available to customers throughout the West Midlands, including Solihull, Sutton Coldfield, and surrounding areas. Whether you're looking for a premium hand car wash, interior valeting, or complete detailing package with paint correction and protection, our experienced team delivers outstanding results."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our car detailing process involves meticulous cleaning, polishing, and protection of both exterior and interior surfaces. We use only premium products and equipment to ensure the highest quality finish for your vehicle. From removing swirl marks and scratches through paint correction to applying ceramic coatings for long-lasting protection, we offer a complete range of detailing services to meet your specific requirements."
          }
        ]
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Looking for the best hand car wash near you? Our professional team provides careful hand washing that protects your vehicle's paintwork while delivering exceptional cleanliness. Our interior valeting services include thorough cleaning of all surfaces, stain removal, and conditioning of leather and other materials to restore your car's cabin to pristine condition."
          }
        ]
      }
    ]
  },
  cta: {
    title: "Ready to Transform Your Vehicle?",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Book a professional detailing service today and experience the difference our expert care can make to your vehicle's appearance and value."
          }
        ]
      }
    ],
    primaryButton: {
      text: "Book Now",
      url: "/contact"
    },
    secondaryButton: {
      text: "Our Services",
      url: "#services"
    },
    backgroundColor: "bg-red-600"
  }
} 