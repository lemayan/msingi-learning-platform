import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import { ArrowRightIcon } from "@/app/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary-500">
          404
        </p>
        <h1
          className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          This page could not be found
        </h1>
        <p className="mb-8 max-w-md text-sm text-neutral-500">
          The page you are looking for does not exist or has moved. Browse the
          catalog to find your next lesson.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
        >
          Browse courses
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
