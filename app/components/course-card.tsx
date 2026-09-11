"use client";

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";
import { BarChartIcon, ClockIcon, DocumentIcon } from "./icons";
import { urlFor } from "@/sanity/lib/image";
import { formatDuration } from "@/app/lib/format-duration";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SanityImageRef {
  asset?: { _id: string; url: string } | null;
  hotspot?: unknown;
  crop?: unknown;
}

export interface CourseCardData {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: SanityImageRef | null;
  level: string | null;
  price: number | null;
  popular: boolean | null;
  studentCount: number | null;
  modules: { lessons: { duration: number | null }[] | null }[] | null;
}

function capitalizeLevel(level: string | null): string {
  if (!level) return "—";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function CourseCard({ course }: { course: CourseCardData }) {
  const totalDuration =
    course.modules?.reduce(
      (sum, m) => sum + (m.lessons?.reduce((ls, l) => ls + (l.duration ?? 0), 0) ?? 0),
      0
    ) ?? 0;
  const moduleCount = course.modules?.length ?? 0;
  const coverImageUrl = course.coverImage?.asset
    ? urlFor(course.coverImage).width(128).height(128).fit("crop").url()
    : null;

  return (
    <Link
      href={`/courses/${course.slug}`}
      onClick={() =>
        posthog.capture("course_selected", {
          course_id: course._id,
          course_slug: course.slug,
          course_level: course.level,
          is_popular: course.popular ?? false,
          module_count: moduleCount,
        })
      }
      className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 rounded-[14px] bg-[#0F172A] flex items-center justify-center mb-6 shadow-sm overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={course.title ?? ""}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-3xl font-light font-sans tracking-tight">
            {course.title?.charAt(0) ?? "?"}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{course.title}</h3>
      <p className="text-sm text-[#64748B] mb-8 flex-1 leading-relaxed line-clamp-2">
        {course.summary}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <BarChartIcon /> {capitalizeLevel(course.level)}
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon /> {formatDuration(totalDuration)}
        </div>
        <div className="flex items-center gap-1.5">
          <DocumentIcon /> {moduleCount} modules
        </div>
      </div>
    </Link>
  );
}
