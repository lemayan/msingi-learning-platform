import { notFound, redirect } from "next/navigation";
import { fetchSanity } from "@/sanity/lib/fetch";
import { LESSON_QUERY } from "@/sanity/lib/queries";
import type { LessonData } from "@/app/courses/[slug]/lessons/[lessonSlug]/lesson-view";

interface RedirectPageProps {
  params: Promise<{
    lessonSlug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LessonRedirectPage({
  params,
  searchParams,
}: RedirectPageProps) {
  const { lessonSlug } = await params;
  const resolvedSearchParams = await searchParams;

  const { data } = await fetchSanity(LESSON_QUERY, {
    slug: lessonSlug,
  });
  const lesson = data as LessonData | null;

  if (!lesson || !lesson.course?.slug) {
    notFound();
  }

  // Preserve query params like ?start= or ?t=
  const searchString = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      searchString.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => searchString.append(key, v));
    }
  }

  const query = searchString.toString();
  const targetUrl = `/courses/${lesson.course.slug}/lessons/${lesson.slug}${
    query ? `?${query}` : ""
  }`;

  redirect(targetUrl);
}
