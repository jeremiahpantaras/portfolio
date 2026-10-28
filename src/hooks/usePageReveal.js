import { gsap, ScrollTrigger, SplitText, useGSAP, ease, MOTION_OK } from '../lib/gsap';

// Declarative scroll reveals. Mark elements with data-reveal and call this once per page with the page root:
//   rule      hairline draws from the left
//   fade      rises and fades in
//   heading   SplitText lines slide up inside a mask
//   chars     SplitText characters slide up (single-line display text)
//   stagger   children marked data-reveal-item rise one after another
//   row       batched, staggered rise (project / list rows)
//   clip      clip-path reveal from the bottom (image tiles)
// Everything plays once. Under prefers-reduced-motion nothing runs and the CSS in index.css shows the content.
export default function usePageReveal(scopeRef) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return undefined;
      const all = (sel) => Array.from(root.querySelectorAll(sel));
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const once = (el, start = 'top 88%') => ({ trigger: el, start, once: true });

        all('[data-reveal="rule"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center' },
            { autoAlpha: 1, scaleX: 1, duration: 1, ease: ease.soft, scrollTrigger: once(el, 'top 92%') },
          );
        });

        all('[data-reveal="fade"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: ease.out, scrollTrigger: once(el) },
          );
        });

        all('[data-reveal="heading"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1,
                ease: ease.out,
                stagger: 0.06,
                scrollTrigger: once(el, 'top 85%'),
              }),
          });
        });

        all('[data-reveal="chars"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          SplitText.create(el, {
            type: 'lines,chars',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 105,
                duration: 0.9,
                ease: ease.out,
                stagger: 0.015,
                scrollTrigger: once(el, 'top 85%'),
              }),
          });
        });

        all('[data-reveal="stagger"]').forEach((el) => {
          const items = el.querySelectorAll('[data-reveal-item]');
          gsap.set(el, { autoAlpha: 1 });
          gsap.from(items, {
            autoAlpha: 0,
            y: 20,
            duration: 0.8,
            ease: ease.out,
            stagger: 0.04,
            scrollTrigger: once(el, 'top 85%'),
          });
        });

        const rows = all('[data-reveal="row"]');
        if (rows.length) {
          gsap.set(rows, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(rows, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: ease.out, stagger: 0.08 }),
          });
        }

        all('[data-reveal="clip"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: ease.out, scrollTrigger: once(el, 'top 92%') },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );
}
