export default {
  name: 'modifiedCarsPage',
  title: 'Modified Cars Page',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main title for the hero section (supports HTML tags)',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The description text below the hero title',
    },
    {
      name: 'cta1Text',
      title: 'CTA 1 Text',
      type: 'string',
      description: 'Text for the first call-to-action button',
    },
    {
      name: 'cta1Link',
      title: 'CTA 1 Link',
      type: 'string',
      description: 'Link for the first call-to-action button (e.g., "/contact")',
    },
    {
      name: 'cta2Text',
      title: 'CTA 2 Text',
      type: 'string',
      description: 'Text for the second call-to-action button',
    },
    {
      name: 'cta2Link',
      title: 'CTA 2 Link',
      type: 'string',
      description: 'Link for the second call-to-action button (e.g., "#current-inventory")',
    },
    {
      name: 'uspSection',
      title: 'USP Section',
      type: 'object',
      fields: [
        {
          name: 'uspTitle1',
          title: 'USP 1 Title',
          type: 'string',
        },
        {
          name: 'uspDescription1',
          title: 'USP 1 Description',
          type: 'text',
        },
        {
          name: 'uspTitle2',
          title: 'USP 2 Title',
          type: 'string',
        },
        {
          name: 'uspDescription2',
          title: 'USP 2 Description',
          type: 'text',
        },
        {
          name: 'uspTitle3',
          title: 'USP 3 Title',
          type: 'string',
        },
        {
          name: 'uspDescription3',
          title: 'USP 3 Description',
          type: 'text',
        },
      ],
    },
    {
      name: 'inventoryTitle',
      title: 'Inventory Section Title',
      type: 'string',
    },
    {
      name: 'inventoryDescription',
      title: 'Inventory Description',
      type: 'text',
    },
    {
      name: 'whyChooseTitle',
      title: 'Why Choose Us Title',
      type: 'string',
    },
    {
      name: 'whyChooseDescription',
      title: 'Why Choose Us Description',
      type: 'text',
    },
    {
      name: 'featureItems',
      title: 'Feature Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (e.g., "Zap", "Settings", "Gauge")',
            },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
        },
        {
          name: 'author',
          title: 'Author',
          type: 'string',
        },
        {
          name: 'location',
          title: 'Location',
          type: 'string',
        },
      ],
    },
    {
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
    },
    {
      name: 'faqSection',
      title: 'FAQ Items',
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
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button Link',
          type: 'string',
        },
      ],
    },
    {
      name: 'seoContent',
      title: 'SEO Content',
      type: 'blockContent',
      description: 'Content for SEO purposes (shown in dropdown)',
    },
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }: { title?: string }) {
      return {
        title: 'Modified Cars Page',
        subtitle: title || 'Modified Cars Page Content',
      }
    },
  },
} 