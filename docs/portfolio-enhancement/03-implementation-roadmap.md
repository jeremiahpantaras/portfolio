# 03 — Implementation Roadmap

> Intended implementer: Claude Sonnet 5.5, **after** the owner approves docs 01–02 and answers the ⚠ decisions in §0.
> Each phase is one reviewable PR or commit series on a feature branch. Never work on `production` directly.
> No time estimates; the order follows technical dependencies.

## Standard validation (run at the end of every phase)
```bash
npm run lint                 # must exit 0 from Phase 1 onward (baseline: 3 errors)
npm run build                # must succeed; record the gzip size of every JS chunk in the PR description
npm run preview              # manual check at 360, 390, 768, 1024, 1440 and 1920 px widths
git status && git diff --stat   # only the files this phase lists may change
```
- **Console:** check the browser console for errors and warnings in the dev and preview builds. This requires Phase 1's removal of the console-blocking script.
- **Bundle check (from Phase 4):** `grep -c WebGLRenderer dist/assets/index-*.js` must print `0`, meaning three.js is absent from the entry chunk.
- **Remove `dist/`** after checking if it was absent before (it is gitignored).

---

## Phase 0 — Decisions and branch setup
- **Objective:** close every ⚠ item before code depends on it.
- **Steps:**
  1. The owner answers the decisions listed in the final report (typography reference, content conflicts, featured projects, 3D on mobile, scope of `/creative`, removals).
  2. Record the answers in `docs/portfolio-enhancement/decisions.md`.
  3. Create branch `redesign/descent` from `production`.
- **Acceptance:** every ⚠ in doc 00 §3 has a recorded answer, or an explicit "leave as-is".

## Phase 1 — Foundation
**Objective:** one source of content, the new tokens, permanent dark mode, a working debug environment, and no artificial delays. **Visual layout may still look like the old site.**

**Order inside the phase:**

