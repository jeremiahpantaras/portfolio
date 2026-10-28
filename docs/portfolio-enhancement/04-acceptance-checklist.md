# 04 — Acceptance Checklist

> The redesign is complete only when every box is checked.
> Measure on the production build (`npm run build && npm run preview`) unless a line says otherwise.
> Lighthouse runs use Chrome DevTools with the default mobile profile, unless "desktop" is stated.
> Record the measured values next to each item in the final PR.

## A. Content integrity
- [ ] All content renders from `src/data/*` (one source). There are no duplicate hard-coded copies (`grep -rn "Orki - Board" src` → 1 file).
- [ ] Item counts match the audit, or `decisions.md`:
  - 16 projects (or the approved list);
  - 7 workshops;
  - 3 certifications plus the conference;
  - 23 gallery photos;
  - 20 creative photos;
  - 6 About story blocks;
  - every tech-stack item from `TechStacks.jsx`.
- [ ] Every ⚠ conflict in doc 00 §3 is resolved as recorded in `decisions.md`: COS Devs title, graduation/age, GitHub account, website URL, the thesis "current" flag, and Mediabox.
- [ ] No invented facts. There are no metrics, years, clients, testimonials, ratings or percentages that don't exist in the repo or `decisions.md`.
- [ ] Every rewritten string has owner approval (hero value proposition, statement, 404 copy).
- [ ] All links from doc 00 §3.2 and §3.6 resolve correctly from the UI (click-test each one). External links use `target="_blank" rel="noopener noreferrer"`.
- [ ] Existing functions still work:
  - CV modal: view and download `/Resume.pdf`;
  - creative resume PDF;
  - AI chat;
  - image modal with download;
  - `mailto:` links;
  - Vercel Analytics and Speed Insights mounted.

## B. Design system
- [ ] Every page is dark: no light surfaces, no theme toggle, no `localStorage.theme` logic, and no flash of light content on hard reload.
- [ ] Colors come only from the doc 01 §2 tokens. `grep -rnE "#[0-9a-fA-F]{3,6}" src --include=*.jsx` returns only shader and vendored files, or files with documented exceptions.
- [ ] Fonts: Geist and Geist Mono (or the approved replacements) load with `display=swap`, and Raleway and Poppins are gone.
- [ ] The type scale tokens from doc 01 §3 are used for all headings and body text.
- [ ] Layout works from 360 px to 1920 px with no horizontal scroll (`document.documentElement.scrollWidth === window.innerWidth` at 360, 390, 768, 1024, 1440 and 1920).
- [ ] No glassmorphism, glow shadows or decorative gradients outside the depth tint and the shader.

## C. Navigation and structure
- [ ] Fixed nav on every main-site route, with an active-section indicator on `/` and a working mobile menu (dialog, focus trap, Esc, focus return).
- [ ] All 10 existing routes load directly by URL (Vercel rewrite), and an unknown URL renders the 404 page.
- [ ] Internal navigation uses client-side routing, so there are no full page reloads between main-site routes.
- [ ] One `<h1>` per page, a logical heading order, and landmarks (`header`, `nav`, `main`, `footer`).

## D. Hero, 3D and motion
- [ ] The hero shows the real name, title and location, plus the approved value proposition and the 3 CTAs, all working.
- [ ] The hero entrance completes in ≤ 2.0 s and never blocks interaction.
- [ ] 3D drop:
  - pointer rotation is ≤ ±15° and parallax ≤ ±0.12 units;
  - smooth damping, no jitter;
  - idle state after 3 s;
  - touch devices get idle and scroll coupling only;
  - clicks pass through to the CTAs.
- [ ] The poster renders (with no console errors) in all of these cases: reduced motion, WebGL disabled, Save-Data, viewport < 768 px (unless approved otherwise), context loss, and the slow-frame guard.
- [ ] The canvas stops rendering when the hero is off-screen or the tab is hidden (verify in the Performance panel).
- [ ] Only one WebGL context exists on the site.
- [ ] Scrolling is native: no scroll-jacking, pinning, snap, Lenis or ScrollSmoother.
- [ ] The waterline marquee, wave, ripple, depth tint and section reveals behave as in doc 02 §5, and reveals play once.
- [ ] **Reduced motion:** every row of doc 02 §7 is verified with the macOS "Reduce motion" setting on.
- [ ] Reveals have a failsafe: with JS blocked after HTML loads, all content is visible within 2.5 s.

## E. Accessibility
- [ ] Lighthouse Accessibility ≥ 95 on `/`, `/projects`, `/about`, `/gallery` and `/creative`.
- [ ] Contrast: body text ≥ 7:1, secondary and metadata text ≥ 4.5:1, focus ring ≥ 3:1 against adjacent colors.
- [ ] Every interactive element can be reached and operated by keyboard and shows a visible `tide` focus ring.
- [ ] All interactive elements are `<a>` or `<button>` (no clickable `div`s), with touch targets ≥ 44×44 px.
- [ ] The CV, image, chat and mobile-menu dialogs have `role="dialog"`, `aria-modal`, a label, a focus trap, Esc to close and focus return.
- [ ] Images have meaningful alt text, decorative elements (canvas, waves, marquee) are `aria-hidden`, and the copy-email feedback goes through `aria-live`.
- [ ] VoiceOver pass on `/` reads the sections in a logical order.

## F. Performance
| Metric (Lighthouse mobile, `/`) | Target |
|---|---|
| Performance score | ≥ 85 (desktop ≥ 95) |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| TBT | ≤ 200 ms |

- [ ] **Entry JS chunk is ≤ 180 kB gzip** (baseline: a single 201.6 kB chunk).
- [ ] The **lazy 3D chunk is ≤ 260 kB gzip**, and `grep -c WebGLRenderer dist/assets/index-*.js` → `0`.
- [ ] No Vite ">500 kB chunk" warning.
- [ ] Image budgets:
  - above-the-fold portrait ≤ 150 kB;
  - gallery thumbnails ≤ 200 kB each;
  - every below-the-fold image uses `loading="lazy"`;
  - every `<img>` has `width`/`height` or `aspect-ratio`.
- [ ] Optional GLB ≤ 300 kB and poster ≤ 80 kB.
- [ ] No console errors or warnings in the dev or preview builds across all routes.

## G. SEO and deployment
- [ ] `index.html` keeps the canonical URL, OG and Twitter tags, JSON-LD `Person` (updated per decisions) and the Google verification meta.
- [ ] Each route has a unique `<title>` and meta description.
- [ ] `public/sitemap.xml` lists every public route and is valid XML; `robots.txt` is unchanged.
- [ ] Lighthouse SEO ≥ 95 on `/` and `/projects`.
- [ ] A Vercel preview deployment works with deep links and refreshes on every route.

## H. Code quality
- [ ] `npm run lint` exits 0, and `npm run build` succeeds with no warnings.
- [ ] All GSAP code is scoped via `useGSAP`/`gsap.context`, and plugins are registered only in `src/lib/gsap.js`.
- [ ] No React state updates inside scroll, pointer or `useFrame` handlers.
- [ ] Vendored React Bits files carry a header with the source URL, retrieval date and license (MIT + Commons Clause).
- [ ] Dead code from doc 03 Phase 9 is removed (if approved), `git grep` shows no stale imports, and unused dependencies are removed (if approved).
- [ ] `README.md` is updated with setup, scripts and env var **names** only (no secret values).
- [ ] (Security track, if approved) No API key appears in `dist/` (`grep -r "AIza" dist` returns nothing), and the old key has been rotated.
