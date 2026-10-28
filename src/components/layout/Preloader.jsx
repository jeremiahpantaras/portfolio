import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { finishPreloader, preloaderDone } from '../../lib/preloader';
import useReducedMotion from '../../hooks/useReducedMotion';
import { profile } from '../../data/profile';

// The opening preloader: a night sky with slow northern-lights curtains and a thin line that fills while the page loads.
// It stays until the page, the fonts and (on the home page) the sky have loaded, but at least MIN ms (so the curtains are
// seen) and at most MAX ms, then fades away and lets the hero's text blur in. It shows once per visit: the site is a
// single-page app, so later navigation never brings it back. The curtains are CSS gradients moved with transform and
// opacity only, and they stand still under prefers-reduced-motion.
const MIN = 1700;
const MAX = 4200;
const MIN_REDUCED = 500;
const FADE = 900;

export default function Preloader() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(() => (preloaderDone() ? 'gone' : 'show')); // show → leaving → gone
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (stage !== 'show') return undefined;
    const html = document.documentElement;
    html.style.overflow = 'hidden'; // no scrolling behind the overlay
    const start = performance.now();
    const min = reduced ? MIN_REDUCED : MIN;
    const needSky = pathname === '/';
    const flags = { load: document.readyState === 'complete', fonts: !document.fonts, sky: !needSky || Boolean(window.__auroraReady) };
    const onLoad = () => {
      flags.load = true;
    };
    const onSky = () => {
      flags.sky = true;
    };
    window.addEventListener('load', onLoad);
    window.addEventListener('aurora-ready', onSky);
    document.fonts?.ready.then(() => {
      flags.fonts = true;
    });

    let leaving = false;
    const timer = window.setInterval(() => {
      const t = performance.now() - start;
      const ready = flags.load && flags.fonts && flags.sky;
      // creeps toward 90% while it waits, jumps to 100% when everything is ready (and the minimum time has passed)
      const timeShare = Math.min(t / min, 1);
      const target = ready ? timeShare * 100 : Math.min(timeShare * 100, 90) * 0.9;
      setPct((p) => Math.max(p, Math.round(target)));
      if (!leaving && ((ready && t >= min) || t >= MAX)) {
        leaving = true;
        setPct(100);
        setStage('leaving');
        finishPreloader();
      }
    }, 80);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('aurora-ready', onSky);
    };
  }, [stage, pathname, reduced]);

  useEffect(() => {
    if (stage !== 'leaving') return undefined;
    document.documentElement.style.overflow = '';
    const id = window.setTimeout(() => setStage('gone'), FADE + 100);
    return () => window.clearTimeout(id);
  }, [stage]);

  if (stage === 'gone') return null;

  return (
    <div className="preloader" data-leaving={stage === 'leaving' ? '' : undefined} role="status" aria-label="Loading">
      <div aria-hidden="true" className="preloader__sky" />
      <div aria-hidden="true" className="preloader__curtains">
        <i className="preloader__curtain preloader__curtain--a" />
        <i className="preloader__curtain preloader__curtain--b" />
        <i className="preloader__curtain preloader__curtain--c" />
      </div>
      <div aria-hidden="true" className="preloader__hills" />
      <div aria-hidden="true" className="preloader__label">
        <p className="eyebrow text-fg">{profile.name}</p>
        <div className="preloader__line">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="eyebrow text-fg-subtle tabular-nums">{String(pct).padStart(3, '0')}</p>
      </div>
    </div>
  );
}
