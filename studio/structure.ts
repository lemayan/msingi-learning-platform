import type { StructureResolver } from 'sanity/structure'
import { BookIcon } from '@sanity/icons/Book'
import { PlayIcon } from '@sanity/icons/Play'
import { UserIcon } from '@sanity/icons/User'
import { TagIcon } from '@sanity/icons/Tag'
import { PlugIcon } from '@sanity/icons/Plug'
import { ActivityIcon } from '@sanity/icons/Activity'

/**
 * Studio navigation structure for the msingi learning platform.
 *
 * Sections:
 * 1. Content — Courses, Lessons, Instructors, Categories
 * 2. Content Pipeline — Video Documents (internal, written by ingestion pipeline)
 * 3. Learner Data — Progress Records (admin debugging)
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Msingi')
    .items([
      // ─── Content ──────────────────────────────────────────────────
      S.documentTypeListItem('course')
        .title('Courses')
        .icon(BookIcon),

      S.documentTypeListItem('lesson')
        .title('Lessons')
        .icon(PlayIcon),

      S.documentTypeListItem('instructor')
        .title('Instructors')
        .icon(UserIcon),

      S.documentTypeListItem('category')
        .title('Categories')
        .icon(TagIcon),

      S.divider(),

      // ─── Content Pipeline ─────────────────────────────────────────
      S.listItem()
        .title('Content Pipeline')
        .icon(PlugIcon)
        .child(
          S.list()
            .title('Content Pipeline')
            .items([
              S.documentTypeListItem('videoDoc')
                .title('Video Documents')
                .icon(PlugIcon),
            ]),
        ),

      S.divider(),

      // ─── Learner Data ─────────────────────────────────────────────
      S.listItem()
        .title('Learner Data')
        .icon(ActivityIcon)
        .child(
          S.list()
            .title('Learner Data')
            .items([
              S.documentTypeListItem('learnerProgress')
                .title('Progress Records')
                .icon(ActivityIcon),
            ]),
        ),
    ])
