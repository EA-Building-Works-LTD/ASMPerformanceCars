import { defineField, defineType } from 'sanity'

export const vehicleType = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Full vehicle name (e.g., "2018 BMW M4 Competition 3.0 BiTurbo")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extendedInfo',
      title: 'Extended Info',
      type: 'string',
      description: 'Extended model information (e.g., "2.0 TDI S Line Plus Avant 5dr")',
    }),
    defineField({
      name: 'highlightedSpec',
      title: 'Highlighted Spec',
      type: 'string',
      description: 'Key specifications to highlight, separated by | (e.g., "Full Service History | Panoramic Roof | Virtual Cockpit")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      description: 'Vehicle URL will be: /our-cars/used-cars-for-sale/[slug]. TIP: Include the year at the beginning of the slug (e.g., "2018-audi-a4")',
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
      name: 'horsepower',
      title: 'Horsepower',
      type: 'number',
      description: 'Engine power in HP',
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
        defineField({
          name: 'motHistory',
          title: 'MOT History',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Brief notes on MOT history',
        }),
      ],
    }),
    defineField({
      name: 'financingOptions',
      title: 'Financing Options',
      type: 'object',
      fields: [
        defineField({
          name: 'available',
          title: 'Finance Available',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'monthlyPayment',
          title: 'Example Monthly Payment',
          type: 'number',
          description: 'Example monthly payment amount in GBP',
        }),
        defineField({
          name: 'deposit',
          title: 'Deposit',
          type: 'number',
          description: 'Required deposit in GBP',
        }),
        defineField({
          name: 'term',
          title: 'Term',
          type: 'number',
          description: 'Term length in months',
        }),
        defineField({
          name: 'apr',
          title: 'APR',
          type: 'number',
          description: 'Annual Percentage Rate',
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
      year: 'year',
      make: 'make',
      model: 'model',
    },
    prepare({ title, media, price, year, make, model }) {
      return {
        title,
        media,
        subtitle: `£${price?.toLocaleString()} | ${year} ${make} ${model}`,
      }
    },
  },
}) 