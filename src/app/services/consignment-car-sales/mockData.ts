import type { ConsignmentPageData } from '@/app/services/consignment/types';

// Mock fallback data
export const mockConsignmentData: ConsignmentPageData = {
  title: "Consignment Car Sales | ASM Performance Cars",
  description: "Sell your car on consignment with ASM Performance Cars. Get the best market value without the hassle of private selling.",
  seo: {
    title: "Consignment Car Sales & Sale or Return | ASM Performance Cars",
    description: "Let us sell your car on your behalf. Our consignment car sales service offers higher returns than trade-in and none of the stress of private selling.",
    keywords: ["consignment car sales", "sale or return", "SOR", "consignment sales", "car selling service"]
  },
  hero: {
    title: "Consignment Car Sales",
    subtitle: "Let us sell your car for the best possible price with none of the hassle",
    backgroundType: "image",
    backgroundImage: null, // Will use default image in the component
    ctaText: "Get Started",
    ctaUrl: "#contact"
  },
  introduction: {
    title: "The Smarter Way to Sell Your Car",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Consignment sales, also known as Sale or Return (SOR), is a professional service where we sell your vehicle on your behalf. Instead of the reduced value of a part-exchange or the stress of private selling, you entrust your car to us while retaining ownership until it sells."
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
            text: "At ASM Performance Cars, we handle every aspect of the selling process from marketing and viewings to paperwork and finance options. Once sold, you receive the agreed amount less our competitive commission fee."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    imagePosition: "right"
  },
  benefits: {
    title: "Benefits of Consignment Sales",
    subtitle: "Why choose consignment selling over other methods",
    items: [
      {
        title: "Higher Returns",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Achieve significantly better returns than trade-in or part-exchange values. Our reputation and marketing reach typically command higher prices than private sales."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "Professional Handling",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We manage all aspects of the sale including documentation, buyer negotiations, test drives, finance options, and warranty arrangements."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "Marketing Expertise",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Benefit from our professional photography, online listings, social media presence, and extensive network of qualified buyers looking for quality vehicles."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        title: "Zero Hassle",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Avoid the time-consuming and often frustrating process of private selling, including dealing with no-shows, test drives with strangers, and payment security concerns."
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
    title: "Our Consignment Process",
    subtitle: "How we work with you to sell your car",
    steps: [
      {
        stepNumber: 1,
        title: "Initial Consultation",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We'll assess your vehicle, discuss its history, condition, and unique features to determine an optimal selling price and timeframe."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 2,
        title: "Agreement & Preparation",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "After agreeing on terms, we prepare your vehicle for sale with professional cleaning, photography, and detailed listings that highlight its best features."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 3,
        title: "Marketing Campaign",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Your car is showcased across our website, social media platforms, and specialist automotive listings. We also directly contact potential buyers from our database."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 4,
        title: "Managing Inquiries",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We handle all buyer inquiries, arrange and supervise viewings and test drives, and negotiate with potential buyers to achieve the best possible price."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 5,
        title: "Completing the Sale",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Once a buyer is secured, we manage all paperwork, finance arrangements if required, and ensure secure payment before releasing the vehicle."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 6,
        title: "Prompt Settlement",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "You receive your payment promptly after the sale completes, with transparent deduction of our agreed commission and any agreed preparation costs."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ],
    ctaText: "Start the Process",
    ctaUrl: "#contact"
  },
  comparison: {
    title: "Compare Selling Methods",
    subtitle: "See how consignment compares to other ways of selling your car",
    methods: [
      {
        method: "Consignment / Sale or Return",
        pros: [
          "Typically higher sale price than other methods",
          "No hassle of dealing with buyers directly",
          "Professional marketing and presentation",
          "Full sales support including finance options",
          "Secure handling of payment and paperwork"
        ],
        cons: [
          "Commission fee from final sale price",
          "Not immediate cash in hand",
          "Typically takes 2-4 weeks to sell"
        ],
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Best for those wanting maximum return without the stress of selling privately. Ideal for premium, performance, or unique vehicles that benefit from specialist marketing."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        method: "Part Exchange / Trade-In",
        pros: [
          "Immediate transaction",
          "Convenient when buying another car",
          "No advertising or selling efforts required",
          "Simple and quick process"
        ],
        cons: [
          "Lowest return value of all methods",
          "Limited negotiation power",
          "Value heavily dependent on dealer's stock needs"
        ],
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Best for those who prioritize convenience and speed over maximum financial return, or when the vehicle has issues that might complicate a private sale."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        method: "Private Sale",
        pros: [
          "Potentially higher return than trade-in",
          "Complete control over the selling process",
          "No commission fees to pay"
        ],
        cons: [
          "Time-consuming and often stressful",
          "Dealing with no-shows and time-wasters",
          "Managing test drives with strangers",
          "Payment security concerns",
          "No professional marketing support",
          "Responsibility for all paperwork"
        ],
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Best for those with time, experience selling cars, and willingness to handle the entire process themselves. Most suitable for lower-value vehicles with broad appeal."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ]
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Hear from people who have sold their cars through our consignment service",
    items: [
      {
        name: "Michael Thompson",
        quote: "I was skeptical about consignment at first, but ASM Performance Cars made the process incredibly easy. They sold my Audi RS4 for £3,500 more than I was offered on trade-in, and I didn't have to deal with a single viewing myself.",
        soldCar: "Audi RS4 Avant",
        rating: 5
      },
      {
        name: "Sarah Wilson",
        quote: "After trying to sell my Mercedes privately for weeks and dealing with endless time-wasters, I gave ASM a chance. They sold it within 10 days for more than I was asking privately. Worth every penny of their commission!",
        soldCar: "Mercedes-AMG C63",
        rating: 5
      },
      {
        name: "Robert Patel",
        quote: "The team at ASM truly understand how to market performance cars. Their photography and listings were professional, and they found the perfect buyer for my M4. The process was smooth from start to finish.",
        soldCar: "BMW M4 Competition",
        rating: 5
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about our consignment sales service",
    faqs: [
      {
        question: "What commission rate do you charge?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Our commission rates are competitive and vary depending on the value of your vehicle and expected selling timeframe. Typically, our fees range from 5-10% of the final selling price. We'll discuss and agree on the exact rate during our initial consultation."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How long does it typically take to sell a car on consignment?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Most vehicles sell within 2-4 weeks, though premium or specialist cars might sell faster or take longer depending on the market. We'll provide a realistic timeframe based on your specific vehicle, its condition, and current market demand."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Is my car insured while it's with you?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Yes, your vehicle is fully insured under our motor trade policy while it's in our care, including during test drives. You can have complete peace of mind knowing your car is protected throughout the sales process."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Can I still use my car while it's listed for sale?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "While we recommend leaving the car with us for the most efficient selling process, we can arrange for limited-use agreements in certain circumstances. However, please note that having the car readily available for viewings significantly increases the chances of a quick sale."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "What happens if my car doesn't sell?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Our consignment agreements typically run for an initial period of 30-60 days. If the car hasn't sold within that timeframe, we'll discuss options with you, which may include adjusting the price, extending the agreement, or returning the vehicle to you with no sale fee (though preparation costs may still apply)."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "What types of cars do you accept for consignment?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We specialize in performance, premium, and unique vehicles. Generally, we accept vehicles that align with our typical inventory and customer base. We're happy to assess any vehicle you'd like to consign, but our service works best for cars that benefit from specialist marketing and typically sell for £10,000 and above."
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
    title: "Ready to Sell Your Car On Consignment?",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Contact us today to discuss how our consignment sales service can help you get the best price for your vehicle with none of the hassle of selling privately. Our team is ready to answer any questions and guide you through the process."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    buttonText: "Contact Us Now",
    buttonUrl: "/contact",
    backgroundColor: "red"
  }
}; 