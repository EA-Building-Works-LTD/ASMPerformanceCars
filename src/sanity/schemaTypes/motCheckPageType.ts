import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'motCheckPage',
  title: 'MOT Check Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'whatIsMotTitle',
      title: 'What is an MOT Section Title',
      type: 'string',
      initialValue: 'What is an MOT?',
    }),
    defineField({
      name: 'whatIsMotContent',
      title: 'What is an MOT Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'whatIsMotImage',
      title: 'What is MOT Section Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'reportIncludesTitle',
      title: 'Report Includes Section Title',
      type: 'string',
      initialValue: 'What does a FREE MOT history Report include?',
    }),
    defineField({
      name: 'reportIncludesItems',
      title: 'Report Includes Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Item Text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'reportIncludesImage',
      title: 'Report Includes Section Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'whyFailTitle',
      title: 'Why Fail Section Title',
      type: 'string',
      initialValue: 'Why would a car fail its MOT?',
    }),
    defineField({
      name: 'whyFailContent',
      title: 'Why Fail Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'whyFailImage',
      title: 'Why Fail Section Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'howHelpfulTitle',
      title: 'How Helpful Section Title',
      type: 'string',
      initialValue: 'How is MOT history helpful?',
    }),
    defineField({
      name: 'howHelpfulContent',
      title: 'How Helpful Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'dvlaCheckTitle',
      title: 'DVLA Check Section Title',
      type: 'string',
      initialValue: 'Can you check a car\'s MOT history through DVLA?',
    }),
    defineField({
      name: 'dvlaCheckContent',
      title: 'DVLA Check Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'array', of: [{ type: 'block' }], title: 'Answer' },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Call to Action Title',
      type: 'string',
      initialValue: 'Check Your Vehicle\'s MOT History Today',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'Call to Action Subtitle',
      type: 'string',
      initialValue: 'Get instant access to comprehensive MOT history, advisory notes, and more',
    }),
  ],
}) 