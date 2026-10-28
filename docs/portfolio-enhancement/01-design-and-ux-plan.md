# 01 — Design & UX Plan

> Working title for the direction: **"Descent"**. The site reads as one continuous dive. You start at the surface (hero), fall through a waterline, and settle into deeper, quieter water (work → background → contact). Everything is black, typographic, and calm, with exactly one 3D focal object.
> All content comes from `00-codebase-audit.md §3`. Items marked **⚠** there need owner decisions before their sections are finalized.

---

## 1. Design principles
1. **Typography is the interface.** Hierarchy comes from scale, weight, and space, not from boxes. Remove the card-per-section dashboard look the current site uses.
2. **One focal object, one narrative.** A single 3D "drop" in the hero. Every later motion (waterline, waves, depth tint) continues that story. No unrelated effects.
3. **Real content only.** Every word, link, and image comes from the existing repo. Rewrites only clarify; they never add claims.
4. **Motion confirms, never blocks.** Content is readable before, during, and without animation. There is no scroll hijacking and no pinning, and nothing waits on an artificial delay.
5. **Progressive enhancement.** HTML and CSS carry the full experience. GSAP adds choreography, and WebGL adds the object. Each layer fails silently to the one below it.
6. **Continuity with today's identity.** Keep the square corners (the site has none today), the restrained neutral palette, and the existing `brandBlue` navy, now repurposed as the "deep water" tint.

