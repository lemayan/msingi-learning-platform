// Design token reference (matching vertex-designsystem.png with Msingi branding)
const colors = {
  primary: [
    { name: "Primary 500", hex: "#F97316" },
    { name: "Primary 400", hex: "#FB923C" },
    { name: "Primary 300", hex: "#FDBA74" },
    { name: "Primary 200", hex: "#FED7AA" },
    { name: "Primary 100", hex: "#FFEDD5" },
  ],
  neutral: [
    { name: "Neutral 900", hex: "#0F172A" },
    { name: "Neutral 700", hex: "#334155" },
    { name: "Neutral 500", hex: "#64748B" },
    { name: "Neutral 300", hex: "#CBD5E1" },
    { name: "Neutral 200", hex: "#E2E8F0" },
    { name: "Neutral 100", hex: "#F1F5F9" },
    { name: "Neutral 50", hex: "#F8FAFC" },
    { name: "White", hex: "#FFFFFF" },
  ],
};

// M-lettermark logo (replaces Vertex triangle)
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
        M
      </text>
    </svg>
  );
}

// Section header
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-semibold text-[#64748B] tracking-widest">{num}</span>
      <span className="text-xs font-semibold tracking-widest uppercase text-[#0F172A]">{title}</span>
    </div>
  );
}

