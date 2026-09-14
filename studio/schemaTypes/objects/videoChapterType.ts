import { defineField, defineType } from 'sanity';

export const videoChapterType = defineType({
  name: 'videoChapter',
  title: 'Video Chapter',
  type: 'object',
  fields: [
    defineField({ name: 'startSeconds', type: 'number', title: 'Start (seconds)', validation: (r) => r.required().min(0) }),
    defineField({ name: 'label', type: 'string', title: 'Label', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'startSeconds' } },
});

