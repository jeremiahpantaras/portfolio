import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import useReducedMotion from '../../hooks/useReducedMotion';
import { markSkyRevealed, skyRevealed, whenPreloaderDone } from '../../lib/preloader';

// The home page's night sky as ONE WebGL canvas behind the whole page, painted by one fragment shader with no photos or
// video: a procedural Milky Way (bright core, dust lanes, star clouds), stars with real stellar colours, a volumetric-style
// aurora (curtains with rays, green at the bottom to violet at the top) and a snow-capped mountain range at the end of the page.
// Scrolling moves the sky from the inside, as if you were falling through it: the aurora's curtains drift toward you and
// zoom, the Milky Way and the stars slide up more slowly, and the camera tilts up a little. Past the hero the aurora dims
// to a faint glow so the text stays readable, and the mountains pop up when you reach the end of the page.
// The mouse pointer lights the sky under it: the aurora, the Milky Way and the stars get brighter and richer in colour
// around it. Nothing else moves unless you scroll.
//
// It draws ON DEMAND: a frame is rendered only after the scroll position, the pointer or the size changes, never in an
// idle loop. If WebGL is unavailable or the shader fails, nothing is drawn and AuroraScene's CSS glow stays.
const SCALE = 0.7; // backing-store scale: stars need some sharpness, the aurora and the Milky Way are soft
const MAX_SIDE = 1600; // cap on the backing store's longest side
const HERO_FADE = 0.8; // viewport heights of scrolling over which the hero look gives way to the dimmed one
const REVEAL_SECONDS = 4; // length of the opening reveal
const FLOOR = 0.1; // the aurora's strength once past the hero (1 = as bright as in the hero)

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uAdv;  // scrolled distance in viewport heights (the sky's flow)
uniform float uHero; // 0 in the hero, 1 once you have scrolled past it
uniform float uFloor;
uniform float uReveal; // the opening reveal: 0 = an empty sky, 1 = everything in
uniform vec3 uMouse; // pointer position in the same units as P, and how strongly the hover light is on (0..1)
uniform float uMount; // how close you are to the end of the page: 0 until the last 0.35 of a screen, 1 at the very end
uniform float uPop;   // the mountains' pop-up when you land at the end of the page: 0 = down out of sight, 1 = up

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 5; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(5.3, 1.7);
    a *= 0.5;
  }
  return s;
}

// Stars: three grids (bright, medium, faint). The faint ones are denser inside the Milky Way (band 0..1), and star
// colours follow stellar temperatures (orange, white, blue-white).
vec3 stars(vec2 p, float band) {
  vec3 sum = vec3(0.0);
  for (int k = 0; k < 3; k++) {
    float scale = k == 0 ? 34.0 : (k == 1 ? 90.0 : 230.0);
    float limit = k == 0 ? 0.988 : (k == 1 ? 0.955 - 0.03 * band : 0.92 - 0.08 * band);
    vec2 g = p * scale + float(k) * 17.0;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float hs = hash21(id);
    if (hs > limit) {
      vec2 at = vec2(hash21(id + 3.1), hash21(id + 7.7)) * 0.6 + 0.2;
      float mag = (hs - limit) / (1.0 - limit);
      float r = length(f - at);
      float size = k == 0 ? 0.13 : 0.1;
      float core = smoothstep(size, 0.0, r);
      float glow = k == 0 ? exp(-r * 14.0) * 0.12 * mag : 0.0;
      float t = hash21(id + 11.3);
      vec3 tint = t < 0.3 ? vec3(1.0, 0.78, 0.58) : (t < 0.75 ? vec3(1.0, 0.97, 0.92) : vec3(0.72, 0.82, 1.0));
      float lum = k == 0 ? 0.55 + 0.7 * mag : (k == 1 ? 0.3 + 0.4 * mag : 0.12 + 0.25 * mag);
      // the opening reveal: each star appears at its own moment, with a brief flare as it does
      float x = uReveal * 1.3 - hash21(id + 9.1) * 0.85;
      float appear = smoothstep(0.0, 0.18, x);
      float flare = 1.0 + 1.8 * exp(-pow((x - 0.1) / 0.09, 2.0));
      sum += tint * (core + glow) * lum * appear * flare;
    }
  }
  return sum;
}

