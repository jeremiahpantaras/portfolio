// The only place GSAP plugins are registered. Import gsap/ScrollTrigger/SplitText/useGSAP from here.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Motion tokens (docs/portfolio-enhancement/02-animation-and-3d-strategy.md §1)
export const ease = { out: 'expo.out', soft: 'power3.out', scrub: 'none' };
export const dur = { micro: 0.2, ui: 0.4, reveal: 1 };
export const stagger = { char: 0.02, word: 0.05, item: 0.08 };

// Media queries used with gsap.matchMedia()
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';

export { gsap, ScrollTrigger, SplitText, useGSAP };
