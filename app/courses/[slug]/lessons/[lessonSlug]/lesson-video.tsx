"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { buildVideoEmbed } from "@/app/lib/video-embed";

interface LessonVideoProps {
  videoUrl: string | null;
  posterUrl: string | null;
  title: string;
  startSeconds: number;
  // Analytics context
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
  lessonLabel: string;
  isFreePreview: boolean;
}

export function LessonVideo({
  videoUrl,
  posterUrl,
  title,
  startSeconds,
  courseSlug,
  lessonId,
  lessonSlug,
  lessonLabel,
  isFreePreview,
}: LessonVideoProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    posthog.capture("lesson_viewed", {
      course_slug: courseSlug,
      lesson_id: lessonId,
      lesson_slug: lessonSlug,
      lesson_label: lessonLabel,
      is_free_preview: isFreePreview,
    });
    // Fire once per lesson mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const embed = buildVideoEmbed(videoUrl, { autoplay: true, startSeconds });

  const handlePlay = () => {
    if (!embed) return;
    setPlaying(true);
    posthog.capture("lesson_video_played", {
      course_slug: courseSlug,
      lesson_id: lessonId,
      lesson_slug: lessonSlug,
      lesson_label: lessonLabel,
      provider: embed.provider,
      start_seconds: startSeconds,
    });
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
      {playing && embed ? (
        <iframe
          src={embed.url}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 900px) 100vw, 640px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-light text-white/90">
                {title.charAt(0)}
              </span>
            </div>
          )}

          {embed ? (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`Play ${title}`}
              className="absolute inset-0 flex items-center justify-center bg-neutral-900/30 transition-colors hover:bg-neutral-900/40"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-105">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          ) : (
            <div className="absolute inset-x-0 bottom-0 bg-neutral-900/70 px-4 py-2 text-center text-xs font-medium text-white/80">
              Video unavailable
            </div>
          )}
        </>
      )}
    </div>
  );
}
