import { defineField, defineType } from 'sanity'

export const motCheckToolType = defineType({
  name: 'motCheckTool',
  title: 'MOT Check Tool',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title for the MOT check tool section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional descriptive subtitle',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Detailed explanation of the MOT check tool',
    }),
    defineField({
      name: 'placeholderText',
      title: 'Placeholder Text',
      type: 'string',
      description: 'Text to display in the search input field',
      initialValue: 'Enter vehicle registration...',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the search button',
      initialValue: 'Check MOT History',
    }),
    defineField({
      name: 'apiEndpoint',
      title: 'API Endpoint',
      type: 'string',
      description: 'URL for the MOT check API (will be used server-side only)',
    }),
    defineField({
      name: 'apiKey',
      title: 'API Key',
      type: 'string',
      description: 'API key for the MOT check service (will be used server-side only)',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image to display alongside the MOT check tool',
    }),
    defineField({
      name: 'benefitPoints',
      title: 'Benefit Points',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of benefits for using the MOT check tool',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Title for search engine results',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for search engine results',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Enable or disable the MOT check tool',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
    },
    prepare({ title, active }) {
      return {
        title: `MOT Check Tool: ${title}`,
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
}) 