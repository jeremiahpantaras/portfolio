# 00 — Codebase Audit

> Planning phase only. This document records what **actually exists** in the repository. It is the source of truth that docs 01–04 build on.
> Audit date: 2026-10-27 · Commit `c30302f` ("New Creative Resume") · Branch `production` (tracks `origin/production`) · Working tree clean.

---

## 1. Toolchain and stack

| Area | Verified fact |
|---|---|
| Framework | React **19.2.0** SPA, Vite **7.1.12** (`@vitejs/plugin-react`) |
| Language | JavaScript/JSX. Two TypeScript files (`ChromaGrid.tsx`, `creativeServices.ts`) are only transpiled by Vite: there is **no `tsconfig`** and no type-checking. |
| Routing | `react-router-dom` **7.9.5**, `BrowserRouter` in `src/App.jsx` |
| Styling | Tailwind CSS **4.1.16** via the `@tailwindcss/vite` plugin. The config lives in `src/index.css` (`@theme`, `@variant dark`). |
| Animation | `gsap` **3.15.0** + `@gsap/react` (used only in `/creative`). `SplitText`, `ScrollTrigger`, and `MorphSVGPlugin` ship inside the installed `gsap` (all free since 3.13). |
| Icons | `lucide-react` (used everywhere) |
| AI chat | `@google/generative-ai` (Gemini `gemini-2.5-flash`), `react-markdown`, `remark-gfm` |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` (mounted in `App.jsx`) |
| **Installed but never imported** | `lenis`, `react-icons` |
| **Not installed** | three.js, React Three Fiber, Drei, Framer Motion/`motion`, any React Bits package. React Bits has no npm package; components are copied in. |
| React Bits already present | `src/creatives/components/ui/ChromaGrid.tsx` is the React Bits **ChromaGrid** component, vendored. |
| 3D assets | None (`*.glb`, `*.gltf`, and `*.blend` are all absent) |
| Package manager | npm (`package-lock.json`); Node v24.18.0 / npm 11.16.0 on this machine |
| Hosting | Vercel (`vercel.json` rewrites all paths to `/index.html`). Domain `jeremiah.cosedevs.com`. |

### Scripts (`package.json`)
| Script | Command | Baseline result (2026-10-27) |
|---|---|---|
| `npm run dev` | `vite` | not run |
| `npm run build` | `vite build` | **Passes.** Emits **one** JS chunk of 645.16 kB (201.64 kB gzip), plus a >500 kB chunk warning, a 59.6 kB CSS file, and a 1.46 MB hero webp. |
| `npm run lint` | `eslint .` | **Fails with 3 errors.** `OpenCv.jsx:29` has unused `handlePrint`; `CreativeHero.jsx:6,17` has unused `iconMap` and `portfolio`. |
| `npm run preview` | `vite preview` | not run |
| tests / type-check | **none exist** | — |

ESLint covers only `**/*.{js,jsx}`, so `.ts`/`.tsx` are not linted. The rule `no-unused-vars` ignores names that match `^[A-Z_]`, which is why unused capitalized imports like `Calendar`, `Twitter`, and `ChevronUp` in `MainSection.jsx` are never reported.

---

## 2. Architecture

```
index.html ─ theme pre-paint script, SEO meta, JSON-LD, console-blocking script
  └─ src/main.jsx ─ StrictMode, imports src/index.css
       └─ src/App.jsx ─ BrowserRouter + Routes + <Analytics/> + <SpeedInsights/>
```

### Routes (`src/App.jsx`)
| Path | Component | Notes |
|---|---|---|
| `/` | `pages/Home.jsx` → `components/sections/MainSection.jsx` | 907-line monolith: all homepage data and UI |
| `/about` | `pages/About.jsx` | 6 alternating story blocks with images |
| `/tech-stacks` | `pages/TechStacks.jsx` | full tech list in 6 categories |
| `/projects` | `pages/Projects.jsx` | 16 projects |
| `/certifications` | `pages/Certifications.jsx` | 3 items |
| `/experience` | `pages/Experience.jsx` | 5 items |
| `/workshops` | `pages/Workshop.jsx` | 7 items |
| `/gallery` | `pages/Gallery.jsx` | 23 photos plus ImageModal |
| `/creative` | `creatives/pages/CreativeHome.jsx` | always dark; GSAP `.blur-reveal` scroll sections |
| `/creative/gallery` | `creatives/pages/CreativeGalleryPage.jsx` | 20 photos |
| *(none)* | — | **No 404 / catch-all route** |

### Shared page pattern (every subpage)
- A fake `loading` state with `setTimeout(1500)` shows `SkeletonLoader`.
- An `isVisible` flag then drives a fade-up on the content.
- A "Back" button calls `navigate('/')`.
- The page renders one card holding **inline hard-coded data**.

### Components
| Component | File | Used by | Notes |
|---|---|---|---|
| `MainSection` | `src/components/sections/MainSection.jsx` | `Home` | Inline data: `profile`, `socials`, `experiences`, `projects`, `techStack`, `certifications`, `galleries`, `workshops`. Owns the theme toggle, the chat FAB, and the CV and image modals. |
| `Chat` | `src/components/chat.jsx` | `MainSection` | Calls Gemini from the browser with `VITE_GEMINI_API_KEY`. The prompt is built from `src/data/portfolio-context.json`. It keeps no conversation history. |
| `OpenCv` | `src/components/OpenCv.jsx` | `MainSection` | Shows `/Resume.pdf` in an iframe with a Download link. Esc closes it. `triggerRef` is passed in but unused. |
| `ImageModal` | `src/components/ImageModal.jsx` | MainSection, Gallery, CreativeGallery, CreativeGalleryPage | Portal to `body`, Esc to close, blob download. Has no `role="dialog"` or focus trap. |
| `Preloader` | `src/components/Preloader.jsx` | `MainSection` (first visit per session) | logo plus a shimmering name |
| `MainSkeletonLoader` / `SkeletonLoader` | `src/components/` | MainSection / all subpages | Exist only to fill the artificial 1.5 s delay |
| `CreativeHero/About/Gallery/Services/Contact` | `src/creatives/components/` | `CreativeHome` | `CreativeAbout`'s "Contact Me" button has no handler |
| `ChromaGrid` (React Bits) | `src/creatives/components/ui/ChromaGrid.tsx` | `CreativeServices` | GSAP pointer spotlight |

### Theme (to be removed by the redesign)
- `index.html` runs a pre-paint script that reads `localStorage.theme` or falls back to `prefers-color-scheme`.
- The same logic is duplicated in `App.jsx`, whose `darkMode` state is passed to `Home` and ignored.
- `MainSection.jsx` holds the only toggle UI and writes `localStorage.theme`.
- `/creative` forces the `dark` class but doesn't persist it.

### Styling (current)
- `src/index.css`:
  - `@theme` defines `brandBlue-darkest #00152c`, `brandBlue-dark #001f40`, `brandBlue-medium #002853` (all unused in markup), plus `--font-family-sans/heading` (Raleway/Poppins via plain CSS vars).
  - `@variant dark (&:where(.dark, .dark *))`.
  - Custom keyframes: `float-1..5`, `spin`, `pulse` (overrides Tailwind's), `fadeOut`, `shimmer`, `slideDown`, `slow-zoom`.
- `tailwind.config.js` is **not loaded**: Tailwind v4 needs an `@config` directive, and there is none.
- `src/App.css` is not imported anywhere.
- Fonts: Raleway (body) and Poppins (headings) from Google Fonts in `index.html`.
- Visual language today:
  - square corners;
  - cards `bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 shadow-lg`;
  - page background `gray-50` / `#0a0a0a`, slate accents;
  - `hover:scale-105` almost everywhere;
  - staggered `transitionDelay` reveals.
- Layout: from `lg` up, a sticky 320–360 px sidebar plus content, `max-w-[1600px]`. Below `lg`, everything stacks. Tailwind default breakpoints.

---

## 3. Content inventory (source of truth)

Legend: **Keep** = retain as-is. **Reorg** = move or merge. **Rewrite** = clarify wording with no new facts; needs owner approval. **Emphasize** = give it visual priority. **⚠ Conflict** = sources disagree, and the owner must choose.

### 3.1 Identity and contact
| Item | Value | Source | Action |
|---|---|---|---|
| Name | Jeremiah Pantaras | MainSection `profile.name`, everywhere | Keep · Emphasize (hero) |
| Title | "Software Engineer \| Full-Stack Developer" | MainSection `profile.title` | Keep. ⚠ The footer says "Junior Software Engineer…". |
| Location | Bacolod City, Negros Occidental, Philippines | `profile.location`, footer, JSON-LD | Keep |
| Email | jeremiahpantaras@gmail.com | `profile.email`, footer, CreativeContact, JSON-LD | Keep (`mailto:`) |
| Bio ×3 | Django/React focus; COS Devs helping startups/MSMEs plus a Negros developer community; AI interest | `profile.bio`, `bio2`, `bio3` | Rewrite (tighten) · basis of the hero value proposition |
| Verified badge | blue check SVG beside the name | MainSection L331, chat header | Decide: keep or drop. It mimics social-platform verification. |
| Avatar | `/poypoy.png` | `profile.avatar` | **Never rendered** |
| Portraits | `/profile/darkMode.webp` (5.4 MB, 3375², moody night-city photo) and `/profile/lightMode.webp` (5.8 MB) | MainSection, CreativeAbout | Keep the dark portrait (fits the new theme). The light one becomes unused because the theme becomes permanently dark. |

### 3.2 Social and external links (must stay operational)
| Label | URL | Where |
|---|---|---|
| GitHub | https://github.com/jeremiahpantaras | MainSection ×2, CreativeContact, JSON-LD |
| LinkedIn | https://www.linkedin.com/in/jeremiah-pantaras-47092b368/ | same |
| Facebook | https://www.facebook.com/https.poypoymignon | same |
| Instagram | https://www.instagram.com/jeremiahpantaras/ | same |
| Website (COS Devs) | https://www.cosedevs.com/ | MainSection socials, company card, footer, CreativeContact |
| Conference | `https://portal.connectingasia.org/conference/schedule/aic?...` (long `_gl`/`_ga` tracking query) | MainSection badge |

⚠ **GitHub identity conflict:** socials point to `jeremiahpantaras`, but the Satoru and Askium repos are under `Yirmeyahuu` (the username you gave for this task).
⚠ **Website conflict:** JSON-LD `sameAs` lists `https://cosdevsph.vercel.app/`, while the UI uses `https://www.cosedevs.com/`.
`index.html` declares `twitter:creator @jeremiahpantaras`, but no Twitter/X link appears in the UI.

### 3.3 COS Devs / role
| Source | Wording |
|---|---|
| MainSection company card | "Co-Founder and Lead Project Manager • COS Devs" — "Leading a team of passionate developers building innovative solutions for startups and MSMEs" |
| MainSection `experiences[0]` | "Software Engineer - Full-Stack Developer", COS Devs, 2025, current |
| `Experience.jsx` | "Software Engineering Lead", COS Devs, 2025, current |
| `portfolio-context.json`, `index.html` description | "Founder & CEO" |
| `About.jsx` | "founded COSDevs (City of Smiles Developers)" in 2025 |

⚠ **Four different titles** appear, and Founder and Co-Founder contradict each other. The owner must pick the canonical title.

### 3.4 Experience (union of all sources)
| Role | Org | Year | Current | Sources |
|---|---|---|---|---|
| (COS Devs role, see 3.3) | COS Devs | 2025 | yes | all |
| Project Manager / Lead Web Developer | Computer Science Thesis | 2024 | yes ⚠ | MainSection, Experience.jsx |
| Freelance Full-Stack Developer | Bacolod City, Philippines | 2024 | yes | MainSection, Experience.jsx |
| Intern – Web Developer | "Local Startup" | 2023 | no | Experience.jsx only |
| Student Assistant – IT | STIWNU-CICT | 2022 | no | Experience.jsx only |
| Creative + Full-Stack Web Developer (built Asikaso) | Mediabox Network | — (no dates) | — | About.jsx prose only |
| Open-Source Developer | — | 2023 | — | portfolio-context.json only |
| Presented thesis at 11th Asia International Conference, Kuala Lumpur | — | 2025 | — | badge, context JSON |

⚠ The thesis role is marked "current", but About says Batch 2026 graduate.
⚠ Mediabox Network is not listed as an experience entry.
Action: **Reorg** into one experience timeline once the owner settles the conflicts. No dates may be invented.

### 3.5 Education
STI West Negros University, BS Computer Science (JSON-LD `alumniOf`, About, context JSON).
⚠ About says "24-year-old Computer Science graduate (Batch 2026)". The context JSON says "23 years old… currently finishing".
Recommendation: show the degree and university. Omit age (it goes stale). Graduation status needs owner confirmation.

### 3.6 Projects (union; `Projects.jsx` is the superset)
| # | Title | Link | Home list | Image available |
|---|---|---|---|---|
| 1 | Orki – Board Exam Review Platform | https://orki.cosedevs.com | ✓ (top 3) | — |
| 2 | Incognito – Anonymous Messaging App | https://incognito.cosedevs.com | ✓ (top 3) | — |
| 3 | Asikaso – Task Management Application | *(none)* | ✓ (top 3) | — |
| 4 | ePuno | https://epuno.vercel.app | ✓ | — |
| 5 | Recivo – Receipt Generation Platform | https://recivo.cosedevs.com | ✓ | — |
| 6 | Satoru – Automated learning tool | https://github.com/Yirmeyahuu/satoru | ✓ | — |
| 7 | Askium – AI Chatbot with Ollama | https://github.com/Yirmeyahuu/Askium | ✓ | — |
| 8 | Mabels – Restaurant Management System | https://github.com/jeremiahpantaras/Mabels | ✓ | — |
| 9 | Sentinels Student Management System | https://sentinelsadmin.onrender.com | ✓ | — |
| 10 | Open Source Car Management System | https://github.com/jeremiahpantaras/Car-Management-System | ✓ | — |
| 11 | Open Source QR Generator | https://github.com/jeremiahpantaras/python-qr-generator | ✓ | — |
| 12 | Tabang Negros – Emergency Help Request System | https://tabangnegros-installation.vercel.app/ | ✓ | — |
| 13 | Avendro – Lending Management System | https://avendrobcd.onrender.com/ | ✓ | **`src/assets/images/project1.webp`** (verified: Avendro landing page) |
| 14 | Sentinels – Gamified Cybersecurity Education | `#` (none) | Projects only | possibly `project2.webp` (pixel-art game, **unconfirmed**) |
| 15 | Marketplace – E-commerce Platform | `#` (none) | Projects only | possibly `project3.webp` ("Exclusive" e-commerce UI, **unconfirmed**) |
| 16 | Construction Inventory Management System | `#` (none) | Projects only | — |

Every project has a title, description, and tag list in `Projects.jsx`. **There are no years, roles, outcomes, or metrics, and none may be invented.**

Copy issues to fix (Rewrite, owner approval):
- Asikaso's description calls it "ASIK".
- Mabels' description says "MBALES".
- ePuno's description is vague.
- Homepage project cards have `cursor-pointer` but no link.

Do not reuse the numbers visible inside the Avendro screenshot (e.g., "₱10M+"). They are the product's own marketing UI, not portfolio achievements.

### 3.7 Tech stack
- **Home** (`MainSection.techStack`) is a subset: frontend, backend, database, tools.
- **Full list** (`TechStacks.jsx`, the superset):
  - Frontend: JavaScript, TypeScript, React, Next.js, Vue.js, Tailwind CSS, HTML5, CSS3, Sass, Redux, Vite
  - Backend: Node.js, Python, PHP, Django, Express.js, REST API, GraphQL
  - Database: PostgreSQL, MongoDB, MySQL, Firebase, SQLite
  - Tools: Git, Bitbucket, Docker, AWS, Firebase, Vercel, Render, Postman, Jira, Trello, Notion, N8N, Atlassian Suite
  - UI/UX: Figma, Adobe XD
  - Multimedia: Adobe Premiere, Photoshop, Illustrator, After Effects, DaVinci Resolve, Pixelmator Pro, Canva

Action: **Reorg** into one source. No proficiency ratings exist, and none should be added.

### 3.8 Certifications and recognition
| Title | Issuer | Year |
|---|---|---|
| ICT Olympics Web Design and Development Champion | STIWNU-CICT | 2022 |
| ICT Olympics Web Design and Development 3rd Placer | STIWNU-CICT | 2023 |
| "Philippine Institute of Cyber Security Professionals Inc." ⚠ (this title is the organization name, so the actual credential is unclear) | PICSPRO Inc. | 2023 |
| Presented at the 11th Asia International Conference 2025 (Kuala Lumpur) | — | 2025 |

Action: **Emphasize** the two awards and the conference presentation. `src/assets/images/PicsPro.png` exists but is unreferenced.

### 3.9 Seminars and workshops (`Workshop.jsx`; the home page shows 3)
| Title | Organizer | Year |
|---|---|---|
| DevFest Workshop Series: Intro to Web Development | GDG Bacolod | 2025 |
| House of Algorithm Seminar and Workshop | STIWNU Programmers' Guild | 2025 |
| Mastering Figma | STIWNU Programmers' Guild | 2024 |
| Mastering Dimensions: 2D and 3D Concept Arts | Holysoft Studios | 2024 |
| PICSPRO Workshop | PICSPRO Inc. | 2024 |
| From Sketch to Screen | STIWNU Programmers' Guild | 2023 |
| "Programerss' Guild: IMentor Workshop" (typo) | STIWNU Programmers' Guild | 2022 |

The data doesn't say whether he attended or spoke. The page heading says "Attended".

### 3.10 About story (`About.jsx`)
Six paragraphs with `/about-img/1–6.webp` (7.5 MB in total). They cover:
- age and graduation;
- first year of college;
- Django in 2023 and the first freelance client in 2024;
- founding COSDevs in 2025;
- Mediabox Network: creative work plus Asikaso;
- a closing reflection.

Action: **Keep** the text. Restyle as an editorial long-read.

### 3.11 Gallery
- 23 photos at `/gallery/1–23.webp` (57 MB in total; single files up to 12 MB, e.g. `10.webp` and `14.webp` at 4032×6048).
- Titles are generated ("Highlight N") and every date is hard-coded to `'2024'`.
- These are **placeholders**, not real captions, so don't present them as facts.

### 3.12 Creative side (`/creative`)
- **Hero:** "THE CREATIVE SIDE", intro paragraph, buttons for Explore Work, Creative Resume (`/creative-assets/creative-resume/creative-resume.pdf`, 5.4 MB), and Back to Developer. The background is `src/assets/images/hero-background.webp` (1.4 MB, bundled).
- **About:** "BEHIND THE LENS", two paragraphs, dark portrait.
- **Gallery:** `/creative-assets/creative-gallery/1–20.webp`. ⚠ **`10.webp` does not exist** (the file is named `10 2.webp`), so item 10 silently hides itself. `0.webp` is unused.
- **Services:** 6 disciplines in ChromaGrid. ⚠ The images are **Unsplash stock URLs**, the handles are **placeholders** (`@photographer`, …), and every URL is `#`.
- **Contact:** "LET'S CREATE TOGETHER", `mailto:`, socials.

### 3.13 AI chat
- A floating "Chat with Jeremiah" button opens a first-person Gemini persona.
- Its knowledge comes from `src/data/portfolio-context.json` (`context: string[]`).
- Keep this functionality.

### 3.14 Footer
- Name plus the "Junior Software Engineer…" blurb.
- Socials; quick links (About, Experience, Projects, Tech Stack).
- Contact: location, email, COS Devs.
- © current year.

---

## 4. Assets
| Path | Size | Used by |
|---|---|---|
| `public/profile/darkMode.webp` / `lightMode.webp` | 5.4 MB / 5.8 MB (3375²) | MainSection (above the fold, shown at ≤224 px); CreativeAbout |
| `public/gallery/1–23.webp` | 57 MB in total | MainSection (3, **no lazy loading**), Gallery |
| `public/creative-assets/creative-gallery/*` | ~38 MB (whole folder, including the hero bg and resume) | creative pages |
| `public/about-img/1–6.webp` | 7.5 MB | About |
| `public/Resume.pdf` | 262 KB | OpenCv modal |
| `public/COSDevsLogo2026.svg` | — | company card |
| `public/poypoyrelicon.svg` | — | favicon, Preloader |
| `public/profile.png` | — | chat avatar |
| `public/portfolioThumbnail.png` | — | OG/Twitter image, sitemap |
| `src/assets/images/hero-background.webp` | 1.4 MB | CreativeHero (bundled) |
| **No code reference found** | | `src/assets/images/{PicsPro.png, project1–3.webp, teamProfile/*}`, `src/assets/react.svg`, `public/{COSDEVSLOGOTEXT.*, COSDEVSLOGOrelicon.*, poypoyrelicon.png, vite.svg, poypoy.png (only the unused avatar field), creative-assets/hero-bacground.webp, creative-assets/creative-gallery/0.webp, "10 2.webp"}` |

---

## 5. SEO and deployment
- `index.html` contains:
  - title, description, keywords, and canonical `https://jeremiah.cosedevs.com/`;
  - OG/Twitter tags (`portfolioThumbnail.png`, 1200×630);
  - geo meta and JSON-LD `Person`;
  - the Google site verification meta;
  - `theme-color #1a1a1a`.
- **No per-route titles or meta.**
- `public/sitemap.xml` lists 7 URLs. It omits `/gallery`, `/creative`, and `/creative/gallery`.
- `public/robots.txt` points to the sitemap.
- Vercel SPA rewrite; Vercel Analytics and Speed Insights are active.

---

## 6. Verified issues (relevant to the redesign)
1. **The API key is exposed.** `VITE_GEMINI_API_KEY` is inlined into the public bundle, and user input is interpolated into the prompt. Commit `8efe7ff` deliberately moved the AI call from the backend to the frontend.
2. **Console and devtools are blocked.** An `index.html` script no-ops `console.log/debug/warn/info/error`, clears the console every second, and swallows F12, Ctrl+Shift+I/J/C, and Ctrl+U. This hides runtime errors during implementation.
3. **An artificial 1.5 s delay** precedes every page (fake skeletons and preloader).
4. **Duplicated data has drifted** between MainSection, the subpages, About, the context JSON, and `index.html` (see §3).
5. **Navigation causes full reloads.** Internal links in MainSection are `<a href>`, not `<Link>`. There is no global navigation and no 404 route.
6. **Image weight is extreme.** The above-the-fold portrait is 5.4 MB, and gallery files reach 12 MB.
7. **No code splitting.** The 201 kB-gzip main chunk includes the Gemini SDK, react-markdown, GSAP, and every route.
8. **Missing creative image.** `creative-gallery/10.webp` is missing.
9. **JSX bug.** `class=` is used instead of `className` on an SVG (`MainSection.jsx:331`).
10. **Accessibility gaps:**
    - clickable `div`s (gallery tiles, ChromaGrid cards) aren't keyboard reachable;
    - modals lack `role="dialog"` and a focus trap;
    - the chat close button has no label;
    - the `onKeyPress` event is deprecated;
    - alt text is generic;
    - `animate-pulse` and `animate-bounce` loop forever with no reduced-motion handling outside `/creative`.
11. **Lint fails** (3 errors). There are no tests and no type-check.
12. **Config drift.** `tailwind.config.js` and `App.css` are inert, and the `brandBlue`/`font-heading` tokens are unused.

## 7. Constraints for the redesign
- **Preserve:**
  - all 10 routes (plus SPA rewrite on Vercel);
  - every external and project link in §3;
  - the CV modal and download;
  - the creative resume;
  - the AI chat;
  - image modals with download;
  - Vercel Analytics and Speed Insights;
  - the `index.html` SEO meta and JSON-LD.
- **Keep native scroll.** `lenis` is installed, but adopting it would contradict the "native scroll" requirement.
- **React version.** React 19.2.0 is compatible with `@react-three/fiber@9.8.2` (peer `react >=19 <19.4`) and `@react-three/drei@10.7.9` (peer `^19`). The `^19.1.1` range in `package.json` could someday resolve to 19.4+. The lockfile pins it today.

## 8. Could not verify
- Vercel environment settings, and whether the Gemini key carries referrer or quota restrictions.
- Whether the repo is public.
- Which project `project2.webp` and `project3.webp` depict.
- Whether the live project URLs are still up (not fetched).
- **The typography reference image.** It was not attached to the request and was not found on disk. All typography decisions are therefore provisional (see 01 §3).