## 2. Color tokens (Tailwind v4 `@theme` in `src/index.css`)
| Token | Value | Use |
|---|---|---|
| `--color-ink-950` | `#050506` | deepest background (footer, contact) |
| `--color-ink-900` | `#0a0a0b` | base page background (≈ today's `#0a0a0a`) |
| `--color-ink-850` | `#101113` | raised surface (modals, chat panel, menu overlay) |
| `--color-ink-800` | `#17181b` | hover surface, input background |
| `--color-line` | `rgb(255 255 255 / 0.08)` | hairline dividers |
| `--color-line-strong` | `rgb(255 255 255 / 0.16)` | active dividers, button borders |
| `--color-fg` | `#f2f2f0` | primary text (soft white, not pure `#fff`) |
| `--color-fg-muted` | `#a3a3a8` | secondary text (target ≥ 7:1 on ink-900) |
| `--color-fg-subtle` | `#83838b` | metadata and captions (target ≥ 4.5:1; verify in Phase 8) |
| `--color-tide` | `#5cc8ff` | **the only accent**: focus rings, active nav marker, link underline on hover, 3D rim light, one hero word at most |
| `--color-tide-deep` | `#1e6fa3` | wave strokes at low opacity |
| `--color-brandBlue-darkest` / `-dark` / `-medium` | existing `#00152c` / `#001f40` / `#002853` | **kept.** "Depth" tint that fades in as you scroll (≤ 25% mix) |

Rules:
- **No light sections and no theme toggle.** `color-scheme: dark` sits on `:root`.
- The accent appears in at most **two places per viewport**.
- **Gradients:** only the scroll-depth tint and the 3D shader. No decorative text gradients; this replaces today's `from-slate-400 via-slate-200` gradient text.
- **Effects:** no glassmorphism, no glow shadows, no `shadow-lg` on surfaces. Separate content with space and 1 px lines.

The accent is justified by real material: the dark portrait's night-city window blues and the existing brand navy.

## 3. Typography
**⚠ The reference image was not available**, neither attached nor on disk, so the pairing below is a **provisional recommendation**. The type scale and rules don't depend on the exact family, so changing it later is a one-line token swap.

| Role | Recommended family | Why |
|---|---|---|
| Primary sans (UI, body, headings) | **Geist** (variable, SIL OFL, on Google Fonts) | Clean, contemporary, engineered grotesk. It stays legible at body sizes and holds up at huge display weights with tight tracking. |
| Mono (labels, metadata, tags, nav index numbers) | **Geist Mono** | Developer signal, matched metrics, same family |
| Display accent (optional, after the reference is reviewed) | Pick only if the reference demands it. Use it for hero and section display words only, never body text. | Keeps readability and avoids a third family by default. |

- **Loading:** replace the Raleway and Poppins `<link>` in `index.html` with Geist and Geist Mono (`display=swap`), keeping the existing preconnects.
- **Fallback stack:** `Geist, ui-sans-serif, system-ui, sans-serif`.
- **CLS:** to limit layout shift during the font swap, the hero's text block sets a `min-height` on its container.

### Type scale (fluid)
| Token | Size | Weight / tracking / line-height | Use |
|---|---|---|---|
| `display-xl` | `clamp(3.25rem, 10.5vw, 10rem)` | 600 / -0.045em / 0.88 | Hero name |
| `display` | `clamp(2.5rem, 6vw, 5.5rem)` | 500 / -0.035em / 0.95 | Section titles ("Selected Work") |
| `title` | `clamp(1.75rem, 3.4vw, 3rem)` | 500 / -0.02em / 1.05 | Project titles in the index |
| `heading` | `clamp(1.25rem, 1.8vw, 1.5rem)` | 500 / -0.01em / 1.25 | Sub-headings, role names |
| `lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | 400 / 0 / 1.55 | Hero value prop, About statement |
| `body` | `1rem` (`1.0625rem` ≥ lg) | 400 / 0 / 1.65 | Paragraphs (max 65ch) |
| `small` | `0.875rem` | 400 / 0 / 1.5 | Secondary info |
| `label` | `0.75rem` mono, uppercase | 500 / +0.12em / 1.2 | Section index ("02 — Work"), tags, dates, nav |

## 4. Layout system
- **Container:** `max-w-[90rem]` (1440 px). Gutters `px-[clamp(1.25rem,4vw,3rem)]`.
- **Grid:** 12 columns, gap `clamp(1rem,2vw,2rem)` from `md` up; 4 columns below.
- **Section rhythm:** `py-[clamp(6rem,14vh,10rem)]`. Each section opens with a mono **section index label** (`01 — About`) and a hairline rule.
- **Breakpoints:** Tailwind defaults (sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536). Mobile-first. Every layout must work at 360 px with no horizontal scroll.
- **Radius:** 0 everywhere. One exception: the chat panel may keep a small radius on mobile only if usability demands it.
- **Surfaces:** hairline dividers and lists instead of cards. Surfaces (`ink-850`) only for overlays: modals, chat, mobile menu.

## 5. Interaction states
| Element | Hover (pointer: fine) | Focus-visible | Active |
|---|---|---|---|
| Text link | color `fg-muted → fg`; a 1 px underline grows via `scaleX(0→1)` from the left, 300 ms | 2 px `tide` outline, 3 px offset | color `tide` |
| Primary button (solid `fg` on ink) | background `fg → tide`, 200 ms | same ring | `translateY(1px)` |
| Secondary button (1 px `line-strong` border) | border and text become `fg`; arrow icon moves 4 px | same ring | — |
| Project row | hairline brightens to `line-strong`; title `fg-muted → fg`; arrow rotates −45°; preview image fades in (only where one exists) | whole row is one link, so the ring wraps the row | — |
| Image tile | `scale(1.03)` image inside an `overflow-hidden` frame, 600 ms | ring on the tile `<button>` | — |

Remove the blanket `hover:scale-105/110`. Remove the infinite `animate-pulse`/`animate-bounce` on "Current" labels and the chat FAB.

## 6. Information architecture

### Global
- **Nav (fixed, all pages except `/creative`):**
  - Left: the "Jeremiah Pantaras" wordmark in mono uppercase, linking to `/`.
  - Right: **Work · About · Experience · Contact**, plus a separate **Creative ↗** link.
  - On `/` the links are in-page anchors (`#work`, `#about`, …) with an active-section indicator: a 4 px tide square before the label, driven by IntersectionObserver.
  - On subpages they are `<Link>`s to `/#work` and so on.
  - The bar is transparent at the top and gains an `ink-900/85` background with a bottom hairline after 80 px of scroll.
  - It never hides. Hiding on scroll-down is restless and hurts discoverability.
  - **Mobile:** a "Menu" text button opens a full-screen `ink-850` overlay with large `title`-size links. It traps focus, closes on Esc, and closes on link selection.
- **Skip link** "Skip to content" as the first focusable element.
- **Footer** is shared by all pages (see §7.9).
- **Floating chat button:** keep it. Restyle as a square `ink-850` button with a hairline border, labeled "Ask AI Jeremiah" on ≥ md and icon-only on mobile. Remove the bounce.

### Home `/` (single long scroll; the order *is* the descent)
| # | Section (anchor) | Content (source) |
|---|---|---|
| 0 | Hero (`#top`) | name, title, location, value prop, CTAs, 3D drop |
| — | **Waterline** transition | curved marquee of the real tech list |
| 1 | About (`#about`) | statement, portrait, facts, link to `/about` |
| 2 | Selected Work (`#work`) | 6 featured projects, link to `/projects` |
| 3 | Capabilities (`#stack`) | full tech list by category, link to `/tech-stacks` |
| 4 | Experience & Recognition (`#experience`) | timeline, awards, conference, workshops; links to `/experience`, `/certifications`, `/workshops` |
| 5 | Gallery (`#gallery`) | 6-image strip, link to `/gallery` |
| 6 | The Creative Side | full-bleed band, link to `/creative` |
| 7 | Contact (`#contact`) and footer | email, socials, CV |

The **subpages remain** (sitemap and SEO, deep links). They become clean index pages on a shared shell (§8).

## 7. Section-by-section redesign

### 7.0 Hero
**Desktop (≥ lg), 12-column grid, `min-h-[100svh]`:**
- **Columns 1–8:**
  - Mono label: `SOFTWARE ENGINEER — FULL-STACK DEVELOPER · BACOLOD CITY, PH`
  - Name in `display-xl` on two lines ("Jeremiah / Pantaras"), set with a line-mask reveal.
  - `lead` value proposition, max 36ch. **Draft for approval**, derived only from `profile.bio`/`bio2`: *"I build modern web applications with Python (Django) and React, and help startups and MSMEs grow through COS Devs."*
  - CTAs:
    - primary **"View selected work"** → `#work`;
    - secondary **"View CV"** → opens the existing `OpenCv` modal;
    - text link **"Email me"** → `mailto:`.
  - A row of 5 social icon links (GitHub, LinkedIn, Facebook, Instagram, Website) in `fg-subtle`, 20 px, with `aria-label`s.
- **Columns 7–12 (overlapping the name slightly behind the text, `z-0` vs text `z-10`):** the 3D drop, in a square container sized `min(42vw, 640px)`.
- **Bottom left:** mono "Scroll to descend ↓" cue. It is hidden under reduced motion, where it reads "Scroll ↓" instead.

**Mobile (< md):**
- Label first, then the name (≈ 3.25–4rem), then the value prop, then the CTAs stacked full-width.
- The drop sits *above* the name at 38svh as the static poster (see doc 02 §4.6). The text stays fully above the fold on a 390×844 viewport.

The verified checkmark next to the name and the conference "medal" pill move out of the hero. The conference becomes a fact in Recognition (§7.4).

### 7.W Waterline transition (between hero and About)
A full-bleed SVG wave carries a **curved, infinitely looping marquee** of the real tech stack in mono uppercase: `PYTHON · DJANGO · REACT · TYPESCRIPT · TAILWIND CSS · FIREBASE · POSTGRESQL · GSAP ·`. Text is `fg-subtle` with a `tide` separator dot. This is the "surface of the water" the drop falls into (see doc 02 §5). It is `aria-hidden`, because the same list appears in Capabilities.

### 7.1 About `#about`
- **Left (columns 1–7):**
  - The `display` heading "About".
  - A **statement paragraph** in `lead`/`title` size: a tightened rewrite of `bio`, `bio2`, and `bio3`, revealed word-by-word on scroll.
  - Below it, a 2×2 **facts list** (mono labels, `body` values):
    - Based in: Bacolod City, PH
    - Education: BS Computer Science, STI West Negros University (status ⚠)
    - Company: COS Devs (title ⚠)
    - Focus: Web apps · AI integration
  - Link: "Read my story →" to `/about`.
- **Right (columns 9–12):** the dark portrait (optimized derivative), 4:5 crop, slight grayscale that lifts on hover.

### 7.2 Selected Work `#work`
- **Chosen pattern: editorial numbered index.** Each project is a full-width row (§7.2.1).
- **Alternatives considered:**
  - **Image-led asymmetric cards:** rejected, because only 1 of 16 projects has verified imagery.
  - **Horizontal scroll gallery:** rejected, because it hijacks scroll.
- **Upgrade path:** if you provide screenshots of the live projects (Orki, Incognito, Recivo, ePuno, Tabang Negros), each row gains a **pointer-following preview**. On fine pointers it is a 360×225 image that follows the cursor with interpolation. On touch it is an inline thumbnail under the title. Rows without images keep the typographic treatment, so the pattern never looks broken.
- **Featured six (⚠ approval):** Orki, Incognito, Recivo, Tabang Negros, Avendro (has image), Satoru. These are live products, plus one AI/open-source tool, which shows range.
- "All 16 projects →" links to `/projects`.

#### 7.2.1 Project row anatomy
`01` index (mono) · **title** (`title`) · one-line description (`body`, `fg-muted`, max 60ch) · tags (mono `label`, joined with " / ") · link pills "Live ↗" and/or "Source ↗". Each pill appears only when its link exists and isn't `#`.

### 7.3 Capabilities `#stack`
- Six columns (3 on md, 2 on mobile), one per category from `TechStacks.jsx`: Frontend, Backend, Database, Tools, UI/UX, Multimedia.
- Each column has a mono category label and the items as a plain list in `heading` size.
- **No percentages, bars, or ratings.**
- The Multimedia column bridges to the Creative side.

### 7.4 Experience & Recognition `#experience`
- **Experience:** a timeline as a definition list, one row per role. Row content: year (mono) · role (`heading`) · organization (`fg-muted`) · a static "Current" label in tide mono with no pulse. Order: newest first. The list is the union from audit §3.4 after owner decisions.
- **Recognition:**
  - The two ICT Olympics awards and "Presented at the 11th Asia International Conference 2025 (Kuala Lumpur)", linking to the conference page with tracking parameters stripped (⚠ verify the clean URL loads).
  - The PICSPRO entry follows, ⚠ once its title is clarified.
- **Seminars & Workshops:** a compact two-column list of all 7 entries, with the typo fixed ("Programmers' Guild").
- Links: "Experience →", "Certifications →", "Workshops →" to the existing routes.

### 7.5 Gallery `#gallery`
- A 6-image horizontal row on desktop (CSS grid, varied spans, **no horizontal scroll hijack**) and a 2-column grid on mobile.
- Tiles are `<button>`s that open the existing `ImageModal`.
- Alt text: "Photo N from Jeremiah's gallery" until real captions exist. **Don't display the fake "Highlight N / 2024" captions.**
- "View all 23 →" links to `/gallery`.

### 7.6 The Creative Side
- A full-bleed band with `hero-background.webp` (the optimized derivative) at 40% brightness and a slow parallax (`yPercent` −8 → 8, scrubbed).
- Heading "The Creative Side" with the subline from CreativeHero's paragraph, shortened.
- Button "Enter →" to `/creative`. It replaces today's "View my Creative Side" sidebar CTA.

### 7.7 Contact `#contact`
- Section label `07 — Contact`.
- **Huge mailto link** in `display` size: `jeremiahpantaras@gmail.com`, with an inline "Copy" button that announces "Copied" via `aria-live`.
- The existing "Get In Touch" text, plus location.
- Socials as text links in mono: GitHub ↗ · LinkedIn ↗ · Facebook ↗ · Instagram ↗ · COS Devs ↗.
- CV actions: "View CV" (modal) and "Download CV" (`/Resume.pdf`).

### 7.8 Background depth
Covered in doc 02 §5. The page background stays ink-black. A fixed tint layer slowly mixes in `brandBlue-darkest` as you descend, so the contact section feels "deeper" without ever becoming blue.

### 7.9 Footer (shared)
- Name plus a one-line blurb. ⚠ The "Junior" vs "Software Engineer" wording needs a decision.
- **Pages:** About, Projects, Tech Stack, Experience, Certifications, Workshops, Gallery, Creative. This adds the routes the current footer omits.
- **Contact:** email, location, COS Devs.
- **Bottom row:** © year · "Back to top ↑".

## 8. Subpages (shared `PageShell`: nav + page header + footer)
- **Page header:** mono label (`Index — Projects`), `display` title, count ("16 projects"), hairline.
- **Remove** the fake 1.5 s loaders. Content renders immediately and the reveal plays once.

| Page | New presentation |
|---|---|
| `/projects` | Full numbered index (same row anatomy as §7.2.1). Optional tag filter chips built from the real tags, as `<button aria-pressed>`; ⚠ optional. Rows whose link is `#` show no link pill. |
| `/about` | Editorial long-read: alternating 7/5-column text and image blocks with the existing 6 paragraphs and images. Images are lazy-loaded. |
| `/tech-stacks` | Same as §7.3, larger. |
| `/experience` | Timeline as in §7.4. |
| `/certifications` | Recognition list as in §7.4. Emojis are replaced by mono index numbers, because emoji badges clash with the minimal system. ⚠ Keep them if you prefer. |
| `/workshops` | Two-column list grouped by year. |
| `/gallery` | Masonry, 3/2/1 columns, `<button>` tiles, lazy-loaded derivatives, `ImageModal`. |
| `/creative`, `/creative/gallery` | **Recommended scope:** align them to the new tokens and type, and add the shared nav (dark variant). Keep their content and GSAP blur reveal. Fix the missing `10.webp`. Replace the placeholder ChromaGrid handles (`@photographer`, etc.) with nothing, or with real content you provide. A full creative redesign is out of scope ⚠. |
| *(new)* `*` 404 | "Lost at sea." Mono label 404, links home and to Projects. **This is new UI copy, so it needs approval.** |

## 9. Accessibility and UX requirements (design-level)
- **Landmarks:** `<header>`, `<nav aria-label="Primary">`, `<main id="content">`, one `<section>` per block with `aria-labelledby`, and `<footer>`.
- **Headings:** one `<h1>` per page (the hero name on `/`). Sections use `<h2>`, and project titles use `<h3>`.
- **Keyboard:** everything clickable is a real `<a>` or `<button>`.
- **Modals** (CV, image, chat, mobile menu) get `role="dialog"`, `aria-modal`, a labelled title, focus trap, Esc to close, and focus return to the trigger.
- **Contrast:** body text ≥ 7:1 and metadata ≥ 4.5:1 on ink-900. The focus ring (`tide` on black, about 10:1) must be visible on every element.
- **Targets:** all interactive targets are ≥ 44×44 px on touch.
- **Reduced motion:** see doc 02 §7. The content layout stays the same; only the motion changes.
- **No text inside images** and no essential information conveyed by motion alone.
