import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlugIcon } from '@sanity/icons/Plug'

/**
 * VideoDoc document — internal lookup built by the offline ingestion pipeline.
 * One per unique video URL.
 * Never surfaced directly to learners; only referenced internally by the search layer.
 *
 * - chapters: table of contents (preferred for timestamp matching)
 * - chunks:   timestamped transcript pieces (fallback for timestamp matching)
 */
export const videoDocType = defineType({
  name: 'videoDoc',
  title: 'Video Document',
  type: 'document',
  icon: PlugIcon,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      description: 'Unique identifier derived from the video URL (sanitized for Sanity IDs).',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters (Table of Contents)',
      description: 'Authored or provider chapter markers — preferred for timestamp matching.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({ name: 'startSeconds', type: 'number', title: 'Start (seconds)', validation: (r) => r.required().min(0) }),
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'startSeconds' } },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      description: 'Short timestamped transcript pieces — fallback for timestamp matching.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({ name: 'startSeconds', type: 'number', title: 'Start (seconds)', validation: (r) => r.required().min(0) }),
            defineField({ name: 'text', type: 'text', title: 'Text', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'text', subtitle: 'startSeconds' } },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'videoId',
      subtitle: 'url',
    },
  },
})
