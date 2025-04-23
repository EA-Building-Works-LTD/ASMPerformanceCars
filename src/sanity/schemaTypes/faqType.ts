import { defineField, defineType } from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'question',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Modified Cars', value: 'modified-cars' },
          { title: 'Car Finance', value: 'car-finance' },
          { title: 'MOT Checks', value: 'mot-checks' },
          { title: 'Buying Guides', value: 'buying-guides' },
          { title: 'Cat N/S Vehicles', value: 'cat-vehicles' },
          { title: 'General', value: 'general' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order in which to display this FAQ within its category (lower numbers appear first)',
      initialValue: 1,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature this FAQ on the homepage or other prominent locations',
      initialValue: false,
    }),
    defineField({
      name: 'relatedFaqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'faq' } }],
      description: 'Other FAQs that relate to this question',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Keywords related to this FAQ for SEO purposes',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Brief description for search engine results',
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
    },
    prepare({ title, category }) {
      const categoryMap: Record<string, string> = {
        'modified-cars': 'Modified Cars',
        'car-finance': 'Car Finance',
        'mot-checks': 'MOT Checks',
        'buying-guides': 'Buying Guides',
        'cat-vehicles': 'Cat N/S Vehicles',
        'general': 'General',
      }
      
      return {
        title: title,
        subtitle: category ? (categoryMap[category] || category) : '',
      }
    },
  },
}) 