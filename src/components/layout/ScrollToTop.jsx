import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../../lib/gsap';
import useReducedMotion from '../../hooks/useReducedMotion';

// On navigation: scroll to the #hash target (smooth unless reduced motion) or reset to the top.
// Also refreshes ScrollTrigger once fonts and images have settled so trigger positions are correct.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced; // read when scrolling; toggling the OS setting must not re-run the effect

  useEffect(() => {
    const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (!el) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return undefined;
    }

    // A freshly mounted page creates ScrollTriggers, which queue a refresh that resets the scroll position and
    // would cancel a smooth scroll already in flight. So wait for that refresh (or a short timeout), scroll,
    // then verify the target really landed and snap to it if something interrupted the animation.
    const behavior = reducedRef.current ? 'instant' : 'smooth';
    let cancelled = false;
    let verify;
    let start;
    const go = () => {
      if (cancelled) return;
      el.scrollIntoView({ behavior, block: 'start' });
      verify = setTimeout(() => {
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (!cancelled && Math.abs(el.getBoundingClientRect().top - margin) > 8) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 1200);
    };
    const onRefresh = () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      clearTimeout(fallback);
      start = setTimeout(go, 30); // a timer, not rAF: rAF never fires in a hidden tab
    };
    const fallback = setTimeout(onRefresh, 350);
    ScrollTrigger.addEventListener('refresh', onRefresh);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      clearTimeout(start);
      clearTimeout(verify);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
    };
  }, [pathname, hash]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return null;
}
