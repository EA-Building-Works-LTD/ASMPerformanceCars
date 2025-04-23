import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'financePage',
  title: 'Car Finance Page',
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
      name: 'financeOptions',
      title: 'Finance Options',
    },
    {
      name: 'process',
      title: 'Finance Process',
    },
    {
      name: 'calculator',
      title: 'Finance Calculator',
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
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
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
    
    // Finance Options Section
    defineField({
      name: 'financeOptionsTitle',
      title: 'Finance Options Title',
      type: 'string',
      group: 'financeOptions',
    }),
    defineField({
      name: 'financeOptionsSubtitle',
      title: 'Finance Options Subtitle',
      type: 'text',
      group: 'financeOptions',
    }),
    defineField({
      name: 'financeOptions',
      title: 'Finance Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Option Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Option Description',
              type: 'array',
              of: [{ type: 'block' }]
            },
            {
              name: 'icon',
              title: 'Option Icon',
              type: 'image',
              options: { hotspot: true }
            },
            {
              name: 'highlights',
              title: 'Key Highlights',
              type: 'array',
              of: [{ type: 'string' }]
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
      group: 'financeOptions',
    }),
    
    // Finance Process Section
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
      title: 'Finance Process Steps',
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
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                ...selection,
                subtitle: `Step ${subtitle}: ${title}`
              }
            }
          }
        }
      ],
      group: 'process',
    }),
    
    // Finance Calculator Settings
    defineField({
      name: 'calculatorTitle',
      title: 'Calculator Section Title',
      type: 'string',
      group: 'calculator',
    }),
    defineField({
      name: 'calculatorSubtitle',
      title: 'Calculator Section Subtitle',
      type: 'text',
      group: 'calculator',
    }),
    defineField({
      name: 'calculatorSettings',
      title: 'Calculator Settings',
      type: 'object',
      group: 'calculator',
      fields: [
        {
          name: 'defaultRate',
          title: 'Default Interest Rate (%)',
          type: 'number',
          validation: Rule => Rule.required().positive()
        },
        {
          name: 'minLoanAmount',
          title: 'Minimum Loan Amount (£)',
          type: 'number',
          validation: Rule => Rule.required().positive()
        },
        {
          name: 'maxLoanAmount',
          title: 'Maximum Loan Amount (£)',
          type: 'number',
          validation: Rule => Rule.required().positive()
        },
        {
          name: 'minTerm',
          title: 'Minimum Loan Term (months)',
          type: 'number',
          validation: Rule => Rule.required().positive().integer()
        },
        {
          name: 'maxTerm',
          title: 'Maximum Loan Term (months)',
          type: 'number',
          validation: Rule => Rule.required().positive().integer()
        },
        {
          name: 'disclaimer',
          title: 'Calculator Disclaimer',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
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
      title: 'Frequently Asked Questions',
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
              title: 'question'
            }
          }
        }
      ],
      group: 'faq',
    }),
    
    // Call to Action Section
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      group: 'cta',
    }),
    defineField({
      name: 'ctaImage',
      title: 'CTA Background Image',
      type: 'image',
      group: 'cta',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      group: 'cta',
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
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: 'Finance Page'
      }
    }
  }
}) 