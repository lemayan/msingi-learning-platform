import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons/Book'

/**
 * Module object — embedded inside a course document.
 * A module is not independently queryable; it exists only within a course.
 * Numbers like "Module 3" are derived from array order, not stored.
 */
export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) => rule.min(1).error('Each module must have at least one lesson'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
    },
  },
})
