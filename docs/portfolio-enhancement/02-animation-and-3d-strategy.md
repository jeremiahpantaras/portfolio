# 02 — Animation & 3D Strategy

> One motion system tells one story: **a drop falls from the hero, breaks the waterline, and the page descends into calm, deeper water.**
> Library facts below were verified on 2026-10-27 against the installed `node_modules`, the npm registry, and the React Bits registry (`reactbits.dev/r/<Name>-TS-TW.json`).

---

## 1. Motion principles and tokens
- **Motion explains structure.** It reveals hierarchy, signals interactivity, or carries the descent narrative. Nothing moves "just because".
- **Looping elements are limited to three:** the 3D drop's idle, the waterline marquee, and the ambient waves. All three pause off-screen and stop under reduced motion.
- **Reveals play once** (`once: true`). Only scrubbed effects (drop fall, parallax, depth tint) are tied bidirectionally to scroll.
- **Native scroll always.** No Lenis (it is installed but unused; removal is proposed), no ScrollSmoother, no `pin`, no snap.
- **Compositor-only properties:** animate only `transform`, `opacity`, and `clip-path`. Never animate layout properties or large-area `filter: blur`.

| Token | Value |
|---|---|
| `ease.out` | `expo.out` (entrances) |
| `ease.soft` | `power3.out` (UI, small moves) |
| `ease.scrub` | `none` (scrubbed timelines) |
| `dur.micro` | 0.15–0.25 s (hover, focus) |
| `dur.ui` | 0.3–0.45 s (menus, modals) |
| `dur.reveal` | 0.8–1.2 s (text and section reveals) |
| `stagger.char` | 0.015–0.03 s · `stagger.word` 0.04–0.06 s · `stagger.item` 0.06–0.1 s |
| `distance.reveal` | 16–32 px (never more than 40 px) |

## 2. Library decisions
| Library | Status | Decision |
|---|---|---|
| `gsap` 3.15.0 + `@gsap/react` | installed | **Core engine.** Use `ScrollTrigger` and `SplitText` (both in the installed package). `MorphSVGPlugin` is also present but not needed. |
| React Bits | copy-in components, **MIT + Commons Clause** (fine for a personal portfolio; prohibits *selling* the components) | Vendor 3–4 components (table below) as **JS + Tailwind** variants, matching the repo's JSX and ESLint coverage. Copy them manually into `src/components/reactbits/` with a header comment (source URL, date, license). Don't add shadcn config. |
| `three` + `@react-three/fiber` | not installed (latest: three 0.186.1; fiber 9.8.2, peer `react >=19 <19.4`) | **Add in Phase 4 only**, lazy-loaded. Justification is in §4.2. |
| `@react-three/drei` | not installed (10.7.9) | **Not needed.** The GLB loads via `three/examples/jsm` loaders, and the custom shader needs no environment maps. Reconsider only if a later feature needs it. |
| `motion` (Framer Motion) | not installed | **Don't add.** It's only required by React Bits `ScrollVelocity`/`BlurText`, which GSAP equivalents replace. |
| `lenis` | installed, unused | Propose removal (Phase 9, ⚠ approval) |

