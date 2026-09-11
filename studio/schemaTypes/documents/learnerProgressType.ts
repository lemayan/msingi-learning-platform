import { defineField, defineType } from 'sanity'
import { ActivityIcon } from '@sanity/icons/Activity'

/**
 * LearnerProgress document — per-learner state written ONLY through a server route.
 * Keyed by Clerk user ID.
 *
 * Security:
 * - The browser NEVER writes this directly.
 * - All writes go through a server route that uses SANITY_API_WRITE_TOKEN.
 * - This document is surfaced in the Studio for admin debugging only.
 */
export const learnerProgressType = defineType({
  name: 'learnerProgress',
  title: 'Learner Progress',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'lesson',
      title: 'Lesson',
      type: 'reference',
      to: [{ type: 'lesson' }],
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'completed',
      title: 'Completed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'resumePosition',
      title: 'Resume Position (seconds)',
      description: 'Last watched position in the video.',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'userId',
      subtitle: 'lesson.title',
    },
  },
})
