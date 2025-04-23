import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partExchangePage',
  title: 'Part Exchange Page',
  type: 'document',
  groups: [
    {
      name: 'seo',
      title: 'SEO & Metadata',
    },
    {
      name: 'hero',
      title: 'Hero Section',
    },
    {
      name: 'introduction',
      title: 'Introduction',
    },
    {
      name: 'benefits',
      title: 'Benefits',
    },
    {
      name: 'process',
      title: 'Exchange Process',
    },
    {
      name: 'valuation',
      title: 'Valuation Tool',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
    },
    {
      name: 'faq',
      title: 'FAQ Section',
    },
    {
      name: 'cta',
      title: 'Call to Action',
    }
  ],
  fields: [
    // SEO Fields
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      validation: Rule => Rule.max(160).warning('SEO descriptions work best when under 160 characters')
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
    }),
    
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'hero',
    }),
    defineField({
      name: 'heroBackgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Solid Color', value: 'color'}
        ],
        layout: 'radio',
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroBackgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: 'bg-red-600'},
          {title: 'Gray', value: 'bg-gray-900'},
          {title: 'Dark Blue', value: 'bg-blue-900'},
        ]
      },
      hidden: ({document}) => document?.heroBackgroundType !== 'color',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({document}) => document?.heroBackgroundType !== 'image',
      group: 'hero',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero Call to Action Button',
      type: 'object',
      group: 'hero',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string',
        }
      ]
    }),
    
    // Introduction Section
    defineField({
      name: 'introTitle',
      title: 'Introduction Title',
      type: 'string',
      group: 'introduction',
    }),
    defineField({
      name: 'introContent',
      title: 'Introduction Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  }
                ]
              }
            ]
          }
        }
      ],
      group: 'introduction',
    }),
    defineField({
      name: 'introImage',
      title: 'Introduction Image',
      type: 'image',
      group: 'introduction',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'introImagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'}
        ],
        layout: 'radio',
      },
      group: 'introduction',
    }),
    
    // Benefits Section
    defineField({
      name: 'benefitsTitle',
      title: 'Benefits Section Title',
      type: 'string',
      group: 'benefits',
    }),
    defineField({
      name: 'benefitsSubtitle',
      title: 'Benefits Section Subtitle',
      type: 'text',
      group: 'benefits',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Benefit Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Benefit Description',
              type: 'array',
              of: [{ type: 'block' }]
            },
            {
              name: 'icon',
              title: 'Benefit Icon',
              type: 'image',
              options: { hotspot: true }
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'icon'
            }
          }
        }
      ],
      group: 'benefits',
    }),
    defineField({
      name: 'benefitsBackgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Colored', value: 'colored'}
        ],
        layout: 'radio',
      },
      group: 'benefits',
    }),
    defineField({
      name: 'benefitsBackgroundColor',
      title: 'Background Color (if Colored)',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: 'bg-red-50'},
          {title: 'Gray', value: 'bg-gray-50'},
          {title: 'Blue', value: 'bg-blue-50'},
        ]
      },
      hidden: ({document}) => document?.benefitsBackgroundType !== 'colored',
      group: 'benefits',
    }),
    
    // Process Section
    defineField({
      name: 'processTitle',
      title: 'Process Section Title',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processSubtitle',
      title: 'Process Section Subtitle',
      type: 'text',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
              validation: Rule => Rule.required().positive().integer()
            },
            {
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Step Description',
              type: 'array',
              of: [{ type: 'block' }]
            },
            {
              name: 'icon',
              title: 'Step Icon',
              type: 'image',
              options: { hotspot: true }
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'stepNumber',
              media: 'icon'
            },
            prepare({title, subtitle, media}) {
              return {
                title: `${subtitle}. ${title}`,
                media
              }
            }
          }
        }
      ],
      group: 'process',
    }),
    defineField({
      name: 'processCta',
      title: 'Process CTA Button',
      type: 'object',
      group: 'process',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string',
        }
      ]
    }),
    
    // Valuation Tool Section
    defineField({
      name: 'valuationTitle',
      title: 'Valuation Tool Section Title',
      type: 'string',
      group: 'valuation',
    }),
    defineField({
      name: 'valuationSubtitle',
      title: 'Valuation Tool Section Subtitle',
      type: 'text',
      group: 'valuation',
    }),
    defineField({
      name: 'valuationDescription',
      title: 'Valuation Tool Description',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'valuation',
    }),
    defineField({
      name: 'valuationCta',
      title: 'Valuation Tool CTA Button',
      type: 'object',
      group: 'valuation',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string',
        }
      ]
    }),
    defineField({
      name: 'valuationImage',
      title: 'Valuation Tool Image',
      type: 'image',
      group: 'valuation',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'valuationBackgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Colored', value: 'colored'}
        ],
        layout: 'radio',
      },
      group: 'valuation',
    }),
    defineField({
      name: 'valuationBackgroundColor',
      title: 'Background Color (if Colored)',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: 'bg-red-600'},
          {title: 'Gray', value: 'bg-gray-100'},
          {title: 'Blue', value: 'bg-blue-100'},
        ]
      },
      hidden: ({document}) => document?.valuationBackgroundType !== 'colored',
      group: 'valuation',
    }),
    
    // Testimonials Section
    defineField({
      name: 'testimonialsTitle',
      title: 'Testimonials Section Title',
      type: 'string',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Testimonials Section Subtitle',
      type: 'text',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Customer Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'quote',
              title: 'Testimonial Quote',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'exchangedCar',
              title: 'Car Exchanged',
              type: 'string',
            },
            {
              name: 'purchasedCar',
              title: 'Car Purchased',
              type: 'string',
            },
            {
              name: 'rating',
              title: 'Rating (out of 5)',
              type: 'number',
              validation: Rule => Rule.min(1).max(5)
            },
            {
              name: 'image',
              title: 'Customer Image',
              type: 'image',
              options: { hotspot: true }
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'quote',
              media: 'image'
            }
          }
        }
      ],
      group: 'testimonials',
    }),
    
    // FAQ Section
    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
      group: 'faq',
    }),
    defineField({
      name: 'faqSubtitle',
      title: 'FAQ Section Subtitle',
      type: 'text',
      group: 'faq',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [{ type: 'block' }],
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer'
            }
          }
        }
      ],
      group: 'faq',
    }),
    
    // CTA Section
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaContent',
      title: 'CTA Content',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'object',
      group: 'cta',
      fields: [
        {
          name: 'primary',
          title: 'Primary Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'url', title: 'Button URL', type: 'string' }
          ]
        },
        {
          name: 'secondary',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'url', title: 'Button URL', type: 'string' }
          ]
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'Red', value: 'red' },
              { title: 'Gray', value: 'gray' },
              { title: 'White', value: 'white' }
            ]
          }
        }
      ]
    })
  ]
}) 