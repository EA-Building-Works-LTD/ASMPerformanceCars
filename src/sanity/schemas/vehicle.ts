export default {
  name: 'vehicle',
  title: 'Used Car',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: unknown) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: unknown) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: unknown) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: unknown) => Rule.required().min(0),
    },
    {
      name: 'priceOnApplication',
      title: 'Price on Application',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'featured',
      title: 'Featured Vehicle',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Vehicle Status',
      type: 'string',
      description: 'This field is synced with specifications.vehicle.status automatically',
      options: {
        list: [
          { title: 'In Stock', value: 'in stock' },
          { title: 'Sold', value: 'sold' },
          { title: 'Pending Collection', value: 'pending collection' },
          { title: 'Coming Soon', value: 'coming soon' },
          { title: 'Reserved', value: 'reserved' },
        ],
      },
      initialValue: 'in stock',
    },
    {
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add badges to highlight special features or categories',
    },
    {
      name: 'extendedInfo',
      title: 'Extended Info',
      type: 'string',
      description: 'Additional information to display under the title',
    },
    {
      name: 'highlightedSpec',
      title: 'Highlighted Specifications',
      type: 'string',
      description: 'Key specifications to highlight (separate with |)',
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        {
          name: 'vehicle',
          title: 'Vehicle Details',
          type: 'object',
          fields: [
            {
              name: 'make',
              title: 'Make',
              type: 'string',
              validation: (Rule: unknown) => Rule.required(),
            },
            {
              name: 'model',
              title: 'Model',
              type: 'string',
              validation: (Rule: unknown) => Rule.required(),
            },
            {
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule: unknown) => Rule.required().min(1900).max(new Date().getFullYear()),
            },
            {
              name: 'transmission',
              title: 'Transmission',
              type: 'string',
            },
            {
              name: 'fuelType',
              title: 'Fuel Type',
              type: 'string',
            },
            {
              name: 'engineSize',
              title: 'Engine Size',
              type: 'string',
            },
            {
              name: 'doors',
              title: 'Number of Doors',
              type: 'number',
              validation: (Rule: unknown) => Rule.min(1).max(5),
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              description: 'This will be synchronized with the top level status field',
              options: {
                list: [
                  { title: 'In Stock', value: 'in stock' },
                  { title: 'Sold', value: 'sold' },
                  { title: 'Pending Collection', value: 'pending collection' },
                  { title: 'Coming Soon', value: 'coming soon' },
                  { title: 'Reserved', value: 'reserved' },
                ],
              },
              initialValue: 'in stock',
            },
          ],
        },
        {
          name: 'history',
          title: 'Vehicle History',
          type: 'object',
          fields: [
            {
              name: 'mileage',
              title: 'Mileage',
              type: 'number',
              validation: (Rule: unknown) => Rule.min(0),
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'specifications.vehicle.make',
      status: 'status',
    },
    prepare({ title, media, subtitle, status }: unknown) {
      return {
        title,
        media,
        subtitle: subtitle ? `${subtitle} - ${status || 'No status'}` : status || '',
      }
    },
  },
} 