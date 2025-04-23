import { defineType, defineField } from 'sanity'

export const tableType = defineType({
  name: 'table',
  type: 'object',
  title: 'Table',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      title: 'Rows',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              name: 'cells',
              type: 'array',
              of: [{ type: 'text' }]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'hasHeaderRow',
      title: 'Has header row',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption to display below the table'
    })
  ],
  preview: {
    select: {
      rows: 'rows',
      caption: 'caption'
    },
    prepare({ rows = [], caption }) {
      const cellCount = rows[0]?.cells?.length || 0
      const rowCount = rows.length

      return {
        title: caption || 'Table',
        subtitle: `${rowCount} row${rowCount === 1 ? '' : 's'} × ${cellCount} column${cellCount === 1 ? '' : 's'}`
      }
    }
  }
}) 