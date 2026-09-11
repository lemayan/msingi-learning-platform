import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { BellIcon } from "./icons";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md px-6 py-4 flex items-center justify-center border-b border-transparent">
      <div className="flex items-center justify-between w-full max-w-[1440px]">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center select-none"
            style={{ fontFamily: "var(--font-brand), system-ui, sans-serif" }}
          >
            <span className="text-3xl font-extrabold text-[#F97316] tracking-tight">
              M
            </span>
            <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              singi
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-[#0F172A]"
            >
              Courses
            </Link>
            <Link
              href="/my-learning"
              className="text-sm font-medium text-[#0F172A]"
            >
              My Learning
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#0F172A] hover:text-[#F97316] transition-colors">
            <BellIcon />
          </button>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-[#0F172A] hover:text-[#F97316]"
            >
              Sign In
            </Link>
          </Show>
          <Show when="signed-in">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex items-center justify-center">
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}
