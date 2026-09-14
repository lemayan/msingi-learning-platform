import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlugIcon } from '@sanity/icons/Plug'

export const videoType = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  icon: PlugIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters',
      type: 'array',
      of: [defineArrayMember({ type: 'videoChapter' })],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      type: 'array',
      of: [defineArrayMember({ type: 'videoChunk' })],
    }),
  ],
  preview: {
    select: {
      title: 'videoId',
      subtitle: 'url',
    },
  },
})

