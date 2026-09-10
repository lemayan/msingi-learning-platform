import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'

/**
 * Lesson document — the atomic unit of learning.
 * Lessons do NOT store a parent course reference.
 * The parent course is derived via reverse reference when needed.
 *
 * Numbering like "Lesson 3.2" is derived from the course module array order
 * at query time — never stored here.
 */
export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(150),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'YouTube, Vimeo, or Bunny embed URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'isFreePreview',
      title: 'Free Preview',
      description: 'Show a "Free Preview" badge — does not control access.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      description: 'Display number — not derived from real data.',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes',
      type: 'portableText',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      description: 'What the learner will know after this lesson.',
      type: 'array',
      of: [defineArrayMember({ type: 'keyPoint' })],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'resource' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'videoUrl',
      media: 'poster',
    },
  },
})
