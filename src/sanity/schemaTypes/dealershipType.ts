import { defineField, defineType } from 'sanity'

export const dealershipType = defineType({
  name: 'dealership',
  title: 'Car Dealership',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Dealership Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Full description of the dealership',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief overview for use in cards and listings (max 200 chars)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Luxury Cars', value: 'luxury' },
          { title: 'Modified Cars', value: 'modified' },
          { title: 'Sports Cars', value: 'sports' },
          { title: 'Used Cars', value: 'used' },
          { title: 'Finance', value: 'finance' },
          { title: 'Part Exchange', value: 'part-exchange' },
          { title: 'Servicing', value: 'servicing' },
          { title: 'Warranty', value: 'warranty' },
        ],
      },
    }),
    defineField({
      name: 'founded',
      title: 'Year Founded',
      type: 'number',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'website',
          title: 'Website',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'postcode',
          title: 'Postcode',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          description: 'For map display',
        }),
        defineField({
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          description: 'For map display',
        }),
        defineField({
          name: 'directions',
          title: 'Directions',
          type: 'text',
          description: 'Directions or parking information',
        }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  { title: 'Monday', value: 'monday' },
                  { title: 'Tuesday', value: 'tuesday' },
                  { title: 'Wednesday', value: 'wednesday' },
                  { title: 'Thursday', value: 'thursday' },
                  { title: 'Friday', value: 'friday' },
                  { title: 'Saturday', value: 'saturday' },
                  { title: 'Sunday', value: 'sunday' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'open',
              title: 'Opening Time',
              type: 'string',
              description: 'Format: HH:MM (e.g., 09:00)',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'close',
              title: 'Closing Time',
              type: 'string',
              description: 'Format: HH:MM (e.g., 17:30)',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              day: 'day',
              open: 'open',
              close: 'close',
              closed: 'closed',
            },
            prepare({ day, open, close, closed }) {
              return {
                title: day.charAt(0).toUpperCase() + day.slice(1),
                subtitle: closed ? 'Closed' : `${open} - ${close}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Override the default page title for SEO purposes',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          description: 'Brief description for search engine results',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Keywords related to this dealership',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Dealership',
      type: 'boolean',
      description: 'Feature this dealership on the directory homepage',
      initialValue: false,
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
      title: 'name',
      media: 'logo',
      city: 'location.city',
    },
    prepare({ title, media, city }) {
      return {
        title,
        media,
        subtitle: city ? `${city}` : '',
      }
    },
  },
}) 