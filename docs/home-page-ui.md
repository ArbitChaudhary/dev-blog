# Home Page UI — Design Plan & Implementation Prompt

> Scope: Public landing page for the dev-blog app.
> Stack: Next.js 16 (App Router, RSC), React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, lucide-react, AWS Amplify Gen 2, RTK Query.

---

## 1. Sections Overview

| #   | Section        | Rendering        | Content                                        |
| --- | -------------- | ---------------- | ---------------------------------------------- |
| 1   | Hero           | Client island    | Featured blogs in an animated auto-play slider |
| 2   | Latest         | Server Component | Grid of 4 latest blog cards                    |
| 3   | Trending       | Server Component | 4 trending posts (ranked list)                 |
| 4   | Newsletter CTA | Client island    | Email subscribe form                           |
| 5   | Footer         | Server Component | Brand, links, socials, copyright               |

---

## 2. Proposed File Structure

Follows the existing colocation convention (`_components` / `_common` / `_lib`).

```
src/app/(main)/(home)/
  page.tsx                    # Server Component: composes all sections
  _components/
    section-home.tsx          # top-level composer
    hero-slider.tsx           # "use client" — featured animated slider
    latest-section.tsx        # grid of 4 latest cards (server)
    trending-section.tsx      # 4 trending posts (server)
    trending-card.tsx         # compact ranked list item
    newsletter-cta.tsx        # "use client" — email form
    footer.tsx                # site footer
    home-blog-card.tsx        # shared card (extracted/reused from BlogCard)
  _common/
    api.ts                    # server-side data fetching (featured/latest/trending)
  _lib/
    mock-home-data.ts         # temporary mock data (Phase 1)
```

---

## 3. Section-by-Section Design

### 3.1 Hero — Featured + Animated Slider

- **Client Component** (needs timers/interactivity).
- Full-bleed section inside `max-w-7xl` container.
- Auto-advancing carousel of `BlogPost.featured === true`.
- Each slide: large cover image with gradient overlay, category `Badge`, title, excerpt, author `Avatar` + reading time, "Read Article" `Button`.
- Transitions via `tw-animate-css` (already imported) or `embla-carousel-react` for accessible swipe/keyboard/dots.
- Autoplay with pause-on-hover; respect `prefers-reduced-motion`.
- Prev/next arrows (`ChevronLeft` / `ChevronRight`) + dot indicators.

### 3.2 Latest — Grid of 4 Cards

- **Server Component**.
- Section heading ("Latest Posts") + "View all" link → `/blogs`.
- Responsive grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-4`.
- Reuse `home-blog-card` (refactor of profile `BlogCard`, no owner edit/delete footer).

### 3.3 Trending — 4 Trending Posts

- **Server Component**.
- Distinct treatment from Latest: **ranked list** numbered `01`–`04`.
- Each item: small thumbnail, title, metric (`Eye` views / `TrendingUp`).
- Sort: `viewCount` + `reactionCount`.

### 3.4 Newsletter CTA

- **Client Component** — email input + subscribe button.
- Maps to `NewsletterSubscription` model (guest `create`).
- Reuse `ControlledInput` + `ButtonLoading` with react-hook-form + zod (auth-form pattern).
- Accent background band (`bg-muted` / `bg-primary`) to separate from content.

### 3.5 Footer

- **Server Component**.
- Columns: brand/tagline, quick links (reuse `nav-links.ts`), socials (`Github` / `Twitter` / `Linkedin`), copyright.
- Consider promoting to `(main)/layout.tsx` for site-wide use.

---

## 4. Data Strategy (Phased)

1. **Phase 1 — UI first:** build with `_lib/mock-home-data.ts` mirroring the `BlogPost` shape (`featured`, `viewCount`, `reactionCount`, `coverImage`, etc.).
2. **Phase 2 — wiring:** replace mocks with Amplify data via **server-side fetching** (`generateClient` + cookies server client) in `_common/api.ts`:
   - `getFeaturedPosts()`
   - `getLatestPosts()`
   - `getTrendingPosts()`
   - Keep only the slider and newsletter form as client islands so the shell stays static/streamable (ISR).

---

## 5. Design Tokens & Consistency

- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Vertical rhythm: `py-12 md:py-20` per section.
- Use theme tokens (`bg-background`, `text-muted-foreground`, `border`) for automatic dark mode.
- Use `next/image` for covers (SEO/perf) instead of raw `<img>`.

---

## 6. Implementation Prompt

> Copy–paste the block below to drive the build.

```text
Build the public home page UI for this Next.js 16 App Router blog. Follow the
local Next.js 16 docs in node_modules/next/dist/docs/ before writing framework
code. Use Server Components by default and keep client interactivity to small
islands. Use Tailwind CSS v4 theme tokens, shadcn/ui primitives, lucide-react
icons, and next/image. Match the existing colocation convention
(_components / _common / _lib) used in the profile route.

Work in this route: src/app/(main)/(home)/

Phase 1 — Build the UI with mock data:

1. Create _lib/mock-home-data.ts exporting featured, latest, and trending
   arrays that mirror the BlogPost shape (id, title, excerpt, coverImage,
   category, author { name, avatarUrl }, publishDate, readingTime, viewCount,
   reactionCount, commentCount, bookmarkCount, featured).

2. Create _components/home-blog-card.tsx by extracting/refactoring the profile
   BlogCard (src/app/(main)/profile/_components/blog-card.tsx). Remove the owner
   edit/delete footer. Use next/image for the cover.

3. Create _components/hero-slider.tsx ("use client"): an accessible, auto-play
   carousel of featured posts. Large cover with gradient overlay, category
   Badge, title, excerpt, author Avatar + reading time, and a "Read Article"
   Button. Include prev/next arrows and dot indicators, pause-on-hover, and
   respect prefers-reduced-motion. Prefer embla-carousel-react if adding a dep.

4. Create _components/latest-section.tsx (server): heading "Latest Posts" with a
   "View all" link to /blogs, and a responsive grid
   (grid gap-6 sm:grid-cols-2 lg:grid-cols-4) of 4 home-blog-cards.

5. Create _components/trending-section.tsx (server) + _components/trending-card.tsx:
   a ranked list numbered 01–04 with thumbnail, title, and a views/trending
   metric. Sort by viewCount + reactionCount.

6. Create _components/newsletter-cta.tsx ("use client"): an email subscribe form
   using react-hook-form + zod, reusing ControlledInput and ButtonLoading. Style
   it as an accent band. Wire the submit handler as a stub for now.

7. Create _components/footer.tsx (server): brand/tagline, quick links (reuse
   nav-links.ts), social links, and copyright.

8. Update _components/section-home.tsx to compose the sections in order:
   HeroSlider, LatestSection, TrendingSection, NewsletterCta, Footer. Use
   container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 and py-12 md:py-20 rhythm.

Constraints:
- No console errors; strict TypeScript; pass lint.
- Fully responsive and dark-mode correct via theme tokens.
- Do not fetch real data yet; keep everything from mock-home-data.ts.

Phase 2 — Wiring (do only when asked):
- Add getFeaturedPosts / getLatestPosts / getTrendingPosts to _common/api.ts
  using a server Amplify client, and replace mock imports in the server sections.
- Keep the hero slider and newsletter form as the only client islands so the
  page shell stays static with ISR.
```

```

```
