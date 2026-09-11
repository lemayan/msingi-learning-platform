"use client";

import { useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

interface Resource {
  _key: string;
  type: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
}

interface LessonTabsProps {
  courseSlug: string;
  lessonSlug: string;
  notes: PortableTextBlock[] | null;
  keyPoints: string[] | null;
  proTip: string | null;
  resources: Resource[] | null;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-sm leading-relaxed text-neutral-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="mb-3 mt-6 text-lg font-semibold text-neutral-900">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mb-2 mt-5 text-base font-semibold text-neutral-900">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mb-2 mt-4 text-sm font-semibold text-neutral-900">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-primary-300 pl-4 text-sm italic text-neutral-500">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-neutral-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-neutral-700">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-900">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-primary-500 underline underline-offset-2 hover:text-[#EA580C]"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <Image
          src={urlFor(value).width(720).url()}
          alt={value.alt ?? ""}
          width={720}
          height={405}
          className="my-4 h-auto w-full rounded-lg"
        />
      ) : null,
  },
};

export function LessonTabs({
  courseSlug,
  lessonSlug,
  notes,
  keyPoints,
  proTip,
  resources,
}: LessonTabsProps) {
  const [tab, setTab] = useState<"content" | "notes">("content");

  const selectTab = (next: "content" | "notes") => {
    if (next === tab) return;
    setTab(next);
    posthog.capture("lesson_tab_selected", {
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      tab: next,
    });
  };

  const tabClass = (value: "content" | "notes") =>
    `pb-2 text-sm font-medium transition-colors ${
      tab === value
        ? "border-b-2 border-primary-500 text-primary-500"
        : "text-neutral-500 hover:text-neutral-700"
    }`;

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex items-center gap-6 border-b border-neutral-200">
        <button
          type="button"
          onClick={() => selectTab("content")}
          className={tabClass("content")}
        >
          Lesson Content
        </button>
        <button
          type="button"
          onClick={() => selectTab("notes")}
          className={tabClass("notes")}
        >
          Notes
        </button>
      </div>

      {tab === "content" ? (
        <div>
          {notes && notes.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-base font-semibold text-neutral-900">
                Overview
              </h2>
              <PortableText
                value={notes}
                components={portableTextComponents}
              />
            </section>
          )}

          {keyPoints && keyPoints.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-base font-semibold text-neutral-900">
                In this lesson you will:
              </h2>
              <ul className="space-y-3">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11.5 14.5 16 9.5" />
                    </svg>
                    <span className="text-sm text-neutral-700">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {proTip && (
            <section className="mb-8">
              <div className="rounded-xl bg-primary-100 p-5">
                <div className="mb-1 flex items-center gap-2">
                  <span aria-hidden="true">💡</span>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Pro Tip
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700">
                  {proTip}
                </p>
              </div>
            </section>
          )}

          {resources && resources.length > 0 && (
            <section className="mb-4">
              <h2 className="mb-4 text-base font-semibold text-neutral-900">
                Resources
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {resources.map((resource) =>
                  resource.url ? (
                    <a
                      key={resource._key}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                    >
                      <span className="mb-1 text-sm font-semibold text-neutral-900">
                        {resource.title}
                      </span>
                      {resource.description && (
                        <span className="text-xs leading-relaxed text-neutral-500">
                          {resource.description}
                        </span>
                      )}
                    </a>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {!notes?.length &&
            !keyPoints?.length &&
            !proTip &&
            !resources?.length && (
              <p className="text-sm text-neutral-500">
                No lesson content yet.
              </p>
            )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            Your notes for this lesson will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