// The Milky Way: a bright core with a warm glow, cooler arms, a ragged dust lane along the middle and patchy dark
// clouds, built from warped noise along a slightly curved band. Returns light (rgb) and the band weight in w.
vec4 milkyWay(vec2 p, float adv) {
  vec2 q = p - vec2(0.05, 0.5);
  float ang = 0.58 + 0.02 * min(adv, 8.0);
  float c = cos(ang);
  float s = sin(ang);
  float along = c * q.x + s * q.y;
  float across = -s * q.x + c * q.y;
  across -= 0.05 * sin(along * 1.9 + 0.7) + 0.025 * sin(along * 5.1);
  float core = exp(-along * along / 0.3);
  float w = 0.1 + 0.06 * core;
  float band = exp(-across * across / (2.0 * w * w));
  vec2 np = vec2(along * 4.0, across * 8.0);
  float cl = fbm(np + 1.8 * fbm(np * 0.7 + 9.0));
  float fine = fbm(np * 3.1 + 3.7);
  float laneC = across - 0.035 * sin(along * 3.0 + 1.0);
  float lane = exp(-laneC * laneC / (2.0 * pow(0.03 + 0.035 * core, 2.0)));
  float dust = lane * smoothstep(0.3, 0.72, fbm(vec2(along * 4.5, across * 15.0) + 5.0));
  float patch = smoothstep(0.52, 0.8, fbm(np * 1.5 + 20.0)) * band;
  float light = band * (0.25 + 0.9 * cl) * (0.4 + 0.9 * core);
  light *= (1.0 - 0.88 * dust) * (1.0 - 0.65 * patch);
  light += band * fine * 0.5 * (1.0 - 0.75 * dust);
  vec3 cool = vec3(0.62, 0.72, 0.95);
  vec3 warm = vec3(0.95, 0.82, 0.68);
  vec3 col = mix(cool, warm, smoothstep(0.35, 1.2, core * 1.2 + 0.2 * cl)) * light;
  col = mix(col, col * vec3(0.8, 0.55, 0.38), dust * 0.5); // dust reddens what shines through
  return vec4(col, band * (1.0 - 0.8 * dust));
}

// The aurora: curtains seen from below. Horizontal layers at rising altitude are sampled along the view ray; a sheet
// (a wavy ribbon on the ground plane) with fine rays along it gives the vertical curtain, so the folds, the converging
// rays and the sharp bright lower edge fall out of the geometry. Colour follows altitude: green at the bottom, teal
// above, violet and red at the top, with a pink fringe on the lower edge.
vec3 aurora(vec2 p, float adv, float steps, float m) {
  float zoom = 1.0 - 0.1 * (1.0 - exp(-0.5 * adv));
  float el = p.y * 1.3 * zoom + 0.26 + 0.05 * min(adv, 4.0);
  float az = p.x * 1.3 * zoom + 0.08;
  if (el < 0.03) return vec3(0.0);
  vec3 rd = normalize(vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el)));
  float jitter = hash21(gl_FragCoord.xy);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 24; i++) {
    if (float(i) >= steps) break;
    float fi = (float(i) + jitter) / steps;
    float alt = 0.9 + 1.7 * fi;
    float tt = alt / max(rd.y, 0.04);
    vec2 g = rd.xz * tt;
    g.y += 0.4 * adv; // the curtains drift toward you as you fall
    g.x += 0.15 * adv;
    // sheet 1 and a fainter, further sheet 2, each a wavy ribbon on the ground plane
    float c1 = 1.3 + 0.6 * sin(g.x * 0.8 + 0.9) + 0.5 * vnoise(vec2(g.x * 0.6, 1.3));
    float c2 = 3.0 + 0.9 * sin(g.x * 0.7 + 3.0) + 0.7 * vnoise(vec2(g.x * 0.5, 6.1));
    float d1 = (g.y - c1) / (0.22 + 0.12 * fi);
    float d2 = (g.y - c2) / (0.4 + 0.15 * fi);
    float dens = exp(-d1 * d1) + 0.55 * exp(-d2 * d2);
    // rays along the sheet: fine stripes with a slow modulation, brighter where the curtain folds
    float warp = 1.5 * vnoise(vec2(g.x * 0.7, g.y * 0.5));
    float rays = pow(vnoise(vec2(g.x * 7.0 + warp * 3.0, 4.0 + fi * 0.7)), 1.6);
    float gaps = 0.3 + 0.9 * vnoise(vec2(g.x * 1.1 + 9.0, g.y * 0.6));
    float amp = dens * (0.25 + 1.1 * rays) * gaps;
    // vertical profile: bright sharp lower edge, long fade upward
    float prof = smoothstep(0.0, 0.06, fi) * exp(-fi * 2.4);
    vec3 tint = mix(vec3(0.22, 1.0, 0.5), vec3(0.55, 0.28, 0.85), smoothstep(0.3, 1.0, fi));
    tint = mix(tint, vec3(0.2, 0.9, 0.78), 0.4 * smoothstep(0.1, 0.5, fi) * (1.0 - smoothstep(0.5, 0.9, fi)));
    tint += vec3(0.9, 0.15, 0.35) * smoothstep(0.07, 0.0, fi) * 0.5; // pink fringe on the lower edge
    acc += tint * amp * prof / (1.0 + 0.035 * tt);
  }
  acc *= 7.0 / steps * (1.0 + 0.9 * m); // under the pointer the curtains build up denser, so more of them shows
  return (1.0 - exp(-acc * 0.9)) * smoothstep(0.03, 0.12, el);
}


