import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons/Link'

/**
 * Resource — a supplementary link on a lesson.
 * Embedded inside a lesson's resources array.
 */
export const resourceType = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Video', value: 'video' },
          { title: 'Repository', value: 'repo' },
          { title: 'Tool', value: 'tool' },
          { title: 'Documentation', value: 'docs' },
          { title: 'Link', value: 'link' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(150),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
})
