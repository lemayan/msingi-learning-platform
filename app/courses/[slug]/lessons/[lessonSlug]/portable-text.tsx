import React from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base text-neutral-600 leading-relaxed mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-2xl font-bold text-neutral-900 mt-8 mb-4"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-xl font-semibold text-neutral-900 mt-6 mb-3"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#F97316] pl-4 italic text-neutral-700 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 text-neutral-600 mb-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-neutral-100 text-neutral-800 text-xs px-1.5 py-0.5 rounded font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-[#F97316] hover:underline font-medium"
        >
          {children}
        </a>
      );
    },
  },
};

export function LessonPortableText({
  value,
}: {
  value: PortableTextBlock[] | null | undefined;
}) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }
  return <PortableText value={value} components={components} />;
}
