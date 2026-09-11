import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons/Book'

/**
 * Course document — top-level content unit.
 * Contains an ordered array of module objects (each module is embedded, not a separate document).
 * Each module holds an ordered array of references to lesson documents.
 */
export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'marketing', title: 'Marketing' },
    { name: 'curriculum', title: 'Curriculum' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required().max(150),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Short marketing description shown on catalog cards.',
      type: 'text',
      group: 'marketing',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'marketing',
      options: { hotspot: true },
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      group: 'marketing',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'popular',
      title: 'Mark as Popular',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      description: 'Display number — not derived from real data.',
      type: 'number',
      group: 'marketing',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'learningOutcomes',
      title: 'Learning Outcomes',
      description: 'What learners will be able to do after completing this course.',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({ type: 'learningOutcome' })],
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      group: 'overview',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'overview',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({ type: 'module' })],
      validation: (rule) => rule.min(1).error('A course must have at least one module'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'level',
      media: 'coverImage',
    },
  },
})