### React Bits selection
| Component | Dependencies (verified) | Use here | Decision |
|---|---|---|---|
| **CurvedLoop** (Text) | React only | Waterline marquee, text flowing along the wave | **Use** |
| **ScrollReveal** (Text) | gsap | About statement: words go from dim to bright as you scroll | **Use** (set its rotation/blur options to 0, so you get an opacity-only scrub) |
| **SplitText** (Text) | gsap, @gsap/react | Section headings: self-contained line reveal | **Use** for section headings. The hero uses `gsap/SplitText` directly because it must share one orchestrated timeline. |
| **Magnet** (Animations) | React only | Primary hero CTA: small magnetic pull on fine pointers | Optional (low strength, disabled under reduced motion and on touch) |
| **ChromaGrid** (Components) | gsap | Already used in `/creative` | Keep |
| Waves / LineWaves (Backgrounds) | React only (canvas) | Contact-section ambience | Optional, only if the perf budget in doc 04 still holds |
| LiquidEther (Backgrounds) | React only (WebGL fluid) | — | **Reject.** It's a second WebGL context running a per-frame simulation, which is overkill for the effect. |
| ModelViewer (Components) | fiber, drei, three | — | **Reject.** It's a generic orbit viewer; we need a custom shader and interaction. |
| ScrollVelocity, BlurText | `motion` | — | **Reject** (they'd add a dependency for one effect) |
| GradualBlur, LiquidChrome, Hyperspeed, etc. | — | — | **Reject** (off-direction or blur-heavy) |

Before vendoring, the implementer must open each component's source and confirm three things: it handles `prefers-reduced-motion` (the source files for CurvedLoop, ScrollReveal, SplitText, and Magnet reference it), it cleans up its listeners, and it uses no `class=`/`window` access at module scope.

## 3. GSAP architecture
- **`src/lib/gsap.js`:** the only file that imports and registers plugins (`gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)`). It exports `gsap`, `ScrollTrigger`, `SplitText`, and the motion tokens. `CreativeHome.jsx` migrates to it so plugins aren't registered twice.
- **`src/hooks/useReducedMotion.js`:** `matchMedia('(prefers-reduced-motion: reduce)')` with a change listener. Inside animations, prefer `gsap.matchMedia()` with `{ full: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }`.
- **Scoping:** every animation lives in `useGSAP(() => {…}, { scope: ref })`, which reverts automatically on unmount, including `SplitText` instances and ScrollTriggers.
- **Re-splitting:** use `SplitText.create(el, { type: 'lines,words', mask: 'lines', autoSplit: true, onSplit: self => gsap.from(...) })`. This re-splits correctly after font load and resize (GSAP ≥ 3.13 behavior).
- **No React state in hot paths.** Scroll and pointer handlers write to refs, `gsap.quickTo`, or `gsap.quickSetter`, or R3F `useFrame`.
- **Route changes:** `<ScrollToTop/>` resets scroll on pathname change (except hash links) and then calls `ScrollTrigger.refresh()`. Also call `ScrollTrigger.refresh()` once after `window` `load` (late images).
- **Anti-flash (FOUC) rule:**
  - The `index.html` head script adds `js` to `<html>`.
  - CSS hides `.js [data-reveal]` with `visibility:hidden`, plus a **failsafe** animation that makes them visible after 2.5 s if JS never runs the reveal.
  - GSAP uses `autoAlpha`, so it takes control from there.
  - Without JS, nothing is hidden.

## 4. Hero 3D concept: "The Drop"

### 4.1 What the visitor sees
- To the right of the name sits a single dark, liquid-glass **drop**: a near-black body (`#0b0d10`) whose silhouette slowly breathes with low-frequency noise.
- A thin **tide-cyan fresnel rim** (`#5cc8ff`) traces its edges and fades to soft white at grazing angles, with a small specular highlight from the top left.
- Faint horizontal caustic bands drift across its surface (shader, 3% intensity).
- There is no background: the canvas is transparent over ink-black.

**Visual purpose:**
- It anchors the composition opposite the heavy typography.
- It introduces the water narrative the scroll continues.
- It signals frontend and shader craft without competing with the name.

**What it is not:** spinning tech logos, a laptop model, particles, or anything that hides text.

### 4.2 Implementation options
| Option | Bundle (lazy) | Pros | Cons | Verdict |
|---|---|---|---|---|
| **R3F 9 + three** | ~fiber + three core (measure in Phase 4; budget ≤ 260 kB gzip for the lazy chunk) | Declarative React lifecycle and automatic disposal, `useFrame`, `useLoader` for GLB, the ecosystem you asked for, and compatible with React 19.2 | The largest option | **Recommended** |
| OGL | ~30–40 kB gzip | Very light; React Bits backgrounds use it | Manual lifecycle in React and a thinner GLB loader story | Viable fallback if the measured R3F chunk blows the budget |
| Raw three | same as three | No fiber | Manual React integration, cleanup, and resize | Inferior to R3F at the same cost |
| CSS/SVG only | 0 | Cheapest | No real depth or pointer-reactive lighting | **Used as the poster and fallback** |

### 4.3 Geometry and material
- **Shipping geometry (procedural, no asset needed):** `IcosahedronGeometry(1, 32)` (about 21k triangles). The vertex shader shapes it:
  - 3D simplex-noise displacement along the normal: amplitude `0.10 + uAgitation*0.10`, frequency 1.2, time `t*0.25`.
  - A teardrop taper: points with `y > 0` are scaled in x/z by `1 - smoothstep(0.0, 1.0, y) * uTaper` (`uTaper` rests at 0.35).
  - A fall stretch: y is scaled by `1 + uStretch`.
  - Normals are recomputed from two tangent-offset samples, the standard displaced-sphere technique.
- **Material:** a custom `ShaderMaterial` (`src/components/hero/dropMaterial.js`) with no scene lights:
  - `fresnel = pow(1 - dot(N, V), 2.5)`;
  - `color = mix(ink, mix(tide, white, pow(fresnel, 3.0)), fresnel)`;
  - Blinn-Phong specular from light direction `normalize(-0.4, 0.8, 0.6)`, shininess 64, intensity 0.6;
  - caustic term `0.03 * sin(worldPos.y * 12.0 + t)` added to the rim only.
- **Noise source:** the simplex-noise GLSL comes from Ashima/stegu `webgl-noise` (MIT). Inline it with attribution.
- **Camera and canvas:**
  - camera `fov 35`, position `[0, 0, 4.2]`;
  - Canvas `alpha: true`, `antialias: true`, `dpr={[1, 1.75]}`;
  - `powerPreference: 'high-performance'`;
  - `aria-hidden="true"`, `pointer-events: none` (clicks always reach the CTAs).

### 4.4 Pointer interaction (fine pointers only)
| Parameter | Value |
|---|---|
| Pointer source | `window` `pointermove` (passive), active only when `matchMedia('(pointer: fine)')` matches. The pointer is normalized to `nx, ny ∈ [-1, 1]` across the viewport. |
| Rotation target | `rotY = nx * 0.26 rad (±15°)`, `rotX = -ny * 0.17 rad (±10°)` |
| Parallax target | `pos.x = nx * 0.12`, `pos.y = -ny * 0.08` (world units) |
| Smoothing | `THREE.MathUtils.damp(current, target, λ = 3.5, dt)`, frame-rate independent; `dt` is clamped to ≤ 1/30 s so a tab switch never causes a jump |
| Liquid response | `uAgitation` damps toward `clamp(pointerSpeed * 0.002, 0, 0.35)` with λ = 2, so fast movement makes the surface ripple more and it settles back |
| Idle state | 3 s after the last pointer move, the targets ease to 0 (λ = 1.5) and idle motion takes over: `rotY += 0.06 rad/s`, `pos.y = sin(t*0.7)*0.05` |
| Limits | No full spins, no tilt beyond ±15°, no camera movement. The object never leaves its column. |

**Touch devices** get no pointer tracking: the idle motion plus scroll coupling (§4.5) only. Gyroscope is intentionally not used, because iOS requires a permission prompt and the motion is distracting.

**Keyboard and assistive tech:** the object is decorative (`aria-hidden`). Nothing about it is required to use the site.

### 4.5 Scroll coupling (the fall)
- A ScrollTrigger on the hero (`start: 'top top'`, `end: 'bottom top'`, `scrub: true`) writes progress `p` into a ref.
- `useFrame` reads it each frame:
  - `pos.y -= p * 1.2`: the drop falls toward the waterline.
  - `uStretch = p * 0.25`: it elongates as it falls.
  - `scale = 1 - p * 0.15`.
  - The canvas `opacity` goes from 1 to 0 over `p ∈ [0.75, 1]`.
- When `p` crosses 0.9 while scrolling **down**, a one-shot **ripple** fires on the waterline (see §5.2).
- When the hero leaves the viewport (IntersectionObserver), set `frameloop = 'never'`. Also stop it while `document.hidden`.

### 4.6 Loading strategy and fallbacks
1. `Hero.jsx` always renders **`HeroPoster`** in a fixed-aspect square container, so there is no layout shift. The poster is pure CSS until a real render exists:
   - `radial-gradient(circle at 35% 30%, #2a2f36 0%, #0b0d10 45%, #050506 72%)`, with a subtle tide inset box-shadow rim and a teardrop `border-radius` shape;
   - later replaced by `public/images/hero/drop-poster.webp` (≤ 80 kB), rendered from the final scene or from Blender.
2. **`useCanRender3D()`** returns true only when:
   - WebGL is available (test context creation);
   - motion isn't reduced;
   - `navigator.connection?.saveData` isn't set;
   - `(navigator.deviceMemory ?? 8) >= 4`;
   - `hardwareConcurrency >= 4`;
   - **`min-width: 768px`**. ⚠ Live 3D on phones is an approval decision; the recommendation is poster-only below 768 px.
3. If true: after `document.fonts.ready` and `requestIdleCallback` (1500 ms timeout), load `React.lazy(() => import('./HeroScene'))` inside `<Suspense fallback={<HeroPoster/>}>`. When the first frame renders (`onCreated` plus one `useFrame` tick), cross-fade from the poster to the canvas over 0.8 s.
4. **Failure handling:**
   - An error boundary around the Canvas falls back to the poster.
   - A `webglcontextlost` listener also falls back to the poster.
   - **Perf guard:** average the frame time over the first 90 frames. Above 25 ms, set `dpr` to 1. If it's still above 33 ms, fall back to the poster and stay there for the session (`sessionStorage`).
5. **Bundle check:** after the build, `three` must appear **only** in the lazy HeroScene chunk, never in the entry chunk.

### 4.7 Blender strategy (optional upgrade; the site never depends on it)
The procedural drop is the complete, shippable implementation. A Blender asset adds value only if you want a **signature hand-sculpted silhouette**, such as a drop at the moment of impact with a small crown splash. **No Blender asset exists today, and I can't operate Blender.** This is the workflow for you or a 3D artist:
1. **Model** in Blender 4.x. Start from a UV sphere and sculpt or deform it to the silhouette.
   - Budget: ≤ 15k triangles.
   - Apply all transforms (Ctrl+A). Origin at the visual center, Y-up. Shade Smooth.
   - **No textures**: the look comes from the code shader, so the file stays tiny.
   - Optional **shape keys** `rest` and `stretch`, exported as glTF morph targets, to replace the shader's `uStretch`.
2. **Export:** glTF 2.0 Binary (`.glb`) with these settings: Selected Objects, +Y Up, Apply Modifiers, Normals on, Materials: none or placeholder, Shape Keys on if used, compression off.
3. **Optimize:** `npx @gltf-transform/cli optimize in.glb hero-drop.glb --compress meshopt`. This is a one-off CLI; it is **not** added to `package.json`. Target ≤ 300 kB.
4. **Place** the file at **`public/models/hero-drop.glb`**.
5. **Load** with `useLoader(GLTFLoader, '/models/hero-drop.glb', l => l.setMeshoptDecoder(MeshoptDecoder))`. Both come from `three/examples/jsm`, so no Drei is needed. Take the first mesh's geometry and apply the **same** `dropMaterial`.
6. **Switching** is a prop: `<Drop source="procedural" | "glb" />`. If the GLB fails to load, it falls back to procedural.
7. **Poster:** render a transparent 1200² PNG and convert it to WebP (≤ 80 kB) at `public/images/hero/drop-poster.webp`.

## 5. Scroll narrative: the descent

### 5.1 Technique evaluation
| Option | Visual | Runtime cost | Verdict |
|---|---|---|---|
| **A. SVG wave paths + GSAP** (waterline, ripple, ambient lines) **+ CSS depth tint** | crisp, controllable, on-brand lines | Near zero: transform and opacity only, plus short path regeneration while the wave is excited | **Selected** |
| B. React Bits Waves/LineWaves (canvas 2D) | pointer-reactive line fields | Continuous full-screen redraws, which costs CPU on low-end devices | Optional for Contact only, gated by budget |
| C. React Bits LiquidEther (WebGL fluid) | real fluid | Second WebGL context and a per-frame simulation | Rejected |
| D. Custom full-page shader transitions | most cinematic | High complexity and a11y risk | Rejected |

### 5.2 Layers
1. **Waterline** (`src/components/motion/Waterline.jsx`) between the hero and About:
   - **CurvedLoop** marquee of the tech list.
   - Behind it, an SVG wave path `y = 80 + A·sin(2πx/λ + φ)` (viewBox 1440×160).
   - The amplitude `A` rests at 6 px. ScrollTrigger velocity excites it: the target is `clamp(|v|/40, 6, 28)`, decaying via `gsap.quickTo`.
   - The path's `d` attribute is regenerated in a `gsap.ticker` callback **only while A ≠ rest**, and the listener is removed once it settles.
   - `φ` advances 0.4 rad/s only while in the viewport.
   - **Ripple:** an SVG ellipse at the drop's x position goes `scale 0→1.6` and `opacity .5→0` over 1.2 s, fired once per downward crossing.
2. **DepthBackdrop** (`src/components/motion/DepthBackdrop.jsx`): `position: fixed`, `inset: 0`, `z-index: -1`, `pointer-events: none`.
   - **Tint:** a `linear-gradient(to bottom, transparent, var(--color-brandBlue-darkest))` layer whose `opacity = depth * 0.25`. `depth` is the document scroll progress, written with `gsap.quickSetter`.
   - **Ambient waves:** three thin SVG lines (`tide-deep`, 6–10% opacity) at different heights. They drift horizontally with a 40–70 s CSS loop and parallax vertically at three speeds (scrubbed `yPercent`). They fade in only after `depth > 0.1`.
3. **Section reveals** (once):
   - **Section label + hairline:** the line goes `scaleX 0→1` (origin left, 1.0 s `power3.out`); the label fades.
   - **Section heading:** React Bits SplitText, or the shared hook: lines masked, `yPercent 110→0`, stagger 0.06, 1.0 s `expo.out`, starting at `top 80%`.
   - **About statement:** React Bits **ScrollReveal**, word opacity 0.15→1, scrubbed from `top 75%` to `bottom 60%`.
   - **Project rows:** `ScrollTrigger.batch('.project-row')`, `y 24→0`, `autoAlpha 0→1`, stagger 0.08. Each row's hairline draws first.
   - **Capabilities:** items stagger 0.03 per column.
   - **Gallery tiles:** `clip-path: inset(100% 0 0 0) → inset(0)`, 1.0 s, stagger 0.08. They "rise from the water".
   - **Creative band:** the background image is scrubbed from `yPercent -8` to `8`.
   - **Contact email:** chars `yPercent 100→0`, stagger 0.015.

### 5.3 Hero entrance timeline
It starts after `document.fonts.ready`, with a 600 ms cap. Defaults: `ease: expo.out`.

| t (s) | Target | Animation | Duration |
|---|---|---|---|
| 0.00 | Nav | `autoAlpha 0→1`, `y -12→0` | 0.6 |
| 0.10 | Hero label | mask `yPercent 100→0` | 0.7 |
| 0.15 | Name (`SplitText` lines + chars, masked) | `yPercent 110→0`, stagger 0.025 | 1.1 |
| 0.30 | Drop (poster or canvas) | `autoAlpha 0→1`, `scale .92→1` (`power3.out`) | 1.6 |
| 0.55 | Value proposition (lines) | `autoAlpha`, `y 16→0`, stagger 0.08 | 0.9 |
| 0.75 | CTAs + socials | `autoAlpha`, `y 12→0`, stagger 0.06 | 0.7 |
| 1.10 | Scroll cue | fade in, then a 2-cycle 4 px bob (**not infinite**) | — |

This replaces the 1.5 s `Preloader` and `MainSkeletonLoader` (⚠ approval). The page is interactive immediately; the entrance only decorates it.

## 6. Hover and pointer details (non-3D)
- **Project preview** (only rows with images; fine pointers only): a fixed-position `<img>` follows the pointer. Its x/y are driven by `gsap.quickTo(..., { duration: 0.5, ease: 'power3' })`, offset 24 px from the cursor. It fades in at 0.25 s and stays inside the viewport. It is `aria-hidden`; the row link carries the meaning.
- **Magnet CTA** (optional): strength ≤ 0.15, padding 40 px, fine pointers only.
- **Links and buttons:** see doc 01 §5. CSS transitions only; no JS.

## 7. Reduced-motion and non-pointer matrix
| Effect | Default | `prefers-reduced-motion: reduce` |
|---|---|---|
| Hero entrance | split choreography | a single 0.4 s opacity fade of the hero block |
| 3D drop | live WebGL | **static poster; no canvas loaded** |
| Waterline marquee | flowing | static text along the curve |
| Waterline wave and ripple | animated | static path, no ripple |
| Depth tint and ambient waves | scrubbed and drifting | tint fixed at 0; waves hidden |
| Section reveals | masked translate | opacity 0.3 s, or shown immediately |
| ScrollReveal statement | word scrub | fully opaque text |
| Parallax (creative band) | scrub | none |
| Project preview follow | follows cursor | static thumbnail beside the row |
| Hover | color, underline, small translate | color and underline only |
| `/creative` blur-reveal | already handled (opacity only) | unchanged |

**Touch and coarse pointers:** no pointer-follow effects, no Magnet, and no hover-only information. Every hover reveal has a visible default.

## 8. Lifecycle and performance rules
1. One WebGL context on the whole site (the hero only).
2. `frameloop: 'never'` when off-screen or the tab is hidden. Pause GSAP loops (marquee, φ advance) off-screen via IntersectionObserver.
3. Dispose geometry and material on unmount. R3F handles this when the objects are created declaratively; any manually created objects must be disposed in cleanup.
4. Apply `will-change: transform` only during an active animation (GSAP `force3D` handles most cases). Never set it statically on large containers.
5. No `filter: blur()` animations on new sections.
6. `ScrollTrigger.refresh()` after fonts and images load, and after route changes. Never inside scroll handlers.
7. Measure with Chrome Performance and Lighthouse on the `npm run preview` build. Budgets are in doc 04.
