import {defineField, defineType} from 'sanity'

export const blogAdType = defineType({
  name: 'blogAd',
  title: 'Blog Advertisements',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'adContent',
      title: 'Ad Content',
    },
    {
      name: 'placement',
      title: 'Placement',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the advertisement (for internal reference)',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'adSize',
      title: 'Advertisement Size',
      type: 'string',
      description: 'Choose the size format for this ad',
      options: {
        list: [
          { title: 'Wide Skyscraper (160x600)', value: '160x600' },
          { title: 'Square (250x250)', value: '250x250' },
          { title: 'Mobile Banner (320x100)', value: '320x100' },
          { title: 'Mobile Footer (393x90)', value: '393x90' },
          { title: 'Standard Banner (728x90)', value: '728x90' },
          { title: 'Large Banner (970x90)', value: '970x90' },
          { title: 'Responsive Footer (Desktop: 970x90, Mobile: 393x90)', value: 'responsive_footer' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'adImage',
      title: 'Advertisement Image',
      type: 'image',
      description: 'Upload the advertisement image (fallback if video doesn\'t play)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'adContent',
    }),
    defineField({
      name: 'adVideo',
      title: 'Advertisement Video',
      type: 'file',
      description: 'Upload video for the ad (MP4 format recommended). Will be prioritized over image if provided.',
      options: {
        accept: 'video/*',
      },
      fields: [
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Brief description of the video content',
        }),
      ],
      group: 'adContent',
    }),
    defineField({
      name: 'link',
      title: 'Advertisement Link',
      type: 'url',
      description: 'Where users will be directed when they click the ad',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to enable/disable this advertisement',
      initialValue: true,
      group: 'basic',
    }),
    defineField({
      name: 'displayLocation',
      title: 'Display Location',
      type: 'string',
      description: 'Where the ad should appear in blog posts',
      options: {
        list: [
          {title: 'Above Back To Blog Link', value: 'above_back_link'},
          {title: 'Below Key Takeaways', value: 'below_takeaways'},
          {title: 'Mid-Content', value: 'mid_content'},
          {title: 'Above Author Bio', value: 'above_bio'},
          {title: 'Global Footer', value: 'global_footer'},
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'placement',
    }),
    defineField({
      name: 'trackingId',
      title: 'Tracking ID',
      type: 'string',
      description: 'Optional tracking ID for analytics',
      group: 'basic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'adImage',
      size: 'adSize',
      location: 'displayLocation',
      active: 'isActive',
      hasVideo: 'adVideo',
    },
    prepare({title, media, size, location, active, hasVideo}) {
      const displayLocations = {
        above_back_link: 'Above Back To Blog Link',
        below_takeaways: 'Below Key Takeaways',
        mid_content: 'Mid-Content',
        above_bio: 'Above Author Bio',
        global_footer: 'Global Footer',
      }
      
      const typeIndicator = hasVideo ? '🎬 Video' : '🖼️ Image';
      
      return {
        title,
        media,
        subtitle: `${active ? '✅ Active' : '❌ Inactive'} • ${size} • ${typeIndicator} • ${displayLocations[location as keyof typeof displayLocations] || location}`,
      }
    },
  },
})