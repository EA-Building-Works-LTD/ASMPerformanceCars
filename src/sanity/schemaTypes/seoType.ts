import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title used for search engines and browser tabs (50-60 characters recommended)',
      validation: Rule => Rule.max(70).warning('Longer titles may be truncated by search engines')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Description for search engines (150-160 characters recommended)',
      validation: Rule => Rule.max(180).warning('Longer descriptions may be truncated by search engines')
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image shown when sharing on social media (1200x630 pixels recommended)',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The preferred URL for this page (optional)'
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords relevant to this content (less important for SEO nowadays, but still useful)'
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      description: 'Main keyword or phrase for this page'
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Instruct search engines not to index this page',
      initialValue: false
    }),
    defineField({
      name: 'altText',
      title: 'Default Image Alt Text',
      type: 'string',
      description: 'Alternative text for the main image (for accessibility and SEO)'
    })
  ],
  preview: {
    select: {
      title: 'metaTitle',
      subtitle: 'metaDescription'
    }
  }
}) 