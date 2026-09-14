import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/app/components/navbar";
import { ArrowRightIcon } from "@/app/components/icons";

export const metadata: Metadata = {
  title: "My Learning — Msingi",
};

/**
 * My Learning — presentational surface (AGENTS.md §7).
 * Learner progress has no backend yet, so this shows an empty state that
 * points to the catalog instead of inventing progress data.
 */
export default function MyLearningPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-12">
        <h1
          className="mb-2 text-3xl font-bold text-neutral-900 md:text-4xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          My Learning
        </h1>
        <p className="mb-10 text-sm text-neutral-500">
          Your courses and progress will appear here.
        </p>

        <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            You have not started a course yet
          </h2>
          <p className="mb-8 max-w-md text-sm text-neutral-500">
            Explore the catalog and start a lesson to begin tracking your
            learning.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Browse courses
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
