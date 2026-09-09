# Implement Vertex Design System as Msingi Design System

## Goal
Faithfully implement the Vertex design system reference (`design/vertex-designsystem.png`) as a **living, browsable design system page** at `/` in the Next.js app. Every token, component, and pattern in the reference is reproduced exactly — colors, typography, spacing, radii, shadows, icons, buttons, inputs, badges, cards, progress bar, navigation, and principles. The only change: all instances of "Vertex" become **"Msingi"** and the Vertex triangle logo is replaced with an **"M"** monogram mark in the same orange primary color.

## Skills Referenced
- Next.js App Router (`node_modules/next/dist/docs/`) — layout, page, font loading
- Tailwind CSS v4 — all styling via CSS custom properties and utility classes

## Code Inspected
- `app/layout.tsx` — uses Geist fonts; needs to be updated to load **Playfair Display** and **Inter** from Google Fonts
- `app/globals.css` — Tailwind v4 `@import "tailwindcss"` + `@theme inline` block; token definitions go here
- `app/page.tsx` — currently the default Next.js starter; will become the design system showcase
- `next.config.ts` — no changes needed
- `package.json` — Next.js 16.3.4, React 19, Tailwind v4, TypeScript; no new packages needed

## Decisions & Assumptions
- The design system page lives at `/` (replaces the starter page).
- Fonts: Playfair Display (headings/display) + Inter (body/UI) — loaded via `next/font/google` in layout.tsx. Geist/Geist Mono are removed.
- All design tokens are defined in `globals.css` under `@theme inline`.
- The "Vertex" triangle logo is replaced with a simple SVG "M" lettermark using Primary 500 (#F97316).
- Icon grid (section 06) — rendered as simple inline SVGs matching outline and filled styles shown.
- Cards (section 12) — the "N" avatar in the Course Card becomes "M".
- Navigation (section 13) — "Vertex" label replaced with "Msingi" and triangle icon replaced with M monogram.
- No dark mode; the design reference is light-mode only.

## Files to Touch

### [MODIFY] `app/layout.tsx`
- Replace Geist fonts with Playfair Display + Inter via `next/font/google`
- Update metadata title to "Msingi Design System"
- Pass font CSS variables to `<html>`

### [MODIFY] `app/globals.css`
- Define all color tokens (Primary 100-500, Neutral 50-900, White)
- Define shadow tokens (sm, md, lg, xl)
- Set `font-family: var(--font-inter)` on body

### [MODIFY] `app/page.tsx`
- Full design system showcase with all 14 sections matching the reference
- All "Vertex" text replaced with "Msingi"

## Acceptance Criteria
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` succeeds
- [ ] Page at `http://localhost:3000` matches the reference image with Msingi branding
- [ ] All 14 sections render correctly
- [ ] Fonts load: Playfair Display and Inter
- [ ] No "Vertex" text anywhere on the page
