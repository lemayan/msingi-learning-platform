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
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'video', title: 'Video' },
    { name: 'extras', title: 'Extras' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(150),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'YouTube, Vimeo, or Bunny embed URL',
      type: 'url',
      group: 'video',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Poster / Thumbnail',
      type: 'image',
      group: 'video',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      group: 'video',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free Preview',
      description: 'Show a "Free Preview" badge — does not control access.',
      type: 'boolean',
      group: 'extras',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      description: 'Display number — not derived from real data.',
      type: 'number',
      group: 'extras',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      description: 'What the learner will know after this lesson.',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      group: 'extras',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      group: 'extras',
      of: [defineArrayMember({ type: 'resource' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'videoUrl',
      media: 'thumbnail',
    },
  },
})
