import type { FinancePageData } from '@/app/services/finance/types';

// Mock fallback data
export const mockFinanceData: FinancePageData = {
  title: "Car Finance",
  description: "Flexible finance options for your next vehicle purchase",
  seo: {
    title: "Car Finance | ASM Performance Cars",
    description: "Explore our range of flexible car finance options tailored to your needs. Low rates, quick approval, and excellent customer service.",
    keywords: ["car finance", "vehicle loans", "auto finance", "car financing UK", "performance car finance"]
  },
  hero: {
    title: "Drive Away Today with Our Car Finance Options",
    subtitle: "Competitive rates and flexible terms tailored to your needs and budget",
    ctaText: "Calculate Your Payments",
    ctaUrl: "#calculator"
  },
  introduction: {
    title: "Car Finance Made Simple",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "At ASM Performance Cars, we understand that purchasing your dream car should be an exciting experience, not a stressful one. That's why we offer straightforward, competitive financing options designed to get you behind the wheel with payment terms that fit your budget."
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
            text: "Our dedicated finance team works with multiple lenders to secure the best possible rates, regardless of your credit history. Whether you're looking for a modified performance vehicle, luxury supercar, or reliable used car, we have finance solutions to match."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    imagePosition: "right",
    stats: [
      { value: "£1,000+", label: "Minimum Finance" },
      { value: "3.9%", label: "Rates From" },
      { value: "97%", label: "Approval Rate" }
    ]
  },
  financeOptions: {
    title: "Finance Options",
    subtitle: "Choose the finance package that works best for you",
    options: [
      {
        title: "Hire Purchase (HP)",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "A straightforward way to finance your vehicle with fixed monthly payments over an agreed period. At the end of the term, you own the vehicle outright."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ],
        highlights: ["Fixed interest rate", "No large final payment", "Flexible terms from 12-60 months", "No mileage restrictions"]
      },
      {
        title: "Personal Contract Purchase (PCP)",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Lower monthly payments with options at the end of the term: pay the balloon payment to own the car, hand it back, or part-exchange for a new vehicle."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ],
        highlights: ["Lower monthly payments", "Flexible end-of-term options", "Ideal for those who like to change vehicles regularly", "Terms typically 24-48 months"]
      },
      {
        title: "Personal Loan",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "A simple unsecured loan that gives you immediate ownership of the vehicle. Competitive rates available based on your credit history."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ],
        highlights: ["Immediate vehicle ownership", "No security against the vehicle", "Fixed monthly payments", "Early repayment options"]
      }
    ]
  },
  financeProcess: {
    title: "How Our Finance Process Works",
    subtitle: "Getting finance for your dream car is quick and easy",
    steps: [
      {
        stepNumber: 1,
        title: "Choose Your Vehicle",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Browse our extensive range of vehicles and find the perfect car for your needs and budget. Our team is on hand to answer any questions you might have."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 2,
        title: "Apply for Finance",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Complete our simple finance application form either online or in-dealership. We'll need some basic personal and financial information to process your application."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 3,
        title: "Receive Your Approval",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Our finance team will process your application and present you with the available options. In most cases, we can provide a decision within 1 hour during business hours."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        stepNumber: 4,
        title: "Drive Away",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Once your finance is approved and paperwork completed, you're ready to drive away in your new car! The whole process can often be completed the same day."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      }
    ]
  },
  calculator: {
    title: "Calculate Your Monthly Payments",
    subtitle: "Use our simple calculator to estimate your monthly repayments",
    settings: {
      defaultRate: 7.9,
      minLoanAmount: 1000,
      maxLoanAmount: 150000,
      minTerm: 12,
      maxTerm: 84,
      disclaimer: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: "This calculator provides an estimate only. Final rates and payments will be determined based on your credit history and individual circumstances. Representative APR 7.9%. Subject to status."
            }
          ],
          markDefs: [],
          style: "normal"
        }
      ]
    }
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our car finance options",
    faqs: [
      {
        question: "What credit score do I need for car finance?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "We work with a wide panel of lenders who cater to various credit profiles. While a good credit score will typically secure better rates, we have finance options available for all credit situations, including those with no credit history or past credit issues."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "How long does the finance application process take?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "In most cases, we can provide a decision on your finance application within 1 hour during business hours. The complete process, including paperwork and vehicle preparation, can often be completed within the same day."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Can I settle my finance agreement early?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Yes, all of our finance agreements can be settled early. This may save you money on interest payments. Early settlement figures can be obtained directly from your finance provider, and we're happy to help guide you through this process."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "Do you offer finance for modified cars?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Yes, we specialize in financing for modified and performance vehicles. Our lenders understand the value of quality modifications and our finance options are specifically designed to accommodate these specialized vehicles."
              }
            ],
            markDefs: [],
            style: "normal"
          }
        ]
      },
      {
        question: "What documents do I need to apply for finance?",
        answer: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "To apply for finance, you'll typically need proof of identity (passport or driving license), proof of address (utility bill or bank statement dated within the last 3 months), and proof of income (payslips or bank statements). The exact requirements may vary based on the lender and finance product."
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
    title: "Ready to Get Started?",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Apply for finance today and take the first step towards driving your dream car. Our dedicated team is here to help you every step of the way."
          }
        ],
        markDefs: [],
        style: "normal"
      }
    ],
    primaryButtonText: "Apply Now",
    primaryButtonUrl: "/services/finance/apply",
    secondaryButtonText: "Contact Us",
    secondaryButtonUrl: "/contact",
    backgroundColor: "red"
  }
}; 