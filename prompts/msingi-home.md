# Homepage — vertex-home.png

## Goal

Replace the placeholder `app/page.tsx` with the full homepage shown in `design/vertex-home.png`. The design is the source of truth. Reproduce layout, spacing, typography, color, and interactive states exactly. Make each section responsive down to mobile while keeping the desktop layout exact.

---

## Design reference analysis

### Colors (from existing design tokens)
| Token | Hex | Usage |
|---|---|---|
| `primary-500` | `#F97316` | CTA button, badge border, "View all courses" link, star icon |
| `primary-100` | `#FFEDD5` | Badge background |
| `neutral-900` | `#0F172A` | Headings, body text |
| `neutral-700` | `#334155` | Subheading body |
| `neutral-500` | `#64748B` | Muted text, meta labels |
| `neutral-300` | `#CBD5E1` | Card border |
| Page bg | `#F5EFE6` (warm cream) | Full page background — NOT in tokens yet, add as `--color-canvas` |

### Typography
- Hero heading: Playfair Display (serif), `~56–64px`, bold, `neutral-900`
- All other text: Inter (sans)
- Badge: uppercase, tracked, `primary-500`, `~11px`

### Sections (top to bottom)

#### 1. Navbar
- Left: Orange V-triangle logo SVG + "Msingi" wordmark
- Center: "Courses" and "My Learning" nav links (Inter, medium, `neutral-700`)
- Right: Bell icon (outline) + circular user avatar placeholder
- Background: same warm cream, no border, sticky

#### 2. Hero section
- Centered, max-w roughly 600px
- Pill badge: `INTELLIGENT LEARNING` — border `primary-500`, text `primary-500`, bg `primary-100`, rounded-full
- H1: "Search your learning\nin plain English." — Playfair Display serif, very large, black, tight leading
- Subtitle: Inter, `neutral-700`, centered, two lines
- CTA: `Explore Courses →` — solid `primary-500` bg, white text, rounded-xl, px-8 py-4
- Search bar: white card, rounded-xl, full width (max ~650px), shadow-md; left: magnifying glass icon + placeholder "Ask anything about your learning…"; right: `⌘ K` keyboard shortcut badge (neutral-100 bg, neutral-500 text, rounded-md)

#### 3. Course catalog strip
- Section header row: bold "All Courses" left + "View all courses →" right (`primary-500`)
- 3-column card grid (stack to 1 col on mobile)
- Each card: white bg, rounded-2xl, border `neutral-200`, shadow-sm, padding ~24px
  - Course icon: 64×64 rounded-xl image/placeholder
  - Title: Inter semibold ~18px, `neutral-900`
  - Summary: Inter regular ~14px, `neutral-700`, 2–3 lines
  - Footer row: 3 metadata chips — level icon + label, clock icon + duration, document icon + module count — all `neutral-500` small text
- Placeholder cards: Next.js for Production (dark N icon), Docker Essentials (Docker whale), TypeScript Deep Dive (TS blue badge)

#### 4. "New courses" note
- Centered, star icon (`primary-500` outline star) + "New courses and lessons added every week."

#### 5. Decorative bar chart
- Bottom of page: a row of orange bars (varying heights) fading out at the edges — purely decorative, `primary-300`/`primary-200` colors, clipped with overflow-hidden

---

## Skills read
- Next.js App Router patterns (node_modules/next/dist/docs/)
- Existing design tokens in `app/globals.css`

## Code inspected
- `app/layout.tsx` — Inter + Playfair Display fonts already loaded via `--font-inter` / `--font-playfair` CSS vars
- `app/globals.css` — full token set, Tailwind v4 `@theme inline`
- `app/design-system/page.tsx` — existing component patterns and token usage

---

## Files to touch

| File | Change |
|---|---|
| `app/globals.css` | Add `--color-canvas: #FBF9F6` to `@theme inline`; set `body` bg to `var(--color-canvas)` |
| `app/page.tsx` | Full replacement — homepage with Navbar, Hero, Courses, Footer decoration |
| `app/layout.tsx` | Update metadata title to "Msingi" |

No new packages needed. All components are inline in `page.tsx` (they are page-specific and not reused elsewhere yet).

---

## Requirements

1. Pixel-faithful reproduction of `design/vertex-home.png` at desktop widths.
2. Responsive: single-column layout on mobile, grid on ≥ lg.
3. Navbar is sticky (position sticky, top-0, z-index 50).
4. Search bar is presentational only (no wiring) — clicking or pressing ⌘K does nothing yet.
5. "Explore Courses" button links to `/courses` (not wired, page doesn't exist yet — use `href="/courses"`).
6. "View all courses" link also points to `/courses`.
7. Course cards are static placeholder data (no Sanity query yet).
8. The bar chart decoration is a pure SVG or div-based visual, no JavaScript.
9. No new npm packages.
10. TypeScript strict — no `any`.

---

## Security considerations
- No user data, no auth surface on this page — not applicable.

---

## Acceptance criteria
- [ ] Page background is warm cream, not white.
- [ ] Navbar shows Msingi logo, two nav links, bell + avatar.
- [ ] Hero heading is Playfair Display serif, large and centered.
- [ ] "INTELLIGENT LEARNING" badge has orange border and text on lighter orange bg.
- [ ] Search bar is a white card with magnifying glass + ⌘K hint.
- [ ] "All Courses" section shows 3 cards with icon, title, summary, metadata row.
- [ ] "New courses and lessons added every week." note appears below the cards.
- [ ] Decorative orange bars appear at the bottom.
- [ ] Layout is responsive (test at 375px and 1280px).
- [ ] `next build` passes with no type errors.

---

## Checks to run
```bash
# From repo root (web workspace)
npx tsc --noEmit
npx next build
```

---

## Manual test steps
1. `npm run dev`
2. Open http://localhost:3000
3. Verify warm cream background, navbar, hero, cards, decoration match the reference image.
4. Resize to 375px — cards stack to single column, hero text wraps cleanly.
5. Hover "Explore Courses" — should darken slightly (hover state).
