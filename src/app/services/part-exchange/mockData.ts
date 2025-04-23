import type { PartExchangePageData } from '@/app/services/part-exchange/types';

// Mock fallback data
export const mockPartExchangeData: PartExchangePageData = {
  title: "Part Exchange Your Car",
  description: "Get a fair price for your car and put it towards your next vehicle with our flexible part exchange service",
  seo: {
    title: "Part Exchange Your Car | ASM Performance Cars",
    description: "Trade in your current vehicle and upgrade to something new. Fast, fair valuations and a hassle-free process with ASM Performance Cars.",
    keywords: ["part exchange", "car trade in", "vehicle valuation", "car trade in UK", "car part exchange Stafford"]
  },
  hero: {
    title: "Part Exchange Your Car",
    subtitle: "Trade in your current vehicle and upgrade to something new with our hassle-free part exchange service",
    backgroundType: "image",
    backgroundImage: null, // Will use default image in the component
    ctaText: "Get a Valuation",
    ctaUrl: "#valuation"
  },
  introduction: {
    title: "The Simple Way to Upgrade Your Car",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Part exchanging your car is one of the easiest ways to upgrade to a newer model. By using your current vehicle as part payment towards your next car, you can reduce the amount you need to finance or pay upfront."
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
            text: "At ASM Performance Cars, we offer competitive valuations on all makes and models. Our team of experts will assess your vehicle's condition, age, mileage, and market value to provide you with a fair part exchange offer."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    imagePosition: "right"
  },
  benefits: {
    title: "Benefits of Part Exchange",
    subtitle: "Why choose part exchange for your next car purchase",
    items: [
      {
        title: "Hassle-Free Process",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Avoid the stress of selling privately. No advertising, no dealing with multiple potential buyers, and no time wasted on viewings that don't lead to a sale."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "Reduce Your Finance Amount",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Use the value of your current vehicle to reduce the amount you need to borrow or pay upfront for your new car, potentially lowering your monthly payments."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "Same-Day Transactions",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Complete the entire process in one visit. Drive in with your old car and drive away with your new one on the same day, with all paperwork handled by our team."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "No Transfer Fees",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We handle all the DVLA paperwork for you, with no additional fees for transferring ownership, saving you both time and money."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ],
    backgroundType: "light"
  },
  process: {
    title: "How Our Part Exchange Process Works",
    subtitle: "A simple, transparent process from start to finish",
    steps: [
      {
        stepNumber: 1,
        title: "Online Valuation",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Start with an online valuation by entering your registration number and vehicle details. This gives you an initial estimate of your car's value."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 2,
        title: "Book an Appraisal",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Bring your car to our dealership for a thorough inspection. Our experts will check its condition, service history, and documentation to provide an accurate valuation."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 3,
        title: "Receive Your Offer",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We'll present you with a clear, fair offer for your vehicle based on its current market value and condition. No hidden fees or last-minute reductions."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 4,
        title: "Choose Your Next Car",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Browse our extensive inventory of quality vehicles to find your perfect upgrade. Our team can help you narrow down your options based on your preferences and budget."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 5,
        title: "Complete the Exchange",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Once you've chosen your new car, we'll handle all the paperwork for the part exchange. Pay any outstanding balance, and drive away in your new vehicle."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ],
    ctaText: "Get Started Today",
    ctaUrl: "#valuation"
  },
  valuation: {
    title: "Get Your Car Valuation",
    subtitle: "Find out how much your car is worth in just a few clicks",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Our online valuation tool provides an instant estimate of your car's trade-in value. Enter your vehicle details below to get started. For a more accurate valuation, visit our dealership for a full assessment."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    ctaText: "Start Valuation",
    ctaUrl: "https://www.asmperformancecars.co.uk/contact",
    backgroundType: "colored",
    backgroundColor: "bg-red-600"
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Hear from people who have part exchanged their cars with us",
    items: [
      {
        name: "James Wilson",
        quote: "The part exchange process was incredibly smooth. I got a fair price for my BMW and drove away in a beautiful Audi RS5 the same day. The staff were knowledgeable and made everything simple.",
        exchangedCar: "BMW 330i",
        purchasedCar: "Audi RS5",
        rating: 5
      },
      {
        name: "Sarah Thompson",
        quote: "I was worried about the hassle of selling my car privately. Part exchanging with ASM saved me so much time and stress. The valuation was fair and the transition to my new Mercedes was seamless.",
        exchangedCar: "Volkswagen Golf GTI",
        purchasedCar: "Mercedes-Benz C43 AMG",
        rating: 5
      },
      {
        name: "Michael Chen",
        quote: "Excellent service from start to finish. The online valuation was close to what I received in person, and there were no surprises or hidden fees. Very transparent process.",
        exchangedCar: "Nissan 370Z",
        purchasedCar: "Porsche Cayman",
        rating: 4
      },
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about our part exchange service",
    faqs: [
      {
        question: "What documents do I need for part exchange?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "You'll need to bring your V5C logbook, service history, MOT certificate, spare keys, and any warranty documentation. It's also helpful to have maintenance receipts if available. Having these documents ready will ensure a smooth part exchange process."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Can I part exchange if I still have finance on my car?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Yes, we can still accept your car in part exchange if it has outstanding finance. We'll value your car and settle the remaining finance directly with your lender. If your car is worth more than the settlement figure, you can put the difference towards your new vehicle. If it's worth less, you'll need to pay the shortfall."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How is my car's part exchange value determined?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We consider several factors when valuing your car: make, model, age, mileage, condition (both mechanical and cosmetic), service history, number of previous owners, and current market demand. We use industry-standard pricing guides along with our market expertise to offer you a competitive valuation."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "What if my car has damage or mechanical issues?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We accept cars in all conditions, but damage or mechanical issues will affect the valuation. Be transparent about any known issues during the initial valuation to avoid surprises later. Minor cosmetic damage usually has a minimal impact on value, while significant mechanical problems will reduce the offer more substantially."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How long does the part exchange process take?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "The entire process can often be completed in a single day. The vehicle inspection typically takes 30-60 minutes, and if you're happy with our valuation and have chosen your new car, we can handle all the paperwork the same day. If your car has finance to settle, this might take 1-2 additional working days to process."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Is part exchange better than selling privately?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "While you might get a slightly higher price selling privately, part exchange offers significant convenience benefits. You avoid advertising costs, arranging viewings, dealing with potential buyers, and the security concerns of handling large payments. Part exchange also simplifies the tax and ownership transfer process, as we handle all the paperwork for you."
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
    title: "Ready to Part Exchange Your Car?",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Get started with an online valuation today, or visit our dealership for an in-person appraisal. Our team is ready to help you find your perfect upgrade."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    primaryButtonText: "Get a Valuation",
    primaryButtonUrl: "#valuation",
    secondaryButtonText: "Contact Us",
    secondaryButtonUrl: "/contact",
    backgroundColor: "red"
  }
}; 