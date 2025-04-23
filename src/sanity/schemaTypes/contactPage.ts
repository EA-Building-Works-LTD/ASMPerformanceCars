export const contactPageType = {
  name: 'contactPage',
  title: 'Contact Page',
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
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
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
      ],
    },

    // Contact Info Section
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'openingHours',
          title: 'Opening Hours',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'days',
                  title: 'Days',
                  type: 'string',
                  description: 'e.g., Monday - Friday, Saturday, etc.'
                },
                {
                  name: 'hours',
                  title: 'Hours',
                  type: 'string',
                  description: 'e.g., 9:00 AM - 6:00 PM, Closed, etc.'
                }
              ]
            }
          ]
        },
        {
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Twitter', value: 'twitter' },
                      { title: 'YouTube', value: 'youtube' },
                      { title: 'LinkedIn', value: 'linkedin' },
                      { title: 'TikTok', value: 'tiktok' },
                    ],
                  },
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  validation: (Rule: unknown) => Rule.required().uri({
                    scheme: ['http', 'https'],
                  }),
                }
              ]
            }
          ]
        }
      ],
    },

    // Contact Form Section
    {
      name: 'contactForm',
      title: 'Contact Form',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Form Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Form Subtitle',
          type: 'text',
          rows: 2,
        },
        {
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Send Message',
        },
        {
          name: 'successMessage',
          title: 'Success Message',
          type: 'text',
          rows: 2,
          initialValue: 'Thank you for your message! We will get back to you shortly.',
        }
      ],
    },

    // Map Section
    {
      name: 'map',
      title: 'Map',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Map Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Map Subtitle',
          type: 'text',
          rows: 2,
        },
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          description: 'Latitude coordinate for the map marker',
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          description: 'Longitude coordinate for the map marker',
        },
        {
          name: 'zoom',
          title: 'Zoom Level',
          type: 'number',
          initialValue: 15,
          validation: (Rule: unknown) => Rule.min(1).max(20)
        },
        {
          name: 'showDirectionsLink',
          title: 'Show Directions Link',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'directionsLinkText',
          title: 'Directions Link Text',
          type: 'string',
          initialValue: 'Get Directions',
          hidden: ({ parent }: { parent: any }) => !parent?.showDirectionsLink,
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
          title: 'FAQ Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'FAQ Subtitle',
          type: 'text',
          rows: 2,
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
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
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
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
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