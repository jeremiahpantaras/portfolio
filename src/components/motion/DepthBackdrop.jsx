import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../lib/gsap';

// "Descent" ambience (doc 02 §5.2): as the page scrolls, a faint deep-water tint (the brand navy) mixes in. It is one
// opacity change on a fixed, non-interactive layer. (The drifting wave lines that used to sit here were removed.)
// Under reduced motion nothing runs and the layer stays invisible.
export default function DepthBackdrop() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const setTint = gsap.quickSetter(root.current.querySelector('[data-tint]'), 'opacity');
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setTint(self.progress * 0.25) });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        data-tint
        className="absolute inset-0 opacity-0"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-brand-darkest) 100%)' }}
      />
    </div>
  );
}
