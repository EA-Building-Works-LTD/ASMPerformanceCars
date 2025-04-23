import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      description: 'Full name or first name with last initial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City/town of the customer',
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      description: 'The testimonial quote',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating out of 5',
      options: {
        list: [1, 2, 3, 4, 5],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'image',
      title: 'Customer Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional customer photo (with their permission)',
    }),
    defineField({
      name: 'carPurchased',
      title: 'Car Purchased',
      type: 'string',
      description: 'What car did they purchase?',
    }),
    defineField({
      name: 'carImage',
      title: 'Car Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image of the car they purchased',
    }),
    defineField({
      name: 'purchaseDate',
      title: 'Purchase Date',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature this testimonial on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Modified Cars', value: 'modified' },
              { title: 'Luxury Cars', value: 'luxury' },
              { title: 'Used Cars', value: 'used' },
              { title: 'Customer Service', value: 'service' },
              { title: 'Finance', value: 'finance' },
            ],
          },
        },
      ],
      description: 'What aspects of our service does this testimonial highlight?',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Google Review', value: 'google' },
          { title: 'Facebook Review', value: 'facebook' },
          { title: 'Direct Email', value: 'email' },
          { title: 'Website Form', value: 'website' },
          { title: 'Other', value: 'other' },
        ],
      },
      description: 'Source of this testimonial',
    }),
    defineField({
      name: 'sourceLink',
      title: 'Source Link',
      type: 'url',
      description: 'Link to the original review if available online',
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
      media: 'image',
      rating: 'rating',
      testimonial: 'testimonial',
    },
    prepare({ title, media, rating, testimonial }) {
      return {
        title,
        media,
        subtitle: `${rating} ★ | ${testimonial?.substring(0, 50)}${testimonial?.length > 50 ? '...' : ''}`,
      }
    },
  },
}) 