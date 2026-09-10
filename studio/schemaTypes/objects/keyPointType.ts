import { defineField, defineType } from 'sanity'
import { CheckmarkIcon } from '@sanity/icons/Checkmark'

/**
 * Key point — a single bullet in the "In this lesson you will learn" list.
 * Embedded inside a lesson's keyPoints array.
 */
export const keyPointType = defineType({
  name: 'keyPoint',
  title: 'Key Point',
  type: 'object',
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: { title: 'text' },
  },
})
