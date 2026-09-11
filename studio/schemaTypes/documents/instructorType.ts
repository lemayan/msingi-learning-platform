import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'

/**
 * Instructor document — surfaces on the course detail page, lesson page,
 * and each instructor's own page at /instructors/[slug].
 */
export const instructorType = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      description: 'Short tagline — e.g. ["React", "TypeScript"]',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      expertise: 'expertise',
      media: 'photo',
    },
    prepare({ title, expertise, media }) {
      return {
        title,
        subtitle: Array.isArray(expertise) ? expertise.join(', ') : expertise,
        media,
      }
    }
  },
})