// Ridged noise: sharp creases, like the ridges and gullies of a rock face (0..~0.9).
float ridged(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(2.0 * vnoise(p) - 1.0);
    s += a * n * n;
    p = p * 2.07 + vec2(3.1, 7.3);
    a *= 0.5;
  }
  return s;
}

// The face of a mountain: creases that run down the slope. along is the distance down the slope and across the
// distance sideways, so the ridges and gullies stay parallel to the fall line, as on a real face.
float face(float across, float along, float seed) {
  return 0.6 * ridged(vec2(across * 9.0 + seed, along * 2.2)) + 0.4 * ridged(vec2(across * 22.0, along * 5.0 + seed));
}

// A snow-capped peak seen from the side (summit at x = px, height H, half-width W at the base). The silhouette is a steep,
// lopsided pyramid with ragged edges; inside it the creases run down the slopes and are lit from the left (the left
// faces catch the light, the right faces fall into shadow). Snow lies in irregular patches that grow toward the
// summit, and bare dark rock shows in the gullies and on the shaded side. The lower snow is dim and the summit
// brighter, as if lit by the aurora. Returns the colour in rgb and the coverage in a.
vec4 mountain(vec2 P, float px, float H, float W, float seed) {
  float dx = P.x - px;
  float w = mix(W * 1.2, W * 0.85, smoothstep(-0.06, 0.06, dx)); // lopsided: a long left slope and a steeper right one
  if (abs(dx) > w) return vec4(0.0);
  float prof = H * pow(clamp(1.0 - abs(dx) / w, 0.0, 1.0), 0.8);
  float top = prof + (ridged(vec2(dx * 6.0 + seed, 1.0 + seed)) - 0.4) * 0.11 * smoothstep(0.0, 0.2, prof)
                   + (ridged(vec2(dx * 19.0 + seed, 5.0)) - 0.4) * 0.03 * smoothstep(0.0, 0.2, prof);
  float cov = smoothstep(top + 0.0025, top - 0.0025, P.y);
  if (cov <= 0.0) return vec4(0.0);
  float down = max(H - P.y, 0.001);
  float sd = abs(dx);
  float along = sd * 0.85 + down * 0.5;
  float across = sd * 0.5 - down * 0.85;
  float r = face(across, along, seed);
  float slope = (face(across + 0.02, along, seed) - face(across - 0.02, along, seed)) / 0.04;
  float alt = clamp(P.y / H, 0.0, 1.0);
  float side = 1.0 - smoothstep(-0.25, 0.45, dx / W); // the left of the peak faces the light
  float lit = clamp(0.5 - 0.35 * clamp(dx * 5.0, -1.0, 1.0) * slope, 0.0, 1.0);
  float light = 0.1 + 0.5 * side + 0.45 * lit;
  float patch = ridged(vec2(across * 4.0 + seed, along * 1.6 + 3.0)); // big irregular patches
  float snow = smoothstep(0.45, 0.53, 0.5 * r + 0.4 * patch + 0.55 * alt - 0.12 + 0.2 * lit * side);
  snow = max(snow, smoothstep(0.8, 0.94, alt)); // the summit cap
  vec3 rock = vec3(0.016, 0.019, 0.03) * (0.5 + light) * (0.7 + 0.6 * r);
  vec3 ice = vec3(0.58, 0.63, 0.72) * light * mix(0.17, 0.38, smoothstep(0.6, 0.95, alt));
  vec3 c = mix(rock, ice, snow);
  c = mix(c, vec3(0.04, 0.08, 0.08), 0.3 * smoothstep(0.2, 0.0, alt)); // haze at the foot
  return vec4(c, cov);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float h = uRes.y;
  float asp = uRes.x / h;
  vec2 P = vec2((frag.x - 0.5 * uRes.x) / h, frag.y / h); // x centred, y up, both in viewport heights
  float narrow = mix(1.9, 1.0, smoothstep(0.5, 1.2, asp)); // on a tall, narrow screen the x axis is squeezed so the sky still fits

  // Night sky: near black with a faint airglow along the horizon.
  vec3 col = mix(vec3(0.016, 0.022, 0.036), vec3(0.003, 0.006, 0.014), smoothstep(0.0, 0.8, P.y));
  col += vec3(0.01, 0.03, 0.022) * exp(-P.y * 7.0) * 0.5;

  // Falling: the sky slides up as you scroll (the Milky Way and the stars a little slower than the aurora).
  vec2 Pg = vec2(P.x * narrow, P.y - 0.09 * uAdv);
  // Hover light: a soft spot of about a fifth of the screen height around the pointer that wakes the sky up under it.
  vec2 hv = P - uMouse.xy;
  float m = uMouse.z * exp(-dot(hv, hv) / 0.08);
  float fade = smoothstep(0.0, 0.3, uHero);
  // The hero text is a centred column: the sky is held back behind it (the Milky Way and the aurora dim, the pointer
  // light is weaker) until you scroll away from it.
  float cx = 1.0 - smoothstep(0.18, 0.55, abs(P.x));
  float cy = smoothstep(0.1, 0.28, P.y) * (1.0 - smoothstep(0.78, 0.95, P.y));
  float hold = cx * cy * (1.0 - smoothstep(0.5, 1.0, uHero));
  float mt = m * mix(1.0, 0.22, fade) * (1.0 - 0.6 * hold); // below the hero the light is gentler, so text under the pointer stays readable
  col += vec3(0.008, 0.022, 0.019) * mt; // a faint airglow, so even empty sky answers the pointer
  vec4 mw = milkyWay(Pg, uAdv);
  float gal = mix(1.0, 0.4, uHero); // the Milky Way stays visible down the page, a little dimmer
  // the opening reveal: the Milky Way emerges from the middle of the screen and spreads outward
  float rm = smoothstep(0.0, 0.7, clamp(uReveal * 1.35 - 0.3 * abs(P.x) / max(asp, 0.5), 0.0, 1.0));
  col += mw.rgb * 0.32 * gal * (1.0 + 0.6 * mt) * (1.0 - 0.45 * hold) * rm;
  vec3 st = stars(vec2(Pg.x, Pg.y), mw.a);
  col += st * (1.0 - 0.3 * uHero) * (1.0 + 0.9 * mt);

  // Aurora: full in the hero (held back behind the centred text), a faint glow with far fewer steps below it.
  float left = 1.0 - mix(0.55, 0.7, smoothstep(1.0, 1.4, asp)) * hold;
  float steps = uHero > 0.95 ? 10.0 : 24.0;
  vec3 au = aurora(vec2(P.x * narrow, P.y), uAdv, steps, mt);
  au = mix(vec3(dot(au, vec3(0.3, 0.59, 0.11))), au, 1.0 + 0.35 * mt); // and the colours get richer
  // the opening reveal: the aurora comes on last, lighting up from left to right
  float ra = smoothstep(0.0, 0.5, (uReveal - 0.2) / 0.8 * 1.7 - (P.x / asp + 0.5) * 0.9);
  col += au * (mix(1.0, uFloor, fade) + 0.07 * m * fade) * left * 1.8 * ra; // below the hero the pointer lifts the dimmed aurora

  // A faint lit horizon (airglow and a last green glow of the aurora) appears with the mountains so their silhouettes read.
  col += vec3(0.045, 0.12, 0.095) * exp(-pow((P.y - 0.17) / 0.2, 2.0)) * clamp(uPop, 0.0, 1.0);

  // The mountains: a tall snow-capped peak with a smaller peak behind it and a lower range on each side. They are well
  // taller than the footer (they rise up behind the Contact section) and pop up when you land at the end of the page, the
  // layers at different speeds for depth: the peak rises smoothly, the shoulder a little later, and the nearer ranges
  // faster with a small overshoot. Scrolling on to the very end then moves the near ranges a bit more than the far ones
  // (parallax). Kept dim, as if lit by the aurora and the stars, so the text in front stays readable.
  if (uPop > 0.0) {
    float dim = mix(0.34, 1.0, smoothstep(0.6, 1.2, asp)); // on a phone the text covers more of the mountain, so it is dimmer
    float mh = 0.58; // the main peak's height, in viewport heights
    float mw = max(0.5, 1.45 * mh);
    float tp = clamp(uPop, 0.0, 1.0);
    float pk = 1.0 - (1.0 - tp) * (1.0 - tp) * (1.0 - tp);
    float ts = clamp(tp * 1.1 - 0.1, 0.0, 1.0);
    float ps = 1.0 - (1.0 - ts) * (1.0 - ts) * (1.0 - ts);
    float tn = clamp(tp * 1.25 - 0.05, 0.0, 1.0);
    float pn = 1.0 + 2.7 * (tn - 1.0) * (tn - 1.0) * (tn - 1.0) + 1.7 * (tn - 1.0) * (tn - 1.0); // ease out with a small overshoot
    float sc = 1.0 - uMount; // how far the end of the page is still to scroll up (parallax)
    vec2 Pp = vec2(P.x, P.y + (1.0 - pk) * (mh + 0.03) + sc * 0.03);
    vec2 Pq = vec2(P.x, P.y + (1.0 - ps) * (0.66 * mh + 0.03) + sc * 0.015);
    vec2 Pn = vec2(P.x, P.y + (1.0 - pn) * (0.6 * mh + 0.03) + sc * 0.08);
    vec4 shoulder = mountain(Pq, 0.08 * asp - 0.55 * mw, 0.66 * mh, 0.55 * mw, 7.0);
    col = mix(col, shoulder.rgb * 0.8 * dim, shoulder.a);
    vec4 peak = mountain(Pp, 0.08 * asp, mh, mw, 3.0);
    col = mix(col, mix(col, peak.rgb * dim, 0.9), peak.a);
    vec4 left = mountain(Pn, -0.55 * asp, 0.45 * mh, 0.9 * mw, 11.0);
    col = mix(col, left.rgb * 0.8 * dim, left.a);
    vec4 right = mountain(Pn, 0.62 * asp, 0.58 * mh, mw, 19.0);
    col = mix(col, right.rgb * 0.8 * dim, right.a);
  }

  col += (hash21(frag) - 0.5) / 255.0; // dither: keeps the dark gradients from banding
  gl_FragColor = vec4(col, 1.0);
}`;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

export default function AuroraCanvas({ onReady }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = canvas.current;
    const gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) return undefined;

    let program = null;
    let buffer = null;
    let uRes = null;
    let uAdv = null;
    let uHero = null;
    let uFloor = null;
    let uReveal = null;
    let uMount = null;
    let uPop = null;
    let uMouse = null;
    let raf = 0;
    let lost = false;
    let announced = false;
    const state = { adv: 0, mount: 0, reveal: 1, pop: 0 };
    const mouse = { x: 0, y: 0, s: 0 }; // pointer position (CSS px) and the hover light's strength
    // How close you are to the end of the page (the footer is now just a thin bar): 0 until the last 0.35 of a screen of
    // scrolling, then up to 1 at the very end. The mountains pop up when you land there.
    const measureFooter = () => {
      const vh = window.innerHeight;
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh);
      state.mount = clamp01(1 - remaining / (0.35 * vh));
    };
    // The mountains pop up (a short tween, the layers eased differently in the shader) when the end of the page is
    // landed on (the last quarter of a screen) and drop again when you leave it.
    let popTarget = 0;
    const updatePop = () => {
      const want = state.mount > 0.25 ? 1 : 0;
      if (want === popTarget) return;
      popTarget = want;
      if (reduced) {
        state.pop = want;
        schedule();
        return;
      }
      gsap.to(state, { pop: want, duration: want ? 1.5 : 0.8, ease: 'none', overwrite: 'auto', onUpdate: schedule });
    };
    // Under reduced motion the aurora does not flow (adv stays 0); only the hero/dimmed switch follows the scroll.
    const target = () => (reduced ? (window.scrollY > window.innerHeight * 0.6 ? 1 : 0) * HERO_FADE : window.scrollY / window.innerHeight);

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const init = () => {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(program, 'uRes');
      uAdv = gl.getUniformLocation(program, 'uAdv');
      uHero = gl.getUniformLocation(program, 'uHero');
      uFloor = gl.getUniformLocation(program, 'uFloor');
      uReveal = gl.getUniformLocation(program, 'uReveal');
      uMount = gl.getUniformLocation(program, 'uMount');
      uPop = gl.getUniformLocation(program, 'uPop');
      uMouse = gl.getUniformLocation(program, 'uMouse');
      return true;
    };

    const draw = () => {
      raf = 0;
      if (lost || !program) return;
      if (document.hidden) return; // the pending change is drawn when the tab is visible again
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uAdv, state.adv);
      gl.uniform1f(uHero, clamp01(state.adv / HERO_FADE));
      gl.uniform1f(uFloor, FLOOR);
      gl.uniform1f(uReveal, state.reveal);
      gl.uniform1f(uMount, state.mount);
      gl.uniform1f(uPop, state.pop);
      gl.uniform3f(uMouse, (mouse.x - window.innerWidth / 2) / window.innerHeight, 1 - mouse.y / window.innerHeight, mouse.s);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!announced) {
        announced = true;
        onReady?.();
      }
    };
    const schedule = () => {
      if (!raf && !lost) raf = requestAnimationFrame(draw);
    };

    if (!init()) return undefined;

    // The scroll position sets a target, and the flow eases toward it (a short tween), so wheel notches and jumps
    // still read as a smooth fall. Under reduced motion it just snaps.
    state.adv = target();
    measureFooter();
    updatePop();

    // The opening reveal plays once per page load (first visit or a refresh), when the preloader has gone: the sky starts
    // empty (the first frame is drawn that way, behind the preloader) and the Milky Way, the stars and the aurora come in.
    let cancelReveal = () => {};
    if (!reduced && !skyRevealed()) {
      state.reveal = 0;
      cancelReveal = whenPreloaderDone(() => {
        markSkyRevealed();
        gsap.to(state, { reveal: 1, duration: REVEAL_SECONDS, ease: 'power1.inOut', onUpdate: schedule });
      });
    } else {
      markSkyRevealed();
    }
    const follow = () => {
      measureFooter();
      updatePop();
      if (reduced) {
        state.adv = target();
        schedule();
        return;
      }
      schedule(); // the footer-linked part moves with the scroll itself
      gsap.to(state, { adv: target(), duration: 0.45, ease: 'power3.out', overwrite: 'auto', onUpdate: schedule });
    };
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: follow });

    // Hover light: the sky brightens and gets richer in colour around the mouse pointer (hover devices only). The spot
    // eases after the pointer (it snaps under reduced motion) and fades out when the pointer leaves the window.
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let seen = false;
    const glide = reduced ? 0 : 0.35;
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (!seen) {
        seen = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      gsap.to(mouse, { x: e.clientX, y: e.clientY, s: 1, duration: glide, ease: 'power3.out', overwrite: 'auto', onUpdate: schedule });
    };
    const onLeave = () => gsap.to(mouse, { s: 0, duration: reduced ? 0 : 0.6, ease: 'power2.out', overwrite: 'auto', onUpdate: schedule });
    if (hover) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
    }

    const resize = ([entry]) => {
      const sc = Math.min(window.devicePixelRatio || 1, 1.5) * SCALE;
      const { width, height } = entry.contentRect;
      cv.width = Math.min(MAX_SIDE, Math.max(2, Math.round(width * sc)));
      cv.height = Math.min(MAX_SIDE, Math.max(2, Math.round(height * sc)));
      measureFooter();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(cv);

    const onLost = (e) => {
      e.preventDefault();
      lost = true;
      program = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => {
      lost = false;
      if (init()) schedule();
    };
    const onVisible = () => {
      if (!document.hidden) schedule();
    };
    cv.addEventListener('webglcontextlost', onLost);
    cv.addEventListener('webglcontextrestored', onRestored);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      trigger.kill();
      cancelReveal();
      gsap.killTweensOf(state);
      gsap.killTweensOf(mouse);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
      cv.removeEventListener('webglcontextlost', onLost);
      cv.removeEventListener('webglcontextrestored', onRestored);
      document.removeEventListener('visibilitychange', onVisible);
      if (raf) cancelAnimationFrame(raf);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [reduced, onReady]);

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" />;
}
