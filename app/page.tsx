import Link from "next/link";
import React from "react";
import { Navbar } from "./components/navbar";
import { SearchIcon, ArrowRightIcon, StarIcon } from "./components/icons";
import { fetchSanity } from "@/sanity/lib/fetch";
import { COURSES_QUERY } from "@/sanity/lib/queries";
import { CourseCard, CourseCardData } from "./components/course-card";

// --- Main Page ---
export default async function Home() {
  const { data } = await fetchSanity(COURSES_QUERY);
  console.log("HOMEPAGE FETCH RESULT:", data);
  const courses = (data as CourseCardData[] | null) ?? [];
  const topCourses = courses.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 2. Hero Section */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <div className="inline-flex items-center rounded-md border border-[#F97316]/20 bg-[#FFEDD5]/50 px-3 py-1.5 mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#F97316]">Intelligent Learning</span>
        </div>
        
        <h1 className="text-5xl md:text-[64px] font-bold text-[#0F172A] leading-[1.05] tracking-tight mb-6 max-w-[800px]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Search your learning<br />in plain English.
        </h1>
        
        <p className="text-base md:text-lg text-[#64748B] max-w-[500px] mb-10 leading-relaxed">
          Msingi understands what you want to learn and<br className="hidden md:block" /> finds the exact lessons across all your courses.
        </p>
        
        <Link href="/courses" className="inline-flex items-center justify-center rounded-xl bg-[#F97316] hover:bg-[#EA580C] transition-colors px-8 py-4 text-base font-medium text-white mb-16 shadow-sm">
          Explore Courses
          <ArrowRightIcon className="ml-2" />
        </Link>
        
        <div className="w-full max-w-[640px] relative shadow-md rounded-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-[#64748B]" />
          </div>
          <input 
            type="text" 
            placeholder="Ask anything about your learning..." 
            className="w-full h-14 pl-12 pr-16 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 text-[11px] font-medium text-[#64748B]">
              ⌘ K
            </div>
          </div>
        </div>
      </section>

      {/* 3. Course Catalog Strip */}
      <section className="max-w-[1440px] mx-auto px-6 py-16 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>All Courses</h2>
          <Link href="/courses" className="flex items-center text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors">
            View all courses
            <ArrowRightIcon className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* 4. New courses note */}
        <div className="flex items-center justify-center mt-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E2E8F0] -z-10 w-full"></div>
          <div className="bg-[#FAF8F5] px-5 flex items-center gap-2">
            <StarIcon className="text-[#F97316] w-5 h-5" />
            <span className="text-[#334155] text-sm">New courses and lessons added every week.</span>
          </div>
        </div>
      </section>

      {/* 5. Decorative bar chart */}
      <div className="w-full h-48 sm:h-56 relative overflow-hidden flex items-end justify-center mt-auto">
        {[
          15, 25, 40, 30, 55, 35, 75, 45, 65, 85, 60, 80, 40, 55, 30, 45, 20, 30, 15, 20, 10
        ].map((height, i) => (
          <div 
            key={i}
            className="flex-1 bg-gradient-to-t from-[#F97316]/40 via-[#F97316]/10 to-transparent"
            style={{ 
              height: `${height}%`,
              opacity: 1 - Math.abs(10 - i) * 0.08
            }}
          />
        ))}
      </div>
    </div>
  );
}
