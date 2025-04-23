import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'usedCarsPage',
  title: 'Used Cars Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main heading for the used cars page (supports HTML)',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The subtitle text that appears below the hero title',
    }),
    defineField({
      name: 'cta1Text',
      title: 'CTA 1 Button Text',
      type: 'string',
      description: 'Text for the first call-to-action button',
    }),
    defineField({
      name: 'cta1Link',
      title: 'CTA 1 Button Link',
      type: 'string',
      description: 'Link for the first call-to-action button (e.g., "#used-inventory")',
    }),
    defineField({
      name: 'cta2Text',
      title: 'CTA 2 Button Text',
      type: 'string',
      description: 'Text for the second call-to-action button',
    }),
    defineField({
      name: 'cta2Link',
      title: 'CTA 2 Button Link',
      type: 'string',
      description: 'Link for the second call-to-action button (e.g., "/contact")',
    }),
    defineField({
      name: 'uspSection',
      title: 'USP Section',
      type: 'object',
      fields: [
        { name: 'uspTitle1', title: 'USP 1 Title', type: 'string' },
        { name: 'uspDescription1', title: 'USP 1 Description', type: 'text' },
        { name: 'uspTitle2', title: 'USP 2 Title', type: 'string' },
        { name: 'uspDescription2', title: 'USP 2 Description', type: 'text' },
        { name: 'uspTitle3', title: 'USP 3 Title', type: 'string' },
        { name: 'uspDescription3', title: 'USP 3 Description', type: 'text' },
      ],
    }),
    defineField({
      name: 'inventoryTitle',
      title: 'Inventory Section Title',
      type: 'string',
      description: 'The heading for the current inventory section',
    }),
    defineField({
      name: 'inventoryDescription',
      title: 'Inventory Section Description',
      type: 'text',
      description: 'The description text for the current inventory section',
    }),
    defineField({
      name: 'benefitsTitle',
      title: 'Benefits Section Title',
      type: 'string',
      description: 'The heading for the benefits of buying used cars section',
    }),
    defineField({
      name: 'benefitsDescription',
      title: 'Benefits Section Description',
      type: 'text',
      description: 'The description text for the benefits section',
    }),
    defineField({
      name: 'benefitItems',
      title: 'Benefit Items',
      type: 'array',
      description: 'List of benefits of buying used cars',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { 
              name: 'icon', 
              title: 'Icon', 
              type: 'string',
              description: 'Icon name from Lucide icons (e.g., "Check", "Pound", "Car")',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'popularMakesTitle',
      title: 'Popular Makes Section Title',
      type: 'string',
      description: 'The heading for the popular makes section',
    }),
    defineField({
      name: 'popularMakesDescription',
      title: 'Popular Makes Section Description',
      type: 'text',
      description: 'The description text for the popular makes section',
    }),
    defineField({
      name: 'popularMakes',
      title: 'Popular Makes',
      type: 'array',
      description: 'List of popular car makes we offer',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Make Name', type: 'string' },
            { 
              name: 'logo', 
              title: 'Make Logo', 
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'whyChooseTitle',
      title: 'Why Choose Section Title',
      type: 'string',
      description: 'The heading for the "Why Choose" section',
    }),
    defineField({
      name: 'whyChooseDescription',
      title: 'Why Choose Section Description',
      type: 'text',
      description: 'The description text for the "Why Choose" section',
    }),
    defineField({
      name: 'featureItems',
      title: 'Feature Items',
      type: 'array',
      description: 'List of features/services that set your used cars apart',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { 
              name: 'icon', 
              title: 'Icon', 
              type: 'string',
              description: 'Icon name from Lucide icons (e.g., "Check", "Shield", "Award")',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Testimonial Quote', type: 'text' },
        { name: 'author', title: 'Author Name', type: 'string' },
        { name: 'location', title: 'Author Location', type: 'string' },
      ],
    }),
    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
      description: 'The heading for the FAQ section',
    }),
    defineField({
      name: 'faqSection',
      title: 'FAQ Items',
      type: 'array',
      description: 'List of frequently asked questions about used cars',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'buttonText', title: 'Primary Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Primary Button Link', type: 'string' },
        { name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string' },
        { name: 'secondaryButtonLink', title: 'Secondary Button Link', type: 'string' },
      ],
    }),
    defineField({
      name: 'seoContent',
      title: 'SEO Content',
      type: 'array',
      description: 'Rich text content for SEO purposes',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || 'Used Cars Page',
      }
    },
  },
}) 