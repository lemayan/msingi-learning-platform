import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#F97316" />
          <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui">M</text>
        </svg>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          Msingi
        </h1>
        <p className="text-sm text-[#64748B]">AI-powered learning platform</p>
        <Link
          href="/design-system"
          className="mt-4 px-5 h-10 rounded-xl bg-[#F97316] text-white text-sm font-medium flex items-center"
        >
          View Design System →
        </Link>
      </div>
    </div>
  );
}
