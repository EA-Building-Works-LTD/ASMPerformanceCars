export const carDetailingPageType = {
  name: 'carDetailingPage',
  title: 'Car Detailing Page',
  type: 'document',
  fields: [
    // SEO & Metadata
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule: unknown) => Rule.required()
    },
    {
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Title used for search engines and browser tabs',
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          description: 'Keywords for search engines',
          initialValue: ['car detailing', 'car detailing birmingham', 'car wash', 'car valet', 'hand car wash near me']
        },
      ],
    },

    // Hero Section
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'Professional Car Detailing Services'
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Premium car detailing and valeting services in Birmingham and surrounding areas'
        },
        {
          name: 'backgroundType',
          title: 'Background Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Color', value: 'color' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Use Tailwind CSS color classes (e.g., bg-red-600)',
          hidden: ({ parent }: { parent: any }) => parent?.backgroundType !== 'color',
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }: { parent: any }) => parent?.backgroundType !== 'image',
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'Book a Detailing Service'
        },
        {
          name: 'ctaUrl',
          title: 'CTA Button URL',
          type: 'string',
          initialValue: '/contact'
        }
      ],
    },

    // Introduction Section
    {
      name: 'introduction',
      title: 'Introduction Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Expert Car Detailing Services'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }],
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'imagePosition',
          title: 'Image Position',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Right', value: 'right' },
            ],
            layout: 'radio',
          },
          initialValue: 'right',
        }
      ],
    },

    // Services/Benefits Section
    {
      name: 'benefits',
      title: 'Benefits & Features',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Choose Our Detailing Services?'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'We provide exceptional car detailing with attention to every detail'
        },
        {
          name: 'items',
          title: 'Benefits',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Shield', value: 'shield' },
                      { title: 'Sparkles', value: 'sparkles' },
                      { title: 'Clock', value: 'clock' },
                      { title: 'Brush', value: 'brush' },
                      { title: 'Check', value: 'check' },
                      { title: 'Car', value: 'car' },
                      { title: 'Star', value: 'star' },
                      { title: 'Drop', value: 'drop' },
                      { title: 'Spray', value: 'spray' },
                      { title: 'Pound', value: 'pound' },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'backgroundType',
          title: 'Background Type',
          type: 'string',
          options: {
            list: [
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' },
              { title: 'Colored', value: 'colored' },
            ],
            layout: 'radio',
          },
          initialValue: 'light',
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Use Tailwind CSS color classes (e.g., bg-red-600)',
          hidden: ({ parent }: { parent: any }) => parent?.backgroundType !== 'colored',
        },
      ],
    },

    // Process Section
    {
      name: 'process',
      title: 'Detailing Process',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Car Detailing Process'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'A meticulous approach to car detailing that delivers exceptional results'
        },
        {
          name: 'steps',
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
                },
                {
                  name: 'title',
                  title: 'Step Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Step Description',
                  type: 'text',
                  rows: 3,
                },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Brush', value: 'brush' },
                      { title: 'Spray', value: 'spray' },
                      { title: 'Drop', value: 'drop' },
                      { title: 'Sparkles', value: 'sparkles' },
                      { title: 'Car', value: 'car' },
                      { title: 'Shield', value: 'shield' },
                      { title: 'Check', value: 'check' },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'Book a Detailing Service'
        },
        {
          name: 'ctaUrl',
          title: 'CTA Button URL',
          type: 'string',
          initialValue: '/contact'
        },
      ],
    },

    // Services Grid (Types of detailing services)
    {
      name: 'services',
      title: 'Detailing Services',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Detailing Services'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'We offer a range of professional detailing services for all vehicle types'
        },
        {
          name: 'items',
          title: 'Service Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Service Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Service Description',
                  type: 'text',
                  rows: 3,
                },
                {
                  name: 'image',
                  title: 'Service Image',
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                    },
                  ],
                }
              ],
            },
          ],
        },
      ],
    },

    // Testimonials Section
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'What Our Customers Say'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Read what clients have to say about our car detailing services'
        },
        {
          name: 'items',
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
                },
                {
                  name: 'quote',
                  title: 'Quote',
                  type: 'text',
                  rows: 4,
                },
                {
                  name: 'carModel',
                  title: 'Car Model',
                  type: 'string',
                },
                {
                  name: 'location',
                  title: 'Location',
                  type: 'string',
                },
                {
                  name: 'rating',
                  title: 'Rating (1-5)',
                  type: 'number',
                  validation: (Rule: unknown) => Rule.min(1).max(5),
                },
                {
                  name: 'image',
                  title: 'Customer Image',
                  type: 'image',
                  options: { hotspot: true },
                },
              ],
            },
          ],
        },
      ],
    },

    // FAQ Section
    {
      name: 'faq',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Frequently Asked Questions'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Find answers to common questions about our car detailing services'
        },
        {
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
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'array',
                  of: [{ type: 'block' }],
                },
              ],
            },
          ],
        },
      ],
    },

    // SEO Content (Hidden section for SEO)
    {
      name: 'seoContent',
      title: 'SEO Content',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable SEO Content Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'SEO Section Title',
          type: 'string',
          initialValue: 'Professional Car Detailing Services in Birmingham',
          hidden: ({ parent }: { parent: any }) => !parent?.enabled,
        },
        {
          name: 'content',
          title: 'SEO Content',
          type: 'array',
          of: [{ type: 'block' }],
          hidden: ({ parent }: { parent: any }) => !parent?.enabled,
        },
      ],
    },

    // CTA Section
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Ready to Transform Your Vehicle?'
        },
        {
          name: 'content',
          title: 'CTA Content',
          type: 'array',
          of: [{ type: 'block' }],
        },
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Book Now'
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
              initialValue: '/contact'
            },
          ],
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Our Services'
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
              initialValue: '#services'
            },
          ],
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          initialValue: 'bg-red-600',
          description: 'Use Tailwind CSS color classes (e.g., bg-red-600)',
        },
      ],
    },
  ],
}

export default carDetailingPageType; 