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
  title: string;
}

export const servicesPageType = {
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    // SEO & Metadata
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required(),
      initialValue: 'Our Services'
    },
    {
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 3,
      initialValue: 'Explore our range of automotive services including finance, maintenance, MOT, valeting, and more.'
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Title used for search engines and browser tabs',
          initialValue: 'Our Services | ASM Performance Cars'
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines',
          initialValue: 'Explore our range of automotive services including finance, maintenance, MOT, valeting, and more.'
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          description: 'Keywords for search engines',
          initialValue: ['car services', 'automotive services', 'car finance', 'vehicle servicing', 'MOT testing', 'car detailing', 'part exchange']
        },
      ],
    },

    // Hero Section
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'Our Services'
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Comprehensive automotive services to meet all your vehicle needs'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              initialValue: 'Our Services'
            },
          ],
        }
      ],
    },

    // Services Grid Title
    {
      name: 'servicesSection',
      title: 'Services Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Explore Our Services'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'From vehicle financing to maintenance, we provide a complete range of services for your automotive needs.'
        }
      ]
    },

    // Services
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Service Title',
              type: 'string',
              validation: (Rule: SanityRule) => Rule.required()
            },
            {
              name: 'description',
              title: 'Service Description',
              type: 'text',
              rows: 3,
              validation: (Rule: SanityRule) => Rule.required()
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Money/Pound', value: 'BadgePoundSterling' },
                  { title: 'Wrench', value: 'Wrench' },
                  { title: 'Truck', value: 'Truck' },
                  { title: 'Check Circle', value: 'CheckCircle' },
                  { title: 'Sparkles', value: 'Sparkles' },
                  { title: 'Arrows Left-Right', value: 'ArrowLeftRight' },
                  { title: 'Shield Check', value: 'ShieldCheck' },
                  { title: 'Car', value: 'Car' },
                  { title: 'Clipboard', value: 'Clipboard' },
                  { title: 'Star', value: 'Star' },
                  { title: 'Settings', value: 'Settings' }
                ],
              },
              validation: (Rule: SanityRule) => Rule.required()
            },
            {
              name: 'link',
              title: 'Service Page Link',
              type: 'string',
              validation: (Rule: SanityRule) => Rule.required()
            },
            {
              name: 'color',
              title: 'Card Background Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Blue', value: 'bg-blue-50 dark:bg-blue-950' },
                  { title: 'Red', value: 'bg-red-50 dark:bg-red-950' },
                  { title: 'Green', value: 'bg-emerald-50 dark:bg-emerald-950' },
                  { title: 'Purple', value: 'bg-purple-50 dark:bg-purple-950' },
                  { title: 'Amber', value: 'bg-amber-50 dark:bg-amber-950' },
                  { title: 'Indigo', value: 'bg-indigo-50 dark:bg-indigo-950' },
                  { title: 'Violet', value: 'bg-violet-50 dark:bg-violet-950' },
                  { title: 'Teal', value: 'bg-teal-50 dark:bg-teal-950' },
                  { title: 'Pink', value: 'bg-pink-50 dark:bg-pink-950' },
                ],
              },
              validation: (Rule: SanityRule) => Rule.required()
            },
            {
              name: 'iconColor',
              title: 'Icon Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Blue', value: 'text-blue-600 dark:text-blue-400' },
                  { title: 'Red', value: 'text-red-600 dark:text-red-400' },
                  { title: 'Green', value: 'text-emerald-600 dark:text-emerald-400' },
                  { title: 'Purple', value: 'text-purple-600 dark:text-purple-400' },
                  { title: 'Amber', value: 'text-amber-600 dark:text-amber-400' },
                  { title: 'Indigo', value: 'text-indigo-600 dark:text-indigo-400' },
                  { title: 'Violet', value: 'text-violet-600 dark:text-violet-400' },
                  { title: 'Teal', value: 'text-teal-600 dark:text-teal-400' },
                  { title: 'Pink', value: 'text-pink-600 dark:text-pink-400' },
                ],
              },
              validation: (Rule: SanityRule) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description'
            }
          }
        }
      ],
    },

    // CTA Section
    {
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Ready to Experience Our Services?'
        },
        {
          name: 'content',
          title: 'CTA Content',
          type: 'text',
          rows: 3,
          initialValue: 'Contact us today to learn more about how we can help with your automotive needs.'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Contact Us Today'
        },
        {
          name: 'buttonUrl',
          title: 'Button URL',
          type: 'string',
          initialValue: '/contact'
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'Red', value: 'red' },
              { title: 'Blue', value: 'blue' },
              { title: 'Green', value: 'green' },
              { title: 'Purple', value: 'purple' },
              { title: 'Black', value: 'black' },
            ],
          },
          initialValue: 'red'
        }
      ],
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }: PreviewParams) {
      return {
        title: title || 'Services Page',
      }
    }
  }
}

export default servicesPageType 