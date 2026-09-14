import { defineQuery } from 'next-sanity'

// ─────────────────────────────────────────────────────────────────────────────
// Shared fragments (interpolated into queries, not standalone queries)
// ─────────────────────────────────────────────────────────────────────────────

/** Instructor summary — used on catalog cards and course detail. */
const instructorSummaryFragment = /* groq */ `
  instructor->{
    _id,
    name,
    "slug": slug.current,
    photo {
      asset->{ _id, url },
      hotspot,
      crop
    },
    expertise
  }
`

/** Category summary — used on catalog cards. */
const categorySummaryFragment = /* groq */ `
  category->{
    _id,
    title,
    "slug": slug.current
  }
`

/** Lesson summary — used inside module listings within a course. */
const lessonSummaryFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  duration,
  freePreview,
  studentCount,
  thumbnail {
    asset->{ _id, url },
    hotspot,
    crop
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// Courses
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Catalog listing — all published courses, ordered newest first.
 * Used on the course catalog page.
 */
export const COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      asset->{ _id, url },
      hotspot,
      crop
    },
    level,
    price,
    popular,
    studentCount,
    ${instructorSummaryFragment},
    ${categorySummaryFragment},
    modules[] {
      lessons[]-> {
        duration
      }
    }
  }
`)

/**
 * Single course by slug — full detail including all modules and their lessons.
 * Used on the course detail page.
 */
export const COURSE_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      asset->{ _id, url },
      hotspot,
      crop
    },
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[] {
      _key,
      icon,
      title,
      description
    },
    ${instructorSummaryFragment},
    ${categorySummaryFragment},
    modules[] {
      _key,
      title,
      summary,
      lessons[]-> {
        ${lessonSummaryFragment}
      }
    }
  }
`)

/**
 * All course slugs — used in generateStaticParams.
 */
export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─────────────────────────────────────────────────────────────────────────────
// Lessons
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Single lesson by slug — full detail including notes, resources, key points.
 * Reverse-references back to the parent course via the module that contains it.
 * Used on the lesson page.
 */
export const LESSON_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    thumbnail {
      asset->{ _id, url },
      hotspot,
      crop
    },
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[] {
      _key,
      type,
      title,
      description,
      url
    },
    // Derive parent course: find the course whose modules reference this lesson
    "course": *[
      _type == "course" &&
      references(^._id) &&
      (!defined($courseSlug) || slug.current == $courseSlug)
    ][0] {
      _id,
      title,
      "slug": slug.current,
      level,
      studentCount,
      coverImage {
        asset->{ _id, url },
        hotspot,
        crop
      },
      ${instructorSummaryFragment},
      modules[] {
        _key,
        title,
        summary,
        lessons[]-> {
          _id,
          title,
          "slug": slug.current,
          duration,
          freePreview
        }
      }
    }
  }
`)

/**
 * All lesson slugs grouped by course — used in generateStaticParams for nested route.
 */
export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] {
    "courseSlug": slug.current,
    "lessons": modules[].lessons[]-> {
      "slug": slug.current
    }
  }
`)

/**
 * Lessons by IDs — used for structural grounding in search.
 * Given an array of lesson _ids returned by the search model or query,
 * reads back authoritative lesson metadata and the parent course with its modules
 * to compute the derived 5.1 labels.
 */
export const LESSONS_BY_IDS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    duration,
    freePreview,
    studentCount,
    keyPoints,
    thumbnail {
      asset->{ _id, url },
      hotspot,
      crop
    },
    videoUrl,
    _createdAt,
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      level,
      studentCount,
      coverImage {
        asset->{ _id, url },
        hotspot,
        crop
      },
      modules[] {
        _key,
        title,
        summary,
        lessons[]-> {
          _id,
          title,
          "slug": slug.current,
          duration,
          freePreview
        }
      }
    }
  }
`)

// ─────────────────────────────────────────────────────────────────────────────
// Instructors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Single instructor by slug — full detail including their courses.
 * Used on the instructor page at /instructors/[slug].
 */
export const INSTRUCTOR_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo {
      asset->{ _id, url },
      hotspot,
      crop
    },
    expertise,
    bio,
    // Reverse reference: all courses this instructor teaches
    "courses": *[_type == "course" && instructor._ref == ^._id] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      coverImage {
        asset->{ _id, url },
        hotspot,
        crop
      },
      level,
      price,
      studentCount
    }
  }
`)

/**
 * All instructor slugs — used in generateStaticParams.
 */
export const INSTRUCTOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Courses in a specific category.
 * Used on category pages and filtered catalog views.
 */
export const CATEGORY_COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && category->slug.current == $categorySlug && defined(slug.current)]
  | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      asset->{ _id, url },
      hotspot,
      crop
    },
    level,
    price,
    isPopular,
    studentCount,
    ${instructorSummaryFragment},
    ${categorySummaryFragment}
  }
`)

/**
 * All categories — used for navigation and filter UI.
 */
export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

// ─────────────────────────────────────────────────────────────────────────────
// Learner Progress
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all progress records for an authenticated learner.
 */
export const LEARNER_PROGRESS_QUERY = defineQuery(/* groq */ `
  *[_type == "learnerProgress" && userId == $userId] {
    _id,
    "lessonId": lesson._ref,
    completed,
    resumePosition,
    updatedAt
  }
`)

/**
 * Fetch all completed lessons with their parent courses for My Learning.
 */
export const LEARNER_COURSES_WITH_PROGRESS_QUERY = defineQuery(/* groq */ `
  *[_type == "learnerProgress" && userId == $userId && completed == true] {
    "lessonId": lesson._ref,
    "lesson": lesson-> {
      _id,
      title,
      "slug": slug.current,
      "course": *[_type == "course" && references(^._id)][0] {
        _id,
        title,
        "slug": slug.current,
        summary,
        coverImage {
          asset->{ _id, url },
          hotspot,
          crop
        },
        level,
        modules[] {
          lessons[]-> {
            _id
          }
        }
      }
    }
  }
`)

