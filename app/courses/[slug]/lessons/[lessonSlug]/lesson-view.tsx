"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";
import type { PortableTextBlock } from "sanity";
import {
  BarChartIcon,
  ClockIcon,
  UsersIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BookmarkIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  LightbulbIcon,
  GithubIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentIcon,
  LinkIcon,
} from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format-duration";
import { getVideoEmbedInfo } from "@/app/lib/video-embed";
import { urlFor } from "@/sanity/lib/image";
import { LessonPortableText } from "./portable-text";
import {
  trackVideoPlayed,
  trackLessonCompleted,
  trackLessonResumed,
  trackLessonNavigated,
  trackLessonTabSwitched,
} from "@/app/lib/analytics-client";
import { useWatchDepth } from "@/hooks/use-watch-depth";
import { useCourseProgress } from "@/hooks/use-course-progress";


export interface SanityImageRef {
  asset?: { _id: string; url: string } | null;
  hotspot?: unknown;
  crop?: unknown;
}

export interface ResourceItem {
  _key: string;
  type: string;
  title: string;
  description: string | null;
  url: string;
}

export interface LessonSummary {
  _id: string;
  title: string;
  slug: string;
  duration: number | null;
  freePreview: boolean | null;
}

export interface ModuleItem {
  _key: string;
  title: string;
  summary: string | null;
  lessons: LessonSummary[];
}

export interface CourseData {
  _id: string;
  title: string;
  slug: string;
  level: string | null;
  studentCount: number | null;
  coverImage: SanityImageRef | null;
  modules: ModuleItem[];
}

export interface LessonData {
  _id: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  thumbnail: SanityImageRef | null;
  duration: number | null;
  freePreview: boolean | null;
  studentCount: number | null;
  notes: PortableTextBlock[] | null;
  keyPoints: string[] | null;
  proTip: string | null;
  resources: ResourceItem[] | null;
  course: CourseData | null;
}

interface LessonViewProps {
  lesson: LessonData;
  initialStartSeconds?: number;
}

function formatStudentCount(count: number | null): string {
  if (!count) return "0";
  return count.toLocaleString();
}

