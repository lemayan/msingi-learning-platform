import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons/Star'

/**
 * LearningOutcome — one item in a course's "What you'll learn" grid.
 * Has an icon (emoji or shortcode), a title, and a description.
 */
export const learningOutcomeType = defineType({
  name: 'learningOutcome',
  title: 'Learning Outcome',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'An emoji or icon shortcode representing this outcome (e.g. 🚀, 🎯)',
      type: 'string',
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(250),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'icon',
    },
  },
})
