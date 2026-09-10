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
  isFreePreview,
  studentCount,
  poster {
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
    isPopular,
    studentCount,
    ${instructorSummaryFragment},
    ${categorySummaryFragment}
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
    isPopular,
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
    poster {
      asset->{ _id, url },
      hotspot,
      crop
    },
    duration,
    isFreePreview,
    studentCount,
    notes,
    keyPoints[] {
      _key,
      text
    },
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
      references(^._id)
    ][0] {
      _id,
      title,
      "slug": slug.current,
      ${instructorSummaryFragment},
      modules[] {
        _key,
        title,
        lessons[]-> {
          _id,
          title,
          "slug": slug.current,
          duration,
          isFreePreview
        }
      }
    }
  }
`)

/**
 * All lesson slugs — used in generateStaticParams.
 */
export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && defined(slug.current)] {
    "slug": slug.current
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
