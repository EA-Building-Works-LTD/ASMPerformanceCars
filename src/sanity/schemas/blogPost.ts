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
  title?: string;
  author?: string;
  media?: any;
  publishedAt?: string;
}

export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title for SEO (recommended: 50-60 characters)',
          validation: (Rule: SanityRule) => Rule.max(60).warning('Meta titles should be between 50-60 characters'),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for SEO (recommended: 150-160 characters)',
          validation: (Rule: SanityRule) => Rule.max(160).warning('Meta descriptions should be between 150-160 characters'),
        },
      ],
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (Rule: SanityRule) => Rule.required().min(1),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short description of the blog post',
      validation: (Rule: SanityRule) => Rule.required().max(200),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'code' },
        { type: 'list' },
        { type: 'listItem' },
      ],
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, publishedAt }: PreviewParams) {
      return {
        title,
        subtitle: author && publishedAt ? `By ${author} • ${new Date(publishedAt).toLocaleDateString()}` : '',
        media,
      }
    },
  },
} 