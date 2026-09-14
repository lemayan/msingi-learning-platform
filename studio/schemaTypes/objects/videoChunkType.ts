import { defineField, defineType } from 'sanity';

export const videoChunkType = defineType({
  name: 'videoChunk',
  title: 'Video Chunk',
  type: 'object',
  fields: [
    defineField({ name: 'startSeconds', type: 'number', title: 'Start (seconds)', validation: (r) => r.required().min(0) }),
    defineField({ name: 'text', type: 'text', title: 'Text', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'startSeconds' } },
});

