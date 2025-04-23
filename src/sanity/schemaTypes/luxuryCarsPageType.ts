export const luxuryCarsPageType = {
  name: 'luxuryCarsPage',
  title: 'Luxury Cars Page',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main title displayed in the hero section'
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The description text shown below the hero title'
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Background image for the hero section',
    },
    {
      name: 'cta1Text',
      title: 'Primary CTA Text',
      type: 'string',
      description: 'Text for the primary call-to-action button'
    },
    {
      name: 'cta1Link',
      title: 'Primary CTA Link',
      type: 'string',
      description: 'Link for the primary call-to-action button'
    },
    {
      name: 'cta2Text',
      title: 'Secondary CTA Text',
      type: 'string',
      description: 'Text for the secondary call-to-action button'
    },
    {
      name: 'cta2Link',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'Link for the secondary call-to-action button'
    },

    // USP Section
    {
      name: 'uspSection',
      title: 'USP Section',
      type: 'object',
      fields: [
        {
          name: 'uspTitle1',
          title: 'USP 1 Title',
          type: 'string'
        },
        {
          name: 'uspDescription1',
          title: 'USP 1 Description',
          type: 'text'
        },
        {
          name: 'uspTitle2',
          title: 'USP 2 Title',
          type: 'string'
        },
        {
          name: 'uspDescription2',
          title: 'USP 2 Description',
          type: 'text'
        },
        {
          name: 'uspTitle3',
          title: 'USP 3 Title',
          type: 'string'
        },
        {
          name: 'uspDescription3',
          title: 'USP 3 Description',
          type: 'text'
        }
      ]
    },

    // Inventory Section
    {
      name: 'inventoryTitle',
      title: 'Inventory Section Title',
      type: 'string'
    },
    {
      name: 'inventoryDescription',
      title: 'Inventory Section Description',
      type: 'text'
    },

    // Brands Section
    {
      name: 'brandsTitle',
      title: 'Brands Section Title',
      type: 'string',
      initialValue: 'Prestigious Brands We Offer',
    },
    {
      name: 'brandsDescription',
      title: 'Brands Description',
      type: 'text',
      initialValue: 'We specialise in sourcing and supplying luxury vehicles from the world\'s most prestigious automotive manufacturers.',
    },
    {
      name: 'brandLogos',
      title: 'Brand Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Brand Name',
              type: 'string',
            },
            {
              name: 'logo',
              title: 'Brand Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },

    // Features Section
    {
      name: 'whyChooseTitle',
      title: 'Why Choose Section Title',
      type: 'string'
    },
    {
      name: 'whyChooseDescription',
      title: 'Why Choose Section Description',
      type: 'text'
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
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              options: {
                list: [
                  { title: 'Star', value: 'Star' },
                  { title: 'Settings', value: 'Settings' },
                  { title: 'History', value: 'History' }
                ]
              }
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            }
          ]
        }
      ]
    },

    // Testimonial Section
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text'
        },
        {
          name: 'author',
          title: 'Author Name',
          type: 'string'
        },
        {
          name: 'location',
          title: 'Location',
          type: 'string'
        }
      ]
    },

    // FAQ Section
    {
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string'
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
              type: 'string'
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text'
            }
          ]
        }
      ]
    },

    // CTA Section
    {
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'buttonText',
          title: 'Primary Button Text',
          type: 'string'
        },
        {
          name: 'buttonLink',
          title: 'Primary Button Link',
          type: 'string'
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string'
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button Link',
          type: 'string'
        }
      ]
    },

    // SEO Content
    {
      name: 'seoContent',
      title: 'SEO Content',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
} 