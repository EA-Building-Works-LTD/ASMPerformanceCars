import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Name of your website',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      description: 'Brief description of your website',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'The URL of your website (e.g., https://asmperformancecars.co.uk)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Main logo for the website',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Favicon for the website (32x32 pixels recommended)',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Default SEO settings used when specific page SEO is not provided'
    }),
    defineField({
      name: 'homeSeo',
      title: 'Home Page SEO',
      type: 'seo',
      description: 'SEO settings for the home page'
    }),
    defineField({
      name: 'pageSeo',
      title: 'Page SEO',
      type: 'object',
      description: 'SEO settings for different page types',
      fields: [
        defineField({
          name: 'vehicles',
          title: 'Vehicles Page',
          type: 'seo'
        }),
        defineField({
          name: 'modifiedVehicles',
          title: 'Modified Vehicles Page',
          type: 'seo'
        }),
        defineField({
          name: 'luxuryVehicles',
          title: 'Luxury Vehicles Page',
          type: 'seo'
        }),
        defineField({
          name: 'services',
          title: 'Services Page',
          type: 'seo'
        }),
        defineField({
          name: 'dealerships',
          title: 'Dealerships Page',
          type: 'seo'
        }),
        defineField({
          name: 'about',
          title: 'About Page',
          type: 'seo'
        }),
        defineField({
          name: 'contact',
          title: 'Contact Page',
          type: 'seo'
        }),
        defineField({
          name: 'blog',
          title: 'Blog Page',
          type: 'seo'
        }),
        defineField({
          name: 'motCheck',
          title: 'MOT Check Page',
          type: 'seo'
        })
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url'
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter',
          type: 'url'
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'siteName'
    },
    prepare({ title }) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Global website configuration'
      }
    }
  }
}) 