| Step | Work | Files |
|---|---|---|
| 1A | **Unblock debugging.** Remove the console- and devtools-blocking `<script>` from `index.html` (⚠ approval; if declined, wrap it so it runs only on the production hostname). | `index.html` |
| 1B | **Content consolidation.** Create `src/data/{profile,socials,projects,experience,techStack,recognition,gallery}.js`, merging every duplicate per `decisions.md`. Each project gets `{ slug, title, description, tags, links: { live?, source? }, image?, featured }`. Links equal to `'#'` become absent. Point MainSection and all subpages at these modules. **No visual change.** | new `src/data/*.js`; `MainSection.jsx`; `pages/*.jsx`; `creatives/components/CreativeContact.jsx` |
| 1C | **Tokens and fonts.** In `src/index.css`, replace `@theme` with the tokens from doc 01 §2–3, keeping the `brandBlue-*` tokens. Add `color-scheme: dark` and the base `body` style (`ink-900` / `fg`). Swap Raleway/Poppins for Geist/Geist Mono in `index.html`. Remove the redefinitions of Tailwind's `animate-pulse`/`animate-spin` keyframes. | `src/index.css`, `index.html` |
| 1D | **Permanent dark mode.** The `index.html` head script now always adds `dark` and `js` to `<html>`. Remove the theme logic from `App.jsx` and `MainSection.jsx`, plus the toggle UI. Set `theme-color` to `#0a0a0b`. `dark:` classes keep working during the migration. | `index.html`, `App.jsx`, `MainSection.jsx` |
| 1E | **GSAP module and hooks.** Add `src/lib/gsap.js` (register plugins once), `src/hooks/useReducedMotion.js`, and `src/components/ScrollToTop.jsx`. Migrate `CreativeHome.jsx` to import from `src/lib/gsap.js`. | new files; `App.jsx`; `creatives/pages/CreativeHome.jsx` |
| 1F | **Remove fake loaders.** Delete the `setTimeout(1500)` loading state in all 8 pages. Stop rendering Preloader and skeletons (the files are deleted in Phase 9). | `pages/*.jsx`, `MainSection.jsx` |
| 1G | **Routing correctness.** Internal `<a href="/…">` becomes `<Link>`. Add a catch-all `*` route (temporary simple page; it's designed in Phase 7). Fix the SVG `class=` attribute. | `MainSection.jsx`, `CreativeHero.jsx`, `App.jsx` |
| 1H | **Code-split.** `React.lazy` every route except `/`. Lazy-load `Chat` when the FAB is first clicked (this moves `@google/generative-ai`, `react-markdown`, and `remark-gfm` out of the entry chunk). | `App.jsx`, `MainSection.jsx` |
| 1I | **Lint green.** Fix the 3 existing errors (unused `handlePrint`, `iconMap`, `portfolio`) without changing behavior. | `OpenCv.jsx`, `CreativeHero.jsx` |
| 1J | **Asset pipeline.** Generate responsive WebP derivatives (originals untouched):<br>• portrait at 640 and 1200 w;<br>• gallery and creative gallery at 640, 1280 and 2000 w;<br>• about images at 960 w;<br>• hero background at 1280 and 1920 w.<br>Output goes to `public/images/{portrait,gallery,creative,about,hero}/`. Tooling ⚠: add a one-off `npx sharp-cli`, **or** add `sharp` as a devDependency with `scripts/optimize-images.mjs` and an `npm run images` script (repeatable for future uploads). Rename `creative-gallery/10 2.webp` to `10.webp` ⚠. | `public/images/**`, optional `scripts/`, `package.json` (only if the devDependency option is approved) |

- **New dependencies:** none (except the optional `sharp` devDependency).
- **Acceptance:**
  - Every page renders the same facts as before, sourced from `src/data/`. `grep -rn "Orki - Board" src` matches exactly one file.
  - No theme toggle; the page is dark on first paint with no flash.
  - Pages show content immediately (no 1.5 s wait).
  - `npm run lint` exits 0.
  - The entry chunk is smaller than the 201.6 kB gzip baseline (record the number).
  - All routes load, and an unknown URL shows the catch-all page.
  - The console shows no errors.
- **Risks and rollback:** data merging could drop an item. Diff the item counts against doc 00 §3 (16 projects, 7 workshops, 3 certifications, 23 gallery images, 20 creative images). Each step is its own commit, so it can be reverted individually.

## Phase 2 — Layout shell and primitives
- **Objective:** global navigation, footer, and typographic primitives. Subpages are moved onto the shell.
- **Files:**
  - new: `src/components/layout/{SiteNav,MobileMenu,SiteFooter,PageShell,SkipLink}.jsx`
  - new: `src/components/ui/{Container,SectionLabel,SectionHeading,TextLink,Button,TagList}.jsx`
  - edit: `App.jsx` (layout route with `<Outlet/>` for non-creative routes), `pages/*.jsx`
- **Steps:**
  1. Build the primitives using the token classes. Primitives may not use ad-hoc hex values.
  2. Build `SiteNav`. On `/`, active sections are tracked via IntersectionObserver; elsewhere it uses route links. Add the scrolled-state hairline.
  3. Build `MobileMenu`: dialog semantics, focus trap, Esc closes it, focus returns to the trigger, and body scroll is locked with one shared helper.
  4. Build `SiteFooter` with the full page list (doc 01 §7.9).
  5. Move the 7 subpages into `PageShell` with the index-page layouts from doc 01 §8, without reveal animations yet. Remove the per-page "Back" buttons; the nav replaces them.
- **Dependencies:** Phase 1.
- **Acceptance:**
  - The nav and footer appear on all main-site routes.
  - Keyboard: Tab order is logical, the skip link works, and the mobile menu traps and returns focus.
  - Each page has exactly one `<h1>`.
  - Layout holds at 360 px with no horizontal overflow (`document.documentElement.scrollWidth === innerWidth`).
- **Risks:** the layout route wrapper could change `/creative`. Keep the creative routes outside the shell.

## Phase 3 — Hero (typographic), poster, and waterline
- **Objective:** a fully working, memorable hero **without WebGL**.
- **Files:**
  - new: `src/components/hero/{Hero,HeroPoster}.jsx`, `src/components/motion/Waterline.jsx`
  - new: `src/components/reactbits/CurvedLoop.jsx` (vendored JS-TW variant with a license header)
  - edit: `src/index.css` (`[data-reveal]` failsafe CSS), `pages/Home.jsx`
- **Steps:**
  1. Build the hero markup and responsive grid (doc 01 §7.0). The CTAs wire to `#work`, the `OpenCv` modal, and `mailto:`.
  2. Build `HeroPoster`, the CSS teardrop from doc 02 §4.6.
  3. Build the entrance timeline (doc 02 §5.3) with `gsap.matchMedia` and its reduced-motion branch.
  4. Build `Waterline`: CurvedLoop marquee plus the SVG wave with velocity-excited amplitude. The ripple hook is stubbed until Phase 4.
  5. Home renders `Hero` + `Waterline`, followed by the existing MainSection content (temporarily).
- **Dependencies:** Phases 1–2.
- **Acceptance:**
  - Hero text is visible and readable with JS disabled, and with reduced motion on.
  - The entrance completes in ≤ 2 s, and the CTAs are clickable throughout it.
  - At 390×844 the name, value proposition and primary CTA are above the fold.
  - The marquee pauses off-screen and is static under reduced motion.
  - CLS is under 0.05 for the hero (Lighthouse).

## Phase 4 — 3D drop
- **Objective:** the live WebGL drop as a progressive enhancement over the poster.
- **New dependencies (⚠ approval):** `three` (0.186.x) and `@react-three/fiber` (9.8.x), pinned exactly. Justification: doc 02 §4.2. Check the peer range against the installed `react` (19.2.0 is allowed by `>=19 <19.4`).
- **Files:**
  - new: `src/components/hero/{HeroScene.jsx, Drop.jsx, dropMaterial.js, useCanRender3D.js, Hero3DBoundary.jsx}`
  - edit: `Hero.jsx`, `Waterline.jsx` (ripple trigger)
- **Steps:**
  1. Write `useCanRender3D` (gating rules from doc 02 §4.6).
  2. Write the `dropMaterial` shader (noise with attribution, fresnel, specular, caustic, taper, and stretch uniforms).
  3. Write `Drop`: geometry, pointer damping, idle state, scroll coupling via a ref.
  4. Write `HeroScene`: Canvas config, frameloop visibility control, perf guard, `onCreated` → ready.
  5. In `Hero`, lazy-load the scene after fonts are ready and the browser is idle, wrap it in Suspense with the poster fallback, add the error boundary, then cross-fade.
  6. Wire the ripple trigger to `Waterline`.
  7. **4b (optional, needs the asset):** load the GLB per doc 02 §4.7 behind a `source` prop and fall back to procedural on error. Add `public/images/hero/drop-poster.webp` to replace the CSS poster.
- **Dependencies:** Phase 3.
- **Acceptance:**
  - `WebGLRenderer` is absent from the entry chunk, and the lazy 3D chunk is ≤ 260 kB gzip (record it).
  - Pointer response stays within ±15° and ±0.12 units, with no jitter. The idle state engages after 3 s.
  - Below 768 px, under reduced motion, with Save-Data, or with WebGL disabled (Chrome flag or `--disable-webgl`), only the poster renders and there are no console errors.
  - Forcing context loss (`WEBGL_lose_context`) swaps to the poster.
  - At 1440 px, Chrome Performance shows a steady 60 fps on a mid-range laptop and 0 long tasks over 200 ms from the scene.
  - The canvas stops rendering when scrolled out of view (check the Performance panel).
- **Rollback:** delete the `HeroScene` import; the poster path is complete on its own.

## Phase 5 — Home content sections
- **Objective:** replace the `MainSection` monolith with the redesigned sections.
- **Files:**
  - new: `src/sections/home/{About,Work,ProjectRow,Capabilities,Experience,GalleryStrip,CreativeBand,Contact}.jsx`
  - edit: `pages/Home.jsx`
  - `MainSection.jsx` stops being rendered (it is deleted in Phase 9)
- **Steps:**
  1. Build each section per doc 01 §7.1–7.7, sourced only from `src/data`.
  2. The CV modal, `ImageModal`, and lazy Chat FAB move to `Home` (or the shell).
  3. Use the optimized images: `srcset`, `sizes`, `width`/`height`, `loading="lazy"` below the fold, and `decoding="async"`.
  4. Gallery tiles become `<button>`s, and the modal shows the 2000 w derivative.
  5. **Download keeps the original file.** Confirm this; don't silently change what users download.
- **Dependencies:** Phases 1–3. Phase 4 is not required.
- **Acceptance:**
  - Every link in doc 00 §3.2 and every project link works from home or `/projects`.
  - The featured projects match `decisions.md`.
  - No fabricated text: every string traces to `src/data` or an approved rewrite.
  - Email copy works and announces itself to screen readers.
  - Chat opens, sends, and renders Markdown as before.

## Phase 6 — Scroll narrative and reveals
- **Objective:** the descent: depth tint, ambient waves, section reveals, and the drop fall.
- **Files:**
  - new: `src/components/motion/{DepthBackdrop,Reveal}.jsx`, `src/hooks/useSectionReveal.js`
  - new: `src/components/reactbits/{ScrollReveal,SplitText}.jsx` (vendored), optional `Magnet.jsx`
  - edit: the home sections
- **Steps:**
  1. Add `DepthBackdrop` to the home layout.
  2. Add the section label, hairline and heading reveals.
  3. Add the ScrollReveal About statement.
  4. Add the project-row batch reveal and the pointer preview (image rows only).
  5. Add the gallery clip-path reveal and the creative band parallax.
  6. Add the contact chars reveal.
  7. Verify the reduced-motion matrix (doc 02 §7) case by case.
- **Dependencies:** Phase 5 (and Phase 4 for the drop/ripple coupling).
- **Acceptance:**
  - All reveals run once and never hide content permanently. Test with JS throttled, and confirm the failsafe shows content by 2.5 s.
  - Scrolling stays native: no scroll-jacking, pinning or snap (`grep -rn "pin:\|ScrollSmoother\|snap" src` returns nothing).
  - With reduced motion on, nothing translates or loops.
  - A fast scroll of the home page in Chrome Performance shows no dropped-frame clusters on a mid-range laptop.

## Phase 7 — Subpages, creative alignment, and SEO details
- **Files:** `pages/*.jsx`, `src/pages/NotFound.jsx`, `creatives/**` (token and type alignment, nav, ChromaGrid content ⚠), `public/sitemap.xml`, `index.html`.
- **Steps:**
  1. Apply reveals on subpages.
  2. Add the `/projects` tag filter (if approved).
  3. Lay out `/about` as an editorial long-read.
  4. Restyle `/gallery` as masonry with derivatives.
  5. Design the 404 page.
  6. **Per-route `<title>` and `<meta name="description">`** via React 19 native metadata hoisting (no new dependency), with the copy taken from the existing page headings.
  7. Add `/gallery`, `/creative` and `/creative/gallery` to the sitemap, and update `lastmod`.
  8. Reconcile the JSON-LD `sameAs` and job title with `decisions.md`.
  9. `/creative`: tokens, fonts, dark nav variant, fixed `10.webp`, placeholder handles resolved. Its content and GSAP blur-reveal stay.
- **Acceptance:**
  - Each route has a unique title, and `index.html` keeps the OG, Twitter and JSON-LD tags.
  - The sitemap validates (well-formed XML).
  - Creative gallery item 10 displays.
  - Lighthouse SEO is ≥ 95 on `/` and `/projects`.

## Phase 8 — Responsive, accessibility, and performance hardening
- **Steps:**
  1. Run a contrast audit of all token pairs and adjust `fg-subtle` if it falls below 4.5:1.
  2. Give modals dialog semantics, a focus trap and focus return (CV, image, chat). Chat gets a labelled close button and `onKeyDown` in place of `onKeyPress`.
  3. Make every interactive element a real button or link with a ≥ 44 px target.
  4. Write alt text (approved captions, or the neutral pattern).
  5. Run Lighthouse (mobile and desktop) on `npm run preview` for `/`, `/projects`, `/about`, `/gallery` and `/creative`.
  6. Test at 360 to 1920 px widths, plus 1024 px landscape tablet.
  7. Test keyboard-only and with VoiceOver (macOS Safari).
- **Acceptance:** doc 04 sections C–F all pass.

## Phase 9 — Cleanup and documentation
- **Steps (⚠ deletions need approval):**
  1. Delete `MainSection.jsx`, `Preloader.jsx`, `SkeletonLoader.jsx`, `MainSkeletonLoader.jsx`, the unused keyframes, `src/App.css` and `tailwind.config.js` (inert).
  2. Remove the `lenis` and `react-icons` dependencies.
  3. Optionally remove the unreferenced assets listed in doc 00 §4.
  4. Update `README.md` (setup, scripts, env var **name** `VITE_GEMINI_API_KEY`) and record the final decisions.
- **Acceptance:**
  - `npm run lint` and `npm run build` are clean, with no >500 kB chunk warning.
  - `git grep` finds no reference to deleted files.
  - Doc 04 is fully checked.

---

## Parallel security track S (⚠ recommended, independent of the redesign)
- **Problem:** `VITE_GEMINI_API_KEY` ships in the public JS bundle.
- **Fix:**
  - Add a Vercel Serverless Function `api/chat.js` that reads `GEMINI_API_KEY` (no `VITE_` prefix), takes `{ message }`, and builds the same persona prompt server-side.
  - Add basic input length limits and a simple rate limit.
  - `chat.jsx` posts to `/api/chat`.
  - **Rotate the existing key**, because it must be treated as leaked.
- **Note:** commit `8efe7ff` moved the call *from* a backend, so confirm why before reversing it.
- **Acceptance:** after the build, the key string is absent from `dist/` (`grep -r "AIza" dist` returns nothing), and chat works on a Vercel preview deployment.
