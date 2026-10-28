import { useEffect, useRef, useState } from 'react';
import { skyRevealed, usePreloaderDone } from '../../lib/preloader';

// Five bright stars with diffraction spikes (a white core, a soft glow, a long cross and, on the biggest, a shorter
// diagonal cross) that twinkle slowly. They belong to the fixed sky behind the page (AuroraScene), not to the hero's
// content: they stay put as the page scrolls, and fade out to a faint trace within the first quarter screen of scrolling so they never sit
// bright behind text. Plain elements animated with CSS (opacity and scale only), kept to the edges of the screen.
// Decorative: hidden from assistive tech.
const STARS = [
  { x: '13%', y: '19%', s: 58, tint: '205 225 255', dur: 5.2, delay: -1.1 },
  { x: '82%', y: '16%', s: 92, tint: '255 238 214', dur: 6.4, delay: -3.2, big: true },
  { x: '60%', y: '9%', s: 40, tint: '215 232 255', dur: 4.6, delay: -0.4 },
  { x: '19%', y: '79%', s: 70, tint: '255 244 225', dur: 5.8, delay: -2.4, big: true },
  { x: '86%', y: '71%', s: 50, tint: '200 222 255', dur: 4.9, delay: -4 },
];

export default function SkySparkles() {
  const root = useRef(null);
  // On the first visit and on a refresh the stars come in one by one once the preloader has gone (the opening reveal of the
  // sky, see AuroraCanvas); when you return to the home page later they are simply there.
  const [intro] = useState(() => !skyRevealed());
  const preloaded = usePreloaderDone();
  const show = !intro || preloaded;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const away = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.25), 0), 1);
      root.current.style.opacity = (1 - 0.88 * away).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {show &&
        STARS.map((st, i) => (
          <span
            key={st.x + st.y}
            className={`sparkle${st.big ? ' sparkle--big' : ''}${intro ? ' sparkle--intro' : ''}`}
            style={{
              left: st.x,
              top: st.y,
              '--s': `${st.s}px`,
              '--c': st.tint,
              '--dur': `${st.dur}s`,
              '--delay': `${st.delay}s`,
              '--in': `${1 + i * 0.55}s`,
            }}
          />
        ))}
    </div>
  );
}
