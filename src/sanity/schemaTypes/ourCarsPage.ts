import { defineField, defineType } from 'sanity'

export const ourCarsPageType = defineType({
  name: 'ourCarsPage',
  title: 'Our Cars Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'Link',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule) => Rule.required(),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    // Our Stock Page Specific Fields
    defineField({
      name: 'stockPageTitle',
      title: 'Our Stock Page Title',
      type: 'string',
      description: 'Title for the Our Stock page (inventory page with all vehicles)',
      initialValue: 'Our Stock',
    }),
    defineField({
      name: 'stockPageDescription',
      title: 'Our Stock Page Description',
      type: 'text',
      description: 'Short description for the Our Stock page',
      initialValue: 'Browse our complete inventory of high-performance, luxury, and quality used vehicles. Use the filters below to narrow down your search and find your perfect car.',
    }),
    defineField({
      name: 'stockPageSeo',
      title: 'Our Stock Page SEO',
      type: 'object',
      description: 'SEO settings specifically for the Our Stock page',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          initialValue: 'Our Stock | ASM Performance Cars',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          initialValue: 'Browse our complete inventory of high-performance, luxury, and quality used vehicles. Filter by make, model, price, and more to find your perfect car.',
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'string',
          initialValue: 'car inventory, vehicle stock, performance cars, luxury cars, modified cars, used cars for sale',
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image displayed when sharing the page on social media',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    // Vehicle Categories
    defineField({
      name: 'categories',
      title: 'Vehicle Categories',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'title',
            title: 'Category Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'description',
            title: 'Category Description',
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H3', value: 'h3' },
                  { title: 'H4', value: 'h4' },
                ],
                marks: {
                  decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                  ],
                  annotations: [
                    {
                      title: 'Link',
                      name: 'link',
                      type: 'object',
                      fields: [
                        {
                          title: 'URL',
                          name: 'href',
                          type: 'url',
                          validation: (Rule) => Rule.required(),
                        },
                        {
                          title: 'Open in new tab',
                          name: 'blank',
                          type: 'boolean',
                          initialValue: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'image',
            title: 'Category Image',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'buttonText',
            title: 'Button Text',
            type: 'string',
            initialValue: 'Browse Collection',
          }),
          defineField({
            name: 'href',
            title: 'Link URL',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
              list: [
                { title: 'Modified Cars', value: '/our-cars/modified-cars-for-sale' },
                { title: 'Luxury Cars', value: '/our-cars/luxury-supercars-for-sale' },
                { title: 'Used Cars', value: '/our-cars/used-cars-for-sale' },
              ],
            },
          }),
        ],
      }],
      validation: (Rule) => Rule.required().min(1),
    }),
    // Featured Section
    defineField({
      name: 'featuredSection',
      title: 'Featured Cars Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                ],
                annotations: [
                  {
                    title: 'Link',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                        validation: (Rule) => Rule.required(),
                      },
                      {
                        title: 'Open in new tab',
                        name: 'blank',
                        type: 'boolean',
                        initialValue: true,
                      },
                    ],
                  },
                ],
              },
            },
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    // Stock Page SEO Content
    defineField({
      name: 'stockPageSeoContent',
      title: 'Our Stock Page SEO Content',
      description: 'Content displayed at the bottom of the Stock page for SEO purposes',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Premium Performance & Luxury Vehicles',
        }),
        defineField({
          name: 'content',
          title: 'Section Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                ],
                annotations: [
                  {
                    title: 'Link',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                        validation: (Rule) => Rule.required(),
                      },
                      {
                        title: 'Open in new tab',
                        name: 'blank',
                        type: 'boolean',
                        initialValue: true,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }),
      ],
    }),
    // Contact Section
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'object',
      fields: [
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: "Can't find what you're looking for? Contact us",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 