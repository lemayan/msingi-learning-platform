import React from "react";
import { Navbar } from "@/app/components/navbar";
import { fetchSanity } from "@/sanity/lib/fetch";
import { COURSES_QUERY } from "@/sanity/lib/queries";
import { CourseCard, CourseCardData } from "@/app/components/course-card";
import { CatalogViewTracker } from "./catalog-view-tracker";

export default async function AllCoursesPage() {
  const { data } = await fetchSanity(COURSES_QUERY);
  const courses = (data as CourseCardData[] | null) ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <CatalogViewTracker totalCourses={courses.length} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold text-[#0F172A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            All Courses
          </h1>
          <p className="text-[#64748B] text-lg max-w-[600px] leading-relaxed">
            Explore our complete catalog of deep-dive courses. From frontend performance to backend architecture, learn by building.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20 text-[#64748B]">
            No courses found.
          </div>
        )}
      </main>
    </div>
  );
}
