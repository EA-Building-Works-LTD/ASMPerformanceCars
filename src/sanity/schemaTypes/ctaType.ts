import { defineField, defineType } from 'sanity'

export const ctaType = defineType({
  name: 'callToAction',
  title: 'Call To Action',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main heading for the call to action section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The supporting text below the heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'The background image for the call to action section',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Primary Button Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonIcon',
      title: 'Primary Button Icon',
      type: 'string',
      description: 'Name of the Lucide icon to use (e.g., "Car", "PhoneCall")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      type: 'string',
    }),
    defineField({
      name: 'secondaryButtonIcon',
      title: 'Secondary Button Icon',
      type: 'string',
      description: 'Name of the Lucide icon to use (e.g., "Car", "PhoneCall")',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'value', 
              title: 'Value', 
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            { 
              name: 'label', 
              title: 'Label', 
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this call to action should be displayed on the site',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage',
    },
  },
}) 