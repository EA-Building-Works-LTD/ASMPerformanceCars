import { defineField, defineType } from 'sanity'

export const seoContentType = defineType({
  name: 'seoContent',
  title: 'SEO Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the collapsible SEO content section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      description: 'The page this SEO content is for',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'Modified Cars For Sale', value: 'modified' },
          { title: 'Luxury & Supercars For Sale', value: 'luxury' },
          { title: 'Used Cars For Sale', value: 'used' },
          { title: 'Our Cars', value: 'our-cars' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'Rich text content with formatting support',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      page: 'page',
    },
    prepare(selection) {
      const { title, page } = selection
      return {
        title,
        subtitle: `Page: ${page}`,
      }
    },
  },
}) 