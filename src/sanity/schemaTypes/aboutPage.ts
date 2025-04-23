import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
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
      name: 'story',
      title: 'Our Story',
    },
    {
      name: 'values',
      title: 'Our Values',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
    },
    {
      name: 'cta',
      title: 'Call to Action',
    }
  ],
  fields: [
    // SEO & Metadata
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
      rows: 3,
      validation: Rule => Rule.max(160).warning('SEO descriptions work best when under 160 characters')
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      options: { layout: 'tags' }
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
      rows: 2
    }),
    defineField({
      name: 'heroBackgroundType',
      title: 'Background Type',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Solid Color', value: 'color'}
        ],
        layout: 'radio',
      },
      initialValue: 'image'
    }),
    defineField({
      name: 'heroBackgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Red', value: 'bg-red-600'},
          {title: 'Gray', value: 'bg-gray-900'},
          {title: 'Dark Blue', value: 'bg-blue-900'},
        ]
      },
      hidden: ({document}) => document?.heroBackgroundType !== 'color'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: {
        hotspot: true,
      },
      hidden: ({document}) => document?.heroBackgroundType !== 'image',
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
      group: 'introduction'
    }),
    defineField({
      name: 'introContent',
      title: 'Introduction Content',
      type: 'array',
      group: 'introduction',
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
      ]
    }),
    defineField({
      name: 'introImage',
      title: 'Introduction Image',
      type: 'image',
      group: 'introduction',
      options: { hotspot: true },
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
      group: 'introduction',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right'
    }),

    // Our Story Section
    defineField({
      name: 'storyTitle',
      title: 'Story Section Title',
      type: 'string',
      group: 'story'
    }),
    defineField({
      name: 'storySubtitle',
      title: 'Story Section Subtitle',
      type: 'text',
      group: 'story',
      rows: 2
    }),
    defineField({
      name: 'storyContent',
      title: 'Story Content',
      type: 'array',
      group: 'story',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'milestones',
      title: 'Milestones',
      type: 'array',
      group: 'story',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'title',
              title: 'Milestone Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Milestone Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'image',
              title: 'Milestone Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }
              ]
            }
          ]
        }
      ]
    }),

    // Values Section
    defineField({
      name: 'valuesTitle',
      title: 'Values Section Title',
      type: 'string',
      group: 'values'
    }),
    defineField({
      name: 'valuesSubtitle',
      title: 'Values Section Subtitle',
      type: 'text',
      group: 'values',
      rows: 2
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      group: 'values',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Value Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Value Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Icon name from Lucide Icons (e.g., heart, shield, star)'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'valuesBackgroundColor',
      title: 'Values Background Color',
      type: 'string',
      group: 'values',
      options: {
        list: [
          {title: 'Light Gray', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Light Blue', value: 'bg-blue-50'}
        ]
      },
      initialValue: 'bg-gray-100'
    }),

    // Testimonials Section
    defineField({
      name: 'testimonialsTitle',
      title: 'Testimonials Section Title',
      type: 'string',
      group: 'testimonials'
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Testimonials Section Subtitle',
      type: 'text',
      group: 'testimonials',
      rows: 2
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      of: [
        {
          type: 'reference',
          to: [{type: 'testimonial'}]
        }
      ]
    }),

    // CTA Section
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta'
    }),
    defineField({
      name: 'ctaContent',
      title: 'CTA Content',
      type: 'array',
      group: 'cta',
      of: [{ type: 'block' }]
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
          type: 'string'
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'ctaSecondaryButton',
      title: 'Secondary Button',
      type: 'object',
      group: 'cta',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'ctaBackgroundColor',
      title: 'CTA Background Color',
      type: 'string',
      group: 'cta',
      options: {
        list: [
          {title: 'Red', value: 'red'},
          {title: 'Gray', value: 'gray'},
          {title: 'White', value: 'white'}
        ]
      },
      initialValue: 'red'
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({title}) {
      return {
        title: title || 'About Page',
      }
    },
  },
}) 