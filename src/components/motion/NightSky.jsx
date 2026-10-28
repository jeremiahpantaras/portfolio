import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';

// Shooting stars over the home page's scene (the stars themselves are painted by AuroraCanvas): a small pool of
// elements, re-launched at random intervals with the Web Animations API (a tapered tail, a glowing head, fading out as
// they burn up). No per-frame JavaScript. Under reduced motion none of this runs.
export default function NightSky() {
  const shoot = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const shootRoot = shoot.current;

        const fire = (el) => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const leftward = Math.random() < 0.65; // most fly right → left
          const phi = 26 + Math.random() * 16; // 26–42° below horizontal
          const theta = leftward ? 180 - phi : phi;
          const sx = leftward ? w * (0.35 + Math.random() * 0.7) : w * (-0.05 + Math.random() * 0.6);
          const sy = h * (0.04 + Math.random() * 0.46);
          const len = 190 + Math.random() * 140;
          const dist = 520 + Math.random() * 380;
          const peak = 0.88 + Math.random() * 0.12;
          el.style.width = `${len}px`;
          const base = `translate(${sx - len}px, ${sy - 2}px) rotate(${theta}deg)`;
          el.animate(
            [
              { transform: `${base} translateX(0px)`, opacity: 0 },
              { opacity: peak, offset: 0.08 },
              { opacity: peak * 0.9, offset: 0.5 },
              { transform: `${base} translateX(${dist}px)`, opacity: 0 },
            ],
            { duration: 900 + Math.random() * 800, easing: 'cubic-bezier(0.12, 0.5, 0.3, 1)' },
          );
        };
        const timers = new Set();
        const schedule = (el, first) => {
          const inHero = window.scrollY < window.innerHeight * 0.6;
          const base = first ? 1200 + Math.random() * 3500 : inHero ? 8000 + Math.random() * 8000 : 12000 + Math.random() * 12000;
          const t = setTimeout(() => {
            timers.delete(t);
            if (!document.hidden) fire(el);
            schedule(el, false);
          }, base);
          timers.add(t);
        };
        const pool = Array.from(shootRoot.querySelectorAll('.shoot'));
        pool.forEach((el) => schedule(el, true));

        return () => {
          timers.forEach(clearTimeout);
          pool.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
        };
      });
      return () => mm.revert();
    },
    { scope: shoot },
  );

  return (
    <div ref={shoot} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="shoot">
        <i className="shoot__glow" />
        <i className="shoot__tail" />
        <i className="shoot__head" />
      </div>
      <div className="shoot">
        <i className="shoot__glow" />
        <i className="shoot__tail" />
        <i className="shoot__head" />
      </div>
    </div>
  );
}
