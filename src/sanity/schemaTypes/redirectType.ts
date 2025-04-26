import { defineField, defineType } from 'sanity'

export const redirectType = defineType({
  name: 'redirect',
  title: 'URL Redirects',
  type: 'document',
  fields: [
    defineField({
      name: 'source',
      title: 'Source Path',
      type: 'string',
      description: 'The source URL path to redirect from (e.g., /old-page)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination URL',
      type: 'string',
      description: 'The destination URL to redirect to (e.g., /new-page or https://example.com)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent Redirect',
      type: 'boolean',
      description: 'Whether this is a permanent (301) redirect or a temporary (302) redirect',
      initialValue: true,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Enable or disable this redirect',
      initialValue: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Optional notes about this redirect (for internal use)',
    }),
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
    },
    prepare({ source, destination, permanent }) {
      return {
        title: `${source} → ${destination}`,
        subtitle: permanent ? '301 Permanent' : '302 Temporary',
      }
    },
  },
}) 