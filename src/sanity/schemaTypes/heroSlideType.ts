import { defineField, defineType } from 'sanity'

export const heroSlideType = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main headline for this slide',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional secondary text',
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional alternative image for mobile devices',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Black', value: 'black' },
          { title: 'Gray', value: 'gray' },
          { title: 'Primary', value: 'primary' },
        ],
      },
      initialValue: 'white',
      description: 'Color of the text to ensure readability against the background',
    }),
    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      type: 'string',
      description: 'Optional CSS color value for a gradient overlay (e.g., rgba(0,0,0,0.5))',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the call-to-action button (leave empty for no button)',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'URL or path for the button link',
    }),
    defineField({
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
      description: 'Text for an optional secondary button',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      type: 'string',
      description: 'URL or path for the secondary button',
    }),
    defineField({
      name: 'secondaryButtonStyle',
      title: 'Secondary Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
        ],
      },
      initialValue: 'outline',
    }),
    defineField({
      name: 'textAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'textPosition',
      title: 'Text Position',
      type: 'string',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Middle', value: 'middle' },
          { title: 'Bottom', value: 'bottom' },
        ],
      },
      initialValue: 'middle',
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Fade In', value: 'fade' },
          { title: 'Slide Up', value: 'slideUp' },
          { title: 'Slide In From Left', value: 'slideLeft' },
          { title: 'Slide In From Right', value: 'slideRight' },
          { title: 'Zoom In', value: 'zoomIn' },
        ],
      },
      initialValue: 'fade',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order in the slider (lower numbers appear first)',
      initialValue: 1,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this slide currently active?',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'Optional start date for time-limited campaigns',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'Optional end date for time-limited campaigns',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? '🟢 ' : '⚪ '}${title}`,
        subtitle: subtitle || '',
        media,
      }
    },
  },
}) 