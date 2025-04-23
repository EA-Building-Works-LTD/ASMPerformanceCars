import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'consignmentPage',
  title: 'Consignment Car Sales Page',
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
      title: 'Consignment Process',
    },
    {
      name: 'comparison',
      title: 'Comparison With Other Methods',
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
      initialValue: ['consignment car sales', 'sale or return', 'SOR', 'consignment sales']
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
              of: [{type: 'block'}],
              validation: Rule => Rule.required()
            },
            {
              name: 'icon',
              title: 'Benefit Icon',
              type: 'image',
              options: {
                hotspot: true,
              }
            },
          ]
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
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: 'red'},
          {title: 'Gray', value: 'gray'},
          {title: 'Blue', value: 'blue'}
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
              of: [{type: 'block'}],
              validation: Rule => Rule.required()
            },
            {
              name: 'icon',
              title: 'Step Icon',
              type: 'image',
              options: {
                hotspot: true,
              }
            },
          ]
        }
      ],
      group: 'process',
    }),
    defineField({
      name: 'processCta',
      title: 'Process Call to Action',
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
    
    // Comparison Section
    defineField({
      name: 'comparisonTitle',
      title: 'Comparison Section Title',
      type: 'string',
      group: 'comparison',
    }),
    defineField({
      name: 'comparisonSubtitle',
      title: 'Comparison Section Subtitle',
      type: 'text',
      group: 'comparison',
    }),
    defineField({
      name: 'comparisonMethods',
      title: 'Comparison Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'method',
              title: 'Method Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'pros',
              title: 'Advantages',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'cons',
              title: 'Disadvantages',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'description',
              title: 'Method Description',
              type: 'array',
              of: [{type: 'block'}],
            },
          ]
        }
      ],
      group: 'comparison',
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
          type: 'reference',
          to: [{type: 'testimonial'}]
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
              of: [{type: 'block'}],
              validation: Rule => Rule.required()
            }
          ]
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
      of: [{type: 'block'}],
      group: 'cta',
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
    defineField({
      name: 'ctaBackgroundColor',
      title: 'CTA Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: 'red'},
          {title: 'Gray', value: 'gray'},
          {title: 'White', value: 'white'}
        ]
      },
      group: 'cta',
    }),
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({title}) {
      return {
        title: title || 'Consignment Car Sales Page',
      }
    },
  },
}) 