import { defineField, defineType } from 'sanity'

export const modifiedVehicleType = defineType({
  name: 'modifiedVehicle',
  title: 'Modified Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Make and Model (e.g., "BMW M4 G80")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extendedInfo',
      title: 'Extended Info',
      type: 'string',
      description: 'Extended model information (e.g., "3.0 BiTurbo Competition Steptronic Euro 6 (s/s) 2dr")',
    }),
    defineField({
      name: 'highlightedSpec',
      title: 'Highlighted Spec',
      type: 'string',
      description: 'Attention-grabbing specification to highlight (e.g., "625 BHP | Carbon Package | Fully Loaded")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      description: 'Vehicle URL will be: /our-cars/modified-cars-for-sale/[slug]. TIP: Include the year at the beginning of the slug (e.g., "2023-bmw-m4")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Vehicle',
      type: 'boolean',
      description: 'Mark this vehicle as featured to highlight it on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Vehicle price in GBP',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mileage',
      title: 'Mileage',
      type: 'number',
      description: 'Vehicle mileage in miles',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of manufacture',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'make',
      title: 'Make',
      type: 'string',
      description: 'Vehicle manufacturer (e.g., "BMW", "Audi")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'Vehicle model (e.g., "M4", "RS6")',
      validation: (Rule) => Rule.required(),
    }),
    // Modified vehicle specific fields
    defineField({
      name: 'modifications',
      title: 'Modifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Engine', value: 'engine' },
                  { title: 'Exhaust', value: 'exhaust' },
                  { title: 'Suspension', value: 'suspension' },
                  { title: 'Wheels', value: 'wheels' },
                  { title: 'Brakes', value: 'brakes' },
                  { title: 'Exterior', value: 'exterior' },
                  { title: 'Interior', value: 'interior' },
                  { title: 'Electronics', value: 'electronics' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Modification Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'brand',
              title: 'Brand',
              type: 'string',
            }),
            defineField({
              name: 'cost',
              title: 'Approximate Cost',
              type: 'number',
              description: 'Approximate cost of this modification in GBP',
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            }),
          ],
        },
      ],
      description: 'List all modifications made to the vehicle',
    }),
    defineField({
      name: 'originalPower',
      title: 'Original Power',
      type: 'number',
      description: 'Original vehicle power in HP',
    }),
    defineField({
      name: 'currentPower',
      title: 'Current Power',
      type: 'number',
      description: 'Current vehicle power in HP after modifications',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currentTorque',
      title: 'Current Torque',
      type: 'number',
      description: 'Current vehicle torque in lb-ft after modifications',
    }),
    defineField({
      name: 'powerIncrease',
      title: 'Power Increase',
      type: 'number',
      description: 'Percentage increase in power',
      readOnly: true,
    }),
    defineField({
      name: 'stage',
      title: 'Tuning Stage',
      type: 'string',
      options: {
        list: [
          { title: 'Stage 1', value: 'stage-1' },
          { title: 'Stage 2', value: 'stage-2' },
          { title: 'Stage 3', value: 'stage-3' },
          { title: 'Custom', value: 'custom' },
        ],
      },
    }),
    defineField({
      name: 'dynoGraph',
      title: 'Dyno Graph',
      type: 'image',
      description: 'Image of dyno results showing power curves',
    }),
    defineField({
      name: 'modificationCost',
      title: 'Total Modification Cost',
      type: 'number',
      description: 'Total cost of all modifications in GBP',
    }),
    defineField({
      name: 'warranty',
      title: 'Modification Warranty',
      type: 'text',
      description: 'Details about any warranties on the modifications',
    }),
    // Base vehicle fields continued
    defineField({
      name: 'fuelType',
      title: 'Fuel Type',
      type: 'string',
      options: {
        list: [
          { title: 'Petrol', value: 'petrol' },
          { title: 'Diesel', value: 'diesel' },
          { title: 'Hybrid', value: 'hybrid' },
          { title: 'Electric', value: 'electric' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'transmission',
      title: 'Transmission',
      type: 'string',
      options: {
        list: [
          { title: 'Automatic', value: 'automatic' },
          { title: 'Manual', value: 'manual' },
          { title: 'Semi-Automatic', value: 'semi-automatic' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'engineSize',
      title: 'Engine Size',
      type: 'string',
      description: 'Engine size in litres (e.g., "3.0", "4.0")',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
    }),
    defineField({
      name: 'bodyType',
      title: 'Body Type',
      type: 'string',
      options: {
        list: [
          { title: 'Saloon', value: 'saloon' },
          { title: 'Coupe', value: 'coupe' },
          { title: 'Hatchback', value: 'hatchback' },
          { title: 'Estate', value: 'estate' },
          { title: 'SUV', value: 'suv' },
          { title: 'Convertible', value: 'convertible' },
          { title: 'Van', value: 'van' },
        ],
      },
    }),
    defineField({
      name: 'doors',
      title: 'Doors',
      type: 'number',
      options: {
        list: [2, 3, 4, 5],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Full description of the vehicle including features and history',
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List key features and specifications of the vehicle',
    }),
    defineField({
      name: 'vehicleHistory',
      title: 'Vehicle History',
      type: 'object',
      fields: [
        defineField({
          name: 'owners',
          title: 'Previous Owners',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'serviceHistory',
          title: 'Service History',
          type: 'string',
          options: {
            list: [
              { title: 'Full Service History', value: 'full' },
              { title: 'Partial Service History', value: 'partial' },
              { title: 'No Service History', value: 'none' },
            ],
          },
        }),
        defineField({
          name: 'mot',
          title: 'MOT',
          type: 'date',
          description: 'MOT expiry date',
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Sold', value: 'sold' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Coming Soon', value: 'coming-soon' },
        ],
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
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
      title: 'title',
      media: 'mainImage',
      price: 'price',
      currentPower: 'currentPower',
    },
    prepare({ title, media, price, currentPower }) {
      return {
        title,
        media,
        subtitle: `£${price?.toLocaleString()} | ${currentPower}HP`,
      }
    },
  },
}) 