function capitalizeLevel(level: string | null): string {
  if (!level) return "Intermediate";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function LessonView({ lesson, initialStartSeconds }: LessonViewProps) {
  const course = lesson.course;
  const modules = course?.modules ?? [];

  // Identify current module and lesson indices
  let currentModuleIndex = -1;
  let currentLessonIndexInModule = -1;

  for (let mIdx = 0; mIdx < modules.length; mIdx++) {
    const lIdx = modules[mIdx].lessons?.findIndex((l) => l.slug === lesson.slug);
    if (lIdx !== -1 && lIdx !== undefined) {
      currentModuleIndex = mIdx;
      currentLessonIndexInModule = lIdx;
      break;
    }
  }

  // Flatten all lessons across all modules for prev/next navigation
  const allLessons: { lesson: LessonSummary; moduleIndex: number; lessonIndex: number }[] = [];
  modules.forEach((mod, mIdx) => {
    mod.lessons?.forEach((l, lIdx) => {
      allLessons.push({ lesson: l, moduleIndex: mIdx, lessonIndex: lIdx });
    });
  });

  const flatIndex = allLessons.findIndex((item) => item.lesson.slug === lesson.slug);
  const prevItem = flatIndex > 0 ? allLessons[flatIndex - 1] : null;
  const nextItem = flatIndex >= 0 && flatIndex < allLessons.length - 1 ? allLessons[flatIndex + 1] : null;

  // Active expanded module state in sidebar
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentModuleIndex >= 0 && modules[currentModuleIndex]) {
      initial.add(modules[currentModuleIndex]._key);
    }
    return initial;
  });

  // Active tab state: "content" | "notes"
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [studentNotes, setStudentNotes] = useState("");

  // Learner course & lesson progress
  const {
    progressPercent,
    isLessonCompleted,
    isModuleCompleted,
    toggleLessonCompletion,
    markLessonCompleted,
  } = useCourseProgress(course);

  const isCurrentLessonCompleted = isLessonCompleted(lesson._id);

  // Video embed info
  const embedInfo = getVideoEmbedInfo(lesson.videoUrl, initialStartSeconds);

  // Track PostHog analytics on mount
  useEffect(() => {
    posthog.capture("lesson_viewed", {
      lesson_id: lesson._id,
      lesson_slug: lesson.slug,
      lesson_title: lesson.title,
      course_id: course?._id,
      course_slug: course?.slug,
      course_title: course?.title,
      duration: lesson.duration,
      start_seconds: initialStartSeconds ?? 0,
    });
  }, [lesson._id, lesson.slug, lesson.title, lesson.duration, course?._id, course?.slug, course?.title, initialStartSeconds]);

  // Track Lesson Resumed if entering via deep link with a timestamp
  useEffect(() => {
    if (initialStartSeconds && initialStartSeconds > 0) {
      trackLessonResumed({
        course_slug: course?.slug || '',
        lesson_slug: lesson.slug,
        start_seconds: initialStartSeconds,
        source: 'deep_link',
      });
    }
  }, [initialStartSeconds, course?.slug, lesson.slug]);

  const hasTrackedPlay = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Measure watch depth via elapsed-time hook (hidden tabs don't count, latched once per mount)
  useWatchDepth({
    isPlaying,
    durationSeconds: lesson.duration ?? 0,
    lessonSlug: lesson.slug,
    courseSlug: course?.slug || '',
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    onComplete: () => {
      markLessonCompleted(lesson._id);
    },
  });

  const triggerVideoPlay = useCallback(() => {
    if (!hasTrackedPlay.current) {
      hasTrackedPlay.current = true;
      const isDeepLink = Boolean(initialStartSeconds && initialStartSeconds > 0);
      trackVideoPlayed({
        provider: embedInfo?.provider || 'youtube',
        course_slug: course?.slug || '',
        duration_seconds: lesson.duration ?? 0,
        source: isDeepLink ? 'deep_link' : 'poster_click',
        lesson_slug: lesson.slug,
        lesson_id: lesson._id,
        lesson_title: lesson.title,
        start_seconds: initialStartSeconds ?? 0,
      });
    }
  }, [
    lesson._id,
    lesson.slug,
    lesson.title,
    lesson.duration,
    course?.slug,
    initialStartSeconds,
    embedInfo?.provider,
  ]);

  // YouTube postMessage event listener for play state updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === 'onStateChange') {
          // 1 = playing, 2 = paused, 0 = ended
          if (data.info === 1) {
            setIsPlaying(true);
            triggerVideoPlay();
          } else if (data.info === 2) {
            setIsPlaying(false);
          } else if (data.info === 0) {
            setIsPlaying(false);
            trackLessonCompleted({
              lesson_id: lesson._id,
              lesson_slug: lesson.slug,
              lesson_title: lesson.title,
              course_slug: course?.slug || '',
              source: 'watch_threshold',
            });
            markLessonCompleted(lesson._id);
          }
        }
      } catch {
        // non-JSON message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [lesson._id, lesson.slug, lesson.title, course?.slug, triggerVideoPlay, markLessonCompleted]);

  const handleToggleComplete = async () => {
    const nextCompleted = await toggleLessonCompletion(lesson._id);
    if (nextCompleted) {
      trackLessonCompleted({
        lesson_id: lesson._id,
        lesson_slug: lesson.slug,
        lesson_title: lesson.title,
        course_slug: course?.slug || '',
        source: 'manual_toggle',
      });
    }
  };

  const handleTabChange = (tab: "content" | "notes") => {
    setActiveTab(tab);
    trackLessonTabSwitched({
      lesson_slug: lesson.slug,
      tab,
    });
  };

  const toggleModule = (key: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Fallback cover image URL
  const courseCoverUrl = course?.coverImage?.asset
    ? urlFor(course.coverImage).width(120).height(120).fit("crop").url()
    : null;

  const currentModule = currentModuleIndex >= 0 ? modules[currentModuleIndex] : null;

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
      {/* ── Left Sidebar ────────────────────────────────────────────── */}
      <aside className="w-full lg:w-[340px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-6 lg:min-h-[calc(100vh-65px)] bg-[#FAF8F5]">
        {/* Back to course link */}
        <Link
          href={course ? `/courses/${course.slug}` : "/courses"}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to course</span>
        </Link>

        {/* Course info card */}
        {course && (
          <div className="flex items-center gap-3.5 mb-6 p-1">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm">
              {courseCoverUrl ? (
                <Image
                  src={courseCoverUrl}
                  alt={course.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold font-sans">
                  {course.title.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-[#0F172A] leading-snug truncate">
                {course.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F97316] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-[#64748B] font-medium">
                  {progressPercent}% complete
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Module summary header */}
        <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] uppercase tracking-wider py-2.5 border-t border-[#E2E8F0] mb-2">
          <span>
            {currentModuleIndex >= 0
              ? `Module ${currentModuleIndex + 1} of ${modules.length}`
              : `${modules.length} Modules`}
          </span>
          <ChevronDownIcon className="w-4 h-4 text-[#64748B]" />
        </div>

        {/* Modules accordion */}
        <div className="space-y-2">
          {modules.map((mod, mIdx) => {
            const isCurrentModule = mIdx === currentModuleIndex;
            const isExpanded = expandedModules.has(mod._key);
            const isCompleted = isModuleCompleted(mod.lessons);
            const moduleDuration =
              mod.lessons?.reduce((sum, l) => sum + (l.duration ?? 0), 0) ?? 0;

            return (
              <div
                key={mod._key}
                className="rounded-xl border border-transparent overflow-hidden transition-all"
              >
                {/* Module Header Button */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod._key)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                    isCurrentModule
                      ? "bg-white shadow-xs"
                      : "hover:bg-neutral-100/60"
                  }`}
                >
                  {/* Module number circle / checkmark */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full border border-[#16A34A] bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                    ) : isCurrentModule ? (
                      <div className="w-7 h-7 rounded-full bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                        {mIdx + 1}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-[#CBD5E1] text-[#64748B] text-xs font-semibold flex items-center justify-center bg-white">
                        {mIdx + 1}
                      </div>
                    )}
                  </div>

                  {/* Module Title & Duration */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-tight truncate ${
                        isCurrentModule
                          ? "font-bold text-[#0F172A]"
                          : "font-medium text-[#334155]"
                      }`}
                    >
                      {mod.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {formatDuration(moduleDuration)}
                    </p>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#64748B] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Lessons List */}
                {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                  <div className="pl-6 pr-2 py-2 space-y-1 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#E2E8F0]">
                    {mod.lessons.map((l) => {
                      const isCurrentLesson = l.slug === lesson.slug;
                      const isCompletedLesson = isLessonCompleted(l._id);

                      return (
                        <Link
                          key={l._id}
                          href={`/courses/${course?.slug}/lessons/${l.slug}`}
                          className={`relative flex items-center justify-between gap-2.5 py-2 pl-6 pr-3 rounded-lg text-xs transition-all ${
                            isCurrentLesson
                              ? "bg-white font-semibold text-[#0F172A] shadow-xs"
                              : "text-[#64748B] hover:text-[#0F172A] hover:bg-neutral-100/50"
                          }`}
                        >
                          {/* Dot / Indicator on left line */}
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                            {isCompletedLesson ? (
                              <div className="w-3.5 h-3.5 -ml-[3px] rounded-full bg-[#16A34A] flex items-center justify-center text-white shadow-xs">
                                <CheckCircleIcon className="w-2.5 h-2.5 stroke-[2.5]" />
                              </div>
                            ) : isCurrentLesson ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F97316] ring-4 ring-[#FFEDD5]" />
                            ) : (
                              <div className="w-2 h-2 rounded-full border border-[#CBD5E1] bg-white" />
                            )}
                          </div>

                          {/* Lesson title */}
                          <div className="flex-1 min-w-0 pr-2">
                            <span className={`truncate block ${isCompletedLesson && !isCurrentLesson ? "text-neutral-700" : ""}`}>
                              {l.title}
                            </span>
                            {isCurrentLesson && (
                              <span className="text-[10px] text-[#F97316] font-semibold block uppercase tracking-wider mt-0.5">
                                Now playing
                              </span>
                            )}
                          </div>

                          {/* Duration / Play Icon */}
                          <div className="flex-shrink-0 flex items-center gap-1.5">
                            {isCurrentLesson ? (
                              <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center text-white">
                                <PlayCircleIcon className="w-3.5 h-3.5 fill-current" />
                              </div>
                            ) : isCompletedLesson ? (
                              <span className="text-[11px] font-medium text-[#16A34A]">
                                Done
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#94A3B8]">
                                {formatDuration(l.duration ?? 0)}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>


      {/* ── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 bg-[#FAF8F5]">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link
            href="/courses"
            className="hover:text-[#F97316] transition-colors"
          >
            All Courses
          </Link>
          <ChevronRightIcon className="w-3 h-3 text-[#94A3B8]" />
          {course && (
            <>
              <Link
                href={`/courses/${course.slug}`}
                className="hover:text-[#F97316] transition-colors truncate max-w-[160px]"
              >
                {course.title}
              </Link>
              <ChevronRightIcon className="w-3 h-3 text-[#94A3B8]" />
            </>
          )}
          {currentModule && (
            <>
              <span className="truncate max-w-[180px]">
                {currentModule.title}
              </span>
              <ChevronRightIcon className="w-3 h-3 text-[#94A3B8]" />
            </>
          )}
          <span className="text-[#0F172A] font-medium truncate max-w-[200px]">
            {lesson.title}
          </span>
        </nav>

        {/* Lesson Header */}
        <div className="mb-6">
          {/* Badge & Actions Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#F97316] bg-[#FFEDD5] px-3 py-1 rounded-md">
              Lesson {currentModuleIndex >= 0 ? `${currentModuleIndex + 1}.${currentLessonIndexInModule + 1}` : "1.1"}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleComplete}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                  isCurrentLessonCompleted
                    ? "bg-[#16A34A] text-white border-[#16A34A]"
                    : "bg-white border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1] hover:text-[#0F172A]"
                }`}
                title={isCurrentLessonCompleted ? "Completed! Click to unmark" : "Mark lesson as complete"}
              >
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>{isCurrentLessonCompleted ? "Completed" : "Mark Complete"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center transition-colors shadow-xs ${
                  isBookmarked ? "text-[#F97316]" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title={isBookmarked ? "Bookmarked" : "Bookmark this lesson"}
              >
                <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl md:text-[38px] font-bold text-[#0F172A] leading-tight tracking-tight mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {lesson.title}
          </h1>

          {/* Subtitle / summary */}
          {currentModule?.summary && (
            <p className="text-base text-[#64748B] max-w-[700px] leading-relaxed mb-4">
              {currentModule.summary}
            </p>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#94A3B8]" />
              <span>{formatDuration(lesson.duration ?? 0)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChartIcon className="w-4 h-4 text-[#94A3B8]" />
              <span>{capitalizeLevel(course?.level ?? null)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-4 h-4 text-[#94A3B8]" />
              <span>{formatStudentCount(lesson.studentCount ?? course?.studentCount ?? 0)} students</span>
            </div>
          </div>
        </div>

        {/* Video Player Container */}
        <div
          onPointerDown={triggerVideoPlay}
          className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg mb-8 relative border border-neutral-900"
        >
          {embedInfo?.embedUrl ? (
            <iframe
              src={embedInfo.embedUrl}
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-6 text-center">
              <PlayCircleIcon className="w-16 h-16 text-neutral-600 mb-3" />
              <p className="text-sm font-medium">Video preview is currently unavailable for this lesson.</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#E2E8F0] mb-8">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => handleTabChange("content")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "content"
                  ? "text-[#F97316] border-b-2 border-[#F97316]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Lesson Content
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("notes")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "notes"
                  ? "text-[#F97316] border-b-2 border-[#F97316]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Tab Body */}
        {activeTab === "content" ? (
          <div className="space-y-8 max-w-[850px]">
            {/* Overview & Portable Text */}
            <div>
              <h2
                className="text-2xl font-bold text-[#0F172A] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Overview
              </h2>
              {lesson.notes && lesson.notes.length > 0 ? (
                <LessonPortableText value={lesson.notes} />
              ) : (
                <p className="text-base text-[#64748B] leading-relaxed">
                  In this lesson, you will explore the foundational concepts and practical techniques required to master this topic. Follow along with the code and resources below.
                </p>
              )}
            </div>

            {/* In this lesson you will */}
            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
              <div className="pt-2">
                <h3 className="text-base font-bold text-[#0F172A] mb-4">
                  In this lesson you will:
                </h3>
                <ul className="space-y-3">
                  {lesson.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 text-[#F97316]">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <span className="text-sm md:text-base text-[#334155] leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pro Tip Card */}
            {lesson.proTip && (
              <div className="rounded-2xl bg-[#FFF9F5] border border-[#FED7AA] p-5 md:p-6 flex items-start gap-4 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#FFEDD5] flex items-center justify-center text-[#F97316] flex-shrink-0 mt-0.5">
                  <LightbulbIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {lesson.proTip}
                  </p>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div className="pt-4">
                <h3
                  className="text-xl font-bold text-[#0F172A] mb-4"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lesson.resources.map((resource) => {
                    const isRepo = resource.type === "repo";
                    const isDoc = resource.type === "docs" || resource.type === "article";

                    return (
                      <a
                        key={resource._key}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#F97316] transition-colors mb-3">
                            {isRepo ? (
                              <GithubIcon className="w-4 h-4" />
                            ) : isDoc ? (
                              <DocumentIcon className="w-4 h-4" />
                            ) : (
                              <LinkIcon className="w-4 h-4" />
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#F97316] transition-colors leading-snug">
                            {resource.title}
                          </h4>
                          {resource.description && (
                            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-end mt-4 text-[#94A3B8] group-hover:text-[#F97316] transition-colors">
                          <ExternalLinkIcon className="w-4 h-4" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Notes Tab (Presentational per AGENTS.md §7) */
          <div className="max-w-[700px] bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
              Personal Notes
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Your notes are private to you and saved in your local browser session.
            </p>
            <textarea
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Take notes as you watch the lesson..."
              rows={8}
              className="w-full p-4 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 resize-y"
            />
          </div>
        )}

        {/* ── Bottom Navigation Bar ──────────────────────────────────── */}
        <div className="border-t border-[#E2E8F0] pt-6 mt-14 flex items-center justify-between gap-4">
          {/* Previous Lesson */}
          {prevItem ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/courses/${course?.slug}/lessons/${prevItem.lesson.slug}`}
                onClick={() => {
                  trackLessonNavigated({
                    from_lesson_slug: lesson.slug,
                    to_lesson_slug: prevItem.lesson.slug,
                    direction: 'prev',
                    course_slug: course?.slug || '',
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] hover:bg-neutral-50 transition-colors shadow-xs"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Previous Lesson</span>
              </Link>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#0F172A] max-w-[200px] truncate">
                  {prevItem.lesson.title}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {formatDuration(prevItem.lesson.duration ?? 0)}
                </p>
              </div>
            </div>
          ) : (
            <div />
          )}

          {/* Next Lesson */}
          {nextItem ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-[#0F172A] max-w-[200px] truncate">
                  {nextItem.lesson.title}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {formatDuration(nextItem.lesson.duration ?? 0)}
                </p>
              </div>
              <Link
                href={`/courses/${course?.slug}/lessons/${nextItem.lesson.slug}`}
                onClick={() => {
                  trackLessonNavigated({
                    from_lesson_slug: lesson.slug,
                    to_lesson_slug: nextItem.lesson.slug,
                    direction: 'next',
                    course_slug: course?.slug || '',
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors shadow-xs"
              >
                <span>Next Lesson</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link
              href={course ? `/courses/${course.slug}` : "/courses"}
              onClick={() => {
                trackLessonCompleted({
                  lesson_id: lesson._id,
                  lesson_slug: lesson.slug,
                  lesson_title: lesson.title,
                  course_slug: course?.slug || '',
                  source: "navigation",
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors shadow-xs"
            >
              <span>Finish Course</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