// Color swatch
function ColorSwatch({ name, hex, large }: { name: string; hex: string; large?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="rounded-lg border border-[#E2E8F0]"
        style={{ backgroundColor: hex, height: large ? 64 : 56, width: large ? 96 : 80 }}
      />
      <p className="text-[11px] font-medium text-[#0F172A] leading-tight">{name}</p>
      <p className="text-[11px] text-[#64748B] leading-tight">{hex}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* ─── Top Section: Header + Colors ─── */}
      <div className="max-w-[1200px] mx-auto px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">

          {/* Left: Logo + Title */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MsingiLogo size={28} />
              <span className="text-xl font-bold text-[#0F172A]">Msingi</span>
            </div>
            <h1
              className="text-[52px] font-bold text-[#0F172A] leading-[1.1] mb-5"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Design System
            </h1>
            <p className="text-[#64748B] text-base leading-7 max-w-xs">
              A unified design language for Msingi learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
            </p>
            <p className="mt-6 text-xs text-[#64748B] tracking-wide">VERSION 1.0 · MAY 2025</p>
          </div>

          {/* Right: Colors */}
          <div>
            <SectionLabel num="01" title="Colors" />
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Primary</p>
            <div className="flex flex-wrap gap-4 mb-6">
              {colors.primary.map((c) => (
                <ColorSwatch key={c.hex} name={c.name} hex={c.hex} large />
              ))}
            </div>
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Neutral</p>
            <div className="flex flex-wrap gap-4">
              {colors.neutral.map((c) => (
                <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 02 Typography + 03 Type Scale ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
          <div>
            <SectionLabel num="02" title="Typography" />
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="text-[72px] font-bold text-[#0F172A] leading-none mb-1"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Ag
                </p>
                <p className="font-semibold text-sm text-[#0F172A] mb-0.5" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Playfair Display</p>
                <p className="text-xs text-[#64748B]">Elegant · Readable · Timeless</p>
              </div>
              <div>
                <p className="text-[72px] font-bold text-[#0F172A] leading-none mb-1">Ag</p>
                <p className="font-semibold text-sm text-[#0F172A] mb-0.5">Inter</p>
                <p className="text-xs text-[#64748B]">Clean · Modern · Highly legible</p>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel num="03" title="Type Scale" />
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-[#E2E8F0]">
                  <th className="pb-2 text-xs font-semibold text-[#64748B] pr-6">Style</th>
                  <th className="pb-2 text-xs font-semibold text-[#64748B] pr-6">Font</th>
                  <th className="pb-2 text-xs font-semibold text-[#64748B] pr-6">Size / Line Height</th>
                  <th className="pb-2 text-xs font-semibold text-[#64748B] pr-6">Weight</th>
                  <th className="pb-2 text-xs font-semibold text-[#64748B]">Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
                  ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
                  ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
                  ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
                  ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
                  ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
                  ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
                  ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
                ].map(([style, font, size, weight, use]) => (
                  <tr key={style} className="border-b border-[#E2E8F0]">
                    <td className="py-2.5 pr-6 text-sm font-semibold text-[#0F172A]">{style}</td>
                    <td className="py-2.5 pr-6 text-sm text-[#64748B]">{font}</td>
                    <td className="py-2.5 pr-6 text-sm text-[#64748B]">{size}</td>
                    <td className="py-2.5 pr-6 text-sm text-[#64748B]">{weight}</td>
                    <td className="py-2.5 text-sm text-[#64748B]">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 04 Spacing + 05 Radius & Shadows ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel num="04" title="Spacing System" />
            <p className="text-xs text-[#64748B] mb-4">Base unit: 4px</p>
            <div className="flex items-end gap-3 flex-wrap">
              {[
                { px: 4, rem: "0.25rem", label: "4" },
                { px: 8, rem: "0.5rem", label: "8" },
                { px: 12, rem: "0.75rem", label: "12" },
                { px: 16, rem: "1rem", label: "16" },
                { px: 24, rem: "1.5rem", label: "24" },
                { px: 32, rem: "2rem", label: "32" },
                { px: 40, rem: "2.5rem", label: "40" },
                { px: 48, rem: "3rem", label: "48" },
                { px: 64, rem: "4rem", label: "64" },
              ].map(({ px, rem, label }) => (
                <div key={px} className="flex flex-col items-center gap-1.5">
                  <div
                    className="bg-[#FDBA74]"
                    style={{ width: px, height: px }}
                  />
                  <p className="text-[10px] text-[#0F172A] font-medium">{label}</p>
                  <p className="text-[10px] text-[#64748B]">({rem})</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel num="05" title="Radius & Shadows" />
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Radius</p>
            <div className="flex gap-4 flex-wrap mb-6">
              {[
                { label: "4px", sub: "(xs)", r: "4px" },
                { label: "8px", sub: "(sm)", r: "8px" },
                { label: "12px", sub: "(md)", r: "12px" },
                { label: "16px", sub: "(lg)", r: "16px" },
                { label: "24px", sub: "(xl)", r: "24px" },
                { label: "Full", sub: "(circle)", r: "9999px" },
              ].map(({ label, sub, r }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 border-2 border-[#0F172A] bg-white"
                    style={{ borderRadius: r }}
                  />
                  <p className="text-[10px] text-[#0F172A] font-medium">{label}</p>
                  <p className="text-[10px] text-[#64748B]">{sub}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Shadows</p>
            <div className="flex gap-5 flex-wrap">
              {[
                { label: "Sm", value: "0 1px 2px 0 rgba(15,23,42,0.05)" },
                { label: "Md", value: "0 4px 12px -2px rgba(15,23,42,0.08)" },
                { label: "Lg", value: "0 12px 24px -4px rgba(15,23,42,0.10)" },
                { label: "Xl", value: "0 20px 40px -8px rgba(15,23,42,0.12)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-2">
                  <div
                    className="w-20 h-12 bg-white rounded-lg"
                    style={{ boxShadow: value }}
                  />
                  <p className="text-[11px] font-semibold text-[#0F172A]">{label}</p>
                  <p className="text-[10px] text-[#64748B] max-w-[90px] leading-tight">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 06 Icons + 07 Buttons + 08 Inputs ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Icons */}
          <div>
            <SectionLabel num="06" title="Icons" />
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Outline Style</p>
            <div className="flex gap-3 mb-4 flex-wrap">
              {/* Bell */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              {/* Search */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              {/* Play */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
              {/* Document */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              {/* Bookmark */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
              {/* Chart */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
              {/* Clock */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              {/* User */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              {/* Chevron */}
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </div>
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Filled Style</p>
            <div className="flex gap-3 mb-5 flex-wrap">
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" /><path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-6.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" /></svg>
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="text-[11px] font-semibold text-[#0F172A]">Icon Specs</p>
              {["24×24px grid", "2px stroke width (outline)", "Rounded line caps", "Consistent optical balance"].map(s => (
                <p key={s} className="text-[11px] text-[#64748B]">· {s}</p>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div>
            <SectionLabel num="07" title="Buttons" />
            <div className="overflow-x-auto">
              <table className="text-sm w-full min-w-[300px]">
                <thead>
                  <tr>
                    <td className="pr-4 pb-2 text-xs text-[#64748B]" />
                    <td className="pr-4 pb-2 text-xs font-semibold text-[#0F172A]">Primary</td>
                    <td className="pr-4 pb-2 text-xs font-semibold text-[#0F172A]">Secondary</td>
                    <td className="pr-4 pb-2 text-xs font-semibold text-[#0F172A]">Tertiary</td>
                    <td className="pb-2 text-xs font-semibold text-[#0F172A]">Text</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-4 py-2 text-xs text-[#64748B] font-medium whitespace-nowrap">Default</td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 rounded-xl bg-[#F97316] text-white text-xs font-medium whitespace-nowrap">Get Started</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 rounded-xl border border-[#F97316] text-[#F97316] text-xs font-medium whitespace-nowrap">Explore Courses</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 text-[#0F172A] text-xs font-medium whitespace-nowrap flex items-center gap-1">View Lesson <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></button>
                    </td>
                    <td className="py-2">
                      <button className="text-[#F97316] text-xs font-medium flex items-center gap-1 whitespace-nowrap">Watch Video <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-xs text-[#64748B] font-medium">Hover</td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 rounded-xl bg-[#EA6A00] text-white text-xs font-medium whitespace-nowrap">Get Started</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 rounded-xl border border-[#EA6A00] text-[#EA6A00] bg-[#FFEDD5] text-xs font-medium whitespace-nowrap">Explore Courses</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button className="px-4 h-9 text-[#0F172A] text-xs font-medium whitespace-nowrap flex items-center gap-1 underline">View Lesson <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></button>
                    </td>
                    <td className="py-2">
                      <button className="text-[#EA6A00] text-xs font-medium flex items-center gap-1 whitespace-nowrap">Watch Video <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-xs text-[#64748B] font-medium">Disabled</td>
                    <td className="pr-4 py-2">
                      <button disabled className="px-4 h-9 rounded-xl bg-[#FDBA74] text-white text-xs font-medium whitespace-nowrap opacity-60 cursor-not-allowed">Get Started</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button disabled className="px-4 h-9 rounded-xl border border-[#FDBA74] text-[#FDBA74] text-xs font-medium whitespace-nowrap opacity-60 cursor-not-allowed">Explore Courses</button>
                    </td>
                    <td className="pr-4 py-2">
                      <button disabled className="px-4 h-9 text-[#CBD5E1] text-xs font-medium whitespace-nowrap flex items-center gap-1 cursor-not-allowed">View Lesson <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></button>
                    </td>
                    <td className="py-2">
                      <button disabled className="text-[#CBD5E1] text-xs font-medium flex items-center gap-1 whitespace-nowrap cursor-not-allowed">Watch Video <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-0.5">
              <p className="text-[11px] font-semibold text-[#0F172A]">Button Specs</p>
              {["Height: 44px (default)", "Padding: 0 16px (lg), 0 12px (md)", "Radius: 12px", "Font: Inter Medium (14–16px)"].map(s => (
                <p key={s} className="text-[11px] text-[#64748B]">· {s}</p>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div>
            <SectionLabel num="08" title="Inputs" />
            <p className="text-xs font-semibold text-[#0F172A] mb-2">Search / Text Input</p>
            <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-xl px-3 h-11 mb-4 bg-white">
              <svg className="w-4 h-4 text-[#64748B] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <span className="text-sm text-[#CBD5E1] flex-1">Search anything...</span>
              <span className="text-[11px] text-[#CBD5E1] border border-[#E2E8F0] rounded px-1.5 py-0.5">⌘ K</span>
            </div>
            <p className="text-xs font-semibold text-[#0F172A] mb-2">Select</p>
            <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-3 h-11 mb-4 bg-white">
              <span className="text-sm text-[#0F172A]">Most Relevant</span>
              <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-[#0F172A]">Field Specs</p>
              {["Height: 44px", "Radius: 12px", "Border: 1px solid #E2E8F0", "Padding: 0 16px", "Focus: Border color #FB923C"].map(s => (
                <p key={s} className="text-[11px] text-[#64748B]">· {s}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 09 Badges + 10 Status + 11 Progress ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Badges */}
          <div>
            <SectionLabel num="09" title="Badges / Tags" />
            <div className="flex gap-3 flex-wrap">
              <div>
                <p className="text-xs text-[#64748B] mb-1.5">Video</p>
                <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">VIDEO</span>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1.5">Lesson</p>
                <span className="inline-block bg-[#3B82F6] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">LESSON</span>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1.5">Popular</p>
                <span className="inline-block bg-[#22C55E] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">POPULAR</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <SectionLabel num="10" title="Status / Indicators" />
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span className="text-xs text-[#0F172A]">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                <span className="text-xs text-[#0F172A]">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#F97316]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                <span className="text-xs text-[#0F172A]">Now Playing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#64748B]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" /></svg>
                <span className="text-xs text-[#0F172A]">Locked</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <SectionLabel num="11" title="Progress Bar" />
            <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 mb-1.5">
              <div className="bg-[#F97316] h-2.5 rounded-full" style={{ width: "35%" }} />
            </div>
            <p className="text-xs text-[#64748B]">35% complete</p>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 12 Cards ─── */}
        <div>
          <SectionLabel num="12" title="Cards" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Course Card */}
            <div>
              <p className="text-xs font-semibold text-[#0F172A] mb-2">Course Card</p>
              <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.05)" }}>
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white font-bold text-lg mb-3">M</div>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">Next.js for Production</p>
                <p className="text-xs text-[#64748B] mb-4 leading-5">Build scalable, high-performance web applications with Next.js.</p>
                <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" /></svg> Intermediate</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> 18h 24m</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg> 12 modules</span>
                </div>
              </div>
            </div>

            {/* Lesson Card (Video) */}
            <div>
              <p className="text-xs font-semibold text-[#0F172A] mb-2">Lesson Card (Video)</p>
              <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.05)" }}>
                <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-3">VIDEO</span>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">Data Fetching in Server Components</p>
                <p className="text-xs text-[#64748B] mb-4 leading-5">Learn how to fetch data on the server using async/await and Next.js best practices.</p>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>Lesson 5.1 · 12:45</span>
                  <button className="flex items-center gap-1 text-[#F97316] font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                    Watch from 12:45
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Card (Lesson) */}
            <div>
              <p className="text-xs font-semibold text-[#0F172A] mb-2">Lesson Card (Lesson)</p>
              <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.05)" }}>
                <span className="inline-block bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-3">LESSON</span>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">Data Fetching &amp; Caching</p>
                <p className="text-xs text-[#64748B] mb-4 leading-5">Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.</p>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>Module 5</span>
                  <button className="flex items-center gap-1 text-[#F97316] font-medium">
                    View lesson
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card */}
            <div>
              <p className="text-xs font-semibold text-[#0F172A] mb-2">Resource Card</p>
              <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.05)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] mb-1">Caching and Revalidation Guide</p>
                      <p className="text-xs text-[#64748B] leading-5">Deep dive into Next.js caching strategies.</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </div>
                <p className="text-xs text-[#64748B] mt-3">PDF · 1.2 MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] my-10" />

        {/* ─── 13 Navigation ─── */}
        <div>
          <SectionLabel num="13" title="Navigation" />
          <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-white mb-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Nav bar */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MsingiLogo size={22} />
                <span className="font-semibold text-[#0F172A] text-sm">Msingi</span>
              </div>
              <nav className="flex items-center gap-4">
                <a href="#" className="text-sm font-semibold text-[#F97316] border-b-2 border-[#F97316] pb-0.5">Courses</a>
                <a href="#" className="text-sm text-[#64748B]">My Learning</a>
              </nav>
            </div>
            {/* Breadcrumbs */}
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-1.5">Breadcrumbs</p>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>All Courses</span>
                <span>›</span>
                <span>Next.js for Production</span>
                <span>›</span>
                <span className="text-[#0F172A] font-medium">Data Fetching and Caching</span>
              </div>
            </div>
            {/* Pagination */}
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-1.5">Pagination</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-xs text-[#64748B]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <button className="w-7 h-7 rounded-lg bg-[#0F172A] text-white text-xs font-medium">1</button>
                <button className="w-7 h-7 rounded-lg text-xs text-[#64748B]">2</button>
                <button className="w-7 h-7 rounded-lg text-xs text-[#64748B]">3</button>
                <span className="text-[#64748B] text-xs px-1">…</span>
                <button className="w-7 h-7 rounded-lg text-xs text-[#64748B]">8</button>
                <button className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-xs text-[#64748B]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 14 Principles ─── */}
        <div>
          <SectionLabel num="14" title="Principles" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                ),
                title: "Clarity First",
                desc: "Every element should communicate clearly.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                ),
                title: "Consistency",
                desc: "Use components and patterns consistently across the platform.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
                ),
                title: "Focus & Calm",
                desc: "Remove noise and help learners focus on what matters.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                ),
                title: "Accessible",
                desc: "Design with accessibility and inclusivity in mind.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-0.5">{title}</p>
                  <p className="text-xs text-[#64748B] leading-5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
