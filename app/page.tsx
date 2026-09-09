import Link from "next/link";
import React from "react";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';

// --- Icons ---
function MsingiLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#F97316" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui"
      >
        V
      </text>
    </svg>
  );
}



function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// --- Main Page ---
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md px-6 py-4 flex items-center justify-center border-b border-transparent">
        <div className="flex items-center justify-between w-full max-w-[1440px]">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center select-none" style={{ fontFamily: "var(--font-brand), system-ui, sans-serif" }}>
              <span className="text-3xl font-extrabold text-[#F97316] tracking-tight">M</span>
              <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">singi</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/courses" className="text-sm font-medium text-[#0F172A]">Courses</Link>
              <Link href="/my-learning" className="text-sm font-medium text-[#0F172A]">My Learning</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#0F172A] hover:text-[#F97316] transition-colors">
              <BellIcon />
            </button>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-[#0F172A] hover:text-[#F97316]">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-[#F97316] text-white px-4 py-2 rounded-full hover:bg-[#EA580C]">Sign Up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex items-center justify-center">
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      </nav>

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
          {/* Card 1 */}
          <div className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[14px] bg-[#0F172A] flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-3xl font-light font-sans tracking-tight">N</span>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Next.js for Production</h3>
            <p className="text-sm text-[#64748B] mb-8 flex-1 leading-relaxed">
              Build scalable, high-performance web applications with Next.js.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
              <div className="flex items-center gap-1.5"><BarChartIcon /> Intermediate</div>
              <div className="flex items-center gap-1.5"><ClockIcon /> 18h 24m</div>
              <div className="flex items-center gap-1.5"><DocumentIcon /> 12 modules</div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mb-6 flex items-center justify-start">
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Docker Essentials</h3>
            <p className="text-sm text-[#64748B] mb-8 flex-1 leading-relaxed">
              Containerize applications and streamline your development workflow.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
              <div className="flex items-center gap-1.5"><BarChartIcon /> Beginner</div>
              <div className="flex items-center gap-1.5"><ClockIcon /> 10h 12m</div>
              <div className="flex items-center gap-1.5"><DocumentIcon /> 8 modules</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[14px] bg-[#3178C6] flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-[22px] font-bold font-sans">TS</span>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">TypeScript Deep Dive</h3>
            <p className="text-sm text-[#64748B] mb-8 flex-1 leading-relaxed">
              Go beyond the basics and write safer, more expressive code.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
              <div className="flex items-center gap-1.5"><BarChartIcon /> Intermediate</div>
              <div className="flex items-center gap-1.5"><ClockIcon /> 14h 36m</div>
              <div className="flex items-center gap-1.5"><DocumentIcon /> 10 modules</div>
            </div>
          </div>
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
