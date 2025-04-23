export const carTransportationPageType = {
  name: 'carTransportationPage',
  title: 'Car Transportation Page',
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
          initialValue: ['car transporter', 'car delivery service', 'car delivery', 'car transportation', 'car transport']
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
          initialValue: 'Professional Car Transportation Services'
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Safe, secure and reliable vehicle transportation across the UK'
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
          initialValue: 'Get a Quote'
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
          initialValue: 'Expert Car Transportation Services'
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
      title: 'Services & Benefits',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Choose Our Transportation Services?'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'We provide exceptional vehicle transportation with complete peace of mind'
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
                      { title: 'Truck', value: 'truck' },
                      { title: 'Clock', value: 'clock' },
                      { title: 'Map', value: 'map' },
                      { title: 'Check', value: 'check' },
                      { title: 'Car', value: 'car' },
                      { title: 'Star', value: 'star' },
                      { title: 'Key', value: 'key' },
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
      title: 'Transportation Process',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Car Transportation Process'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'A simple, seamless process from booking to delivery'
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
                      { title: 'Phone', value: 'phone' },
                      { title: 'Calendar', value: 'calendar' },
                      { title: 'Truck', value: 'truck' },
                      { title: 'Clipboard', value: 'clipboard' },
                      { title: 'Check', value: 'check' },
                      { title: 'Key', value: 'key' },
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
          initialValue: 'Book Transportation'
        },
        {
          name: 'ctaUrl',
          title: 'CTA Button URL',
          type: 'string',
          initialValue: '/contact'
        },
      ],
    },

    // Services Grid (Types of transportation)
    {
      name: 'services',
      title: 'Transportation Services',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Transportation Services'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'We offer a range of transportation solutions for your vehicle'
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
          initialValue: 'Read what clients have to say about our car transportation services'
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
                  name: 'transportedCar',
                  title: 'Transported Car',
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
          initialValue: 'Find answers to common questions about our car transportation services'
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
          initialValue: 'Professional Car Transportation Services',
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
          initialValue: 'Ready to Transport Your Vehicle?'
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
              initialValue: 'Get a Quote'
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
              initialValue: 'Learn More'
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
              initialValue: '#process'
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

export default carTransportationPageType; 