// Define type for Sanity validation rules
interface SanityRule {
  required: () => SanityRule;
  min: (min: number) => SanityRule;
  max: (max: number) => SanityRule;
  warning: (message: string) => SanityRule;
  error: (message: string) => SanityRule;
}

// Define type for preview prepare function params
interface PreviewParams {
  title?: string;
}

export default {
  name: 'luxuryCarsPage',
  title: 'Luxury Cars Page',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the luxury cars page',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'Introductory text for the luxury cars page',
      validation: (Rule: SanityRule) => Rule.required(),
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
      description: 'Text for the primary call-to-action button',
      initialValue: 'View Luxury Collection',
    },
    {
      name: 'cta1Link',
      title: 'Primary CTA Link',
      type: 'string',
      description: 'Link for the primary call-to-action button',
      initialValue: '#luxury-inventory',
    },
    {
      name: 'cta2Text',
      title: 'Secondary CTA Text',
      type: 'string',
      description: 'Text for the secondary call-to-action button',
      initialValue: 'Enquire About a Car',
    },
    {
      name: 'cta2Link',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'Link for the secondary call-to-action button',
      initialValue: '/contact',
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
          type: 'string',
          initialValue: 'Exceptional Quality',
        },
        {
          name: 'uspDescription1',
          title: 'USP 1 Description',
          type: 'text',
          initialValue: 'Our luxury cars undergo rigorous inspection and preparation to ensure they meet the highest standards of quality and performance.',
        },
        {
          name: 'uspTitle2',
          title: 'USP 2 Title',
          type: 'string',
          initialValue: 'Verified History',
        },
        {
          name: 'uspDescription2',
          title: 'USP 2 Description',
          type: 'text',
          initialValue: 'Every luxury vehicle comes with comprehensive documentation, including service history, ownership records, and thorough inspection reports.',
        },
        {
          name: 'uspTitle3',
          title: 'USP 3 Title',
          type: 'string',
          initialValue: 'Bespoke Service',
        },
        {
          name: 'uspDescription3',
          title: 'USP 3 Description',
          type: 'text',
          initialValue: 'Experience our personalised approach to luxury car buying, with tailored financing options and dedicated aftercare support.',
        },
      ],
    },

    // Inventory Section
    {
      name: 'inventoryTitle',
      title: 'Inventory Section Title',
      type: 'string',
      initialValue: 'Current Luxury Cars For Sale',
    },
    {
      name: 'inventoryDescription',
      title: 'Inventory Description',
      type: 'text',
      initialValue: 'Browse our latest collection of premium luxury vehicles and supercars available for immediate purchase. Our carefully curated inventory features prestigious brands known for their exceptional craftsmanship and performance.',
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
      type: 'string',
      initialValue: 'Why Choose Our Luxury Cars',
    },
    {
      name: 'whyChooseDescription',
      title: 'Why Choose Description',
      type: 'text',
      initialValue: 'At ASM Performance Cars, we bring years of expertise in the luxury automotive market to ensure your car buying experience is exceptional from start to finish.',
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
              title: 'Feature Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Feature Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Zap (Performance)', value: 'Zap' },
                  { title: 'Shield (Security)', value: 'Shield' },
                  { title: 'Star (Quality)', value: 'Star' },
                  { title: 'Clock (History)', value: 'Clock' },
                  { title: 'Settings (Service)', value: 'Settings' },
                  { title: 'Award (Excellence)', value: 'Award' },
                ],
              },
            },
          ],
        },
      ],
    },

    // Testimonial Section
    {
      name: 'testimonial',
      title: 'Featured Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Testimonial Quote',
          type: 'text',
        },
        {
          name: 'author',
          title: 'Author Name',
          type: 'string',
        },
        {
          name: 'location',
          title: 'Author Location',
          type: 'string',
        },
      ],
    },

    // FAQ Section
    {
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
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

    // CTA Section
    {
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Ready to Experience Automotive Excellence?',
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          initialValue: 'Whether you\'re looking to purchase a luxury car or enquire about our exclusive sourcing service, our team of specialists is here to assist you.',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Contact Our Specialists',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/contact',
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          initialValue: 'Browse Luxury Collection',
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button Link',
          type: 'string',
          initialValue: '#luxury-inventory',
        },
      ],
    },

    // SEO Content
    {
      name: 'seoContent',
      title: 'SEO Content',
      description: 'Rich text content for SEO purposes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }: PreviewParams) {
      return {
        title: title || 'Luxury Cars Page',
      };
    },
  },
} 