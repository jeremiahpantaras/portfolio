import { useEffect, useRef, useState } from 'react';
import { usePreloaderDone } from '../../lib/preloader';
import useReducedMotion from '../../hooks/useReducedMotion';

// A block that blurs in and rises into place (the same feel as the BlurText reveal on the text around it), for the parts
// that are not plain text: buttons, icons, tags, pills, the footer's columns. trigger="view" plays once when it scrolls
// into view; trigger="load" plays once the opening preloader has gone (for the hero). `delay` (seconds) staggers
// neighbours. The motion is a CSS transition on opacity, filter and transform (see .reveal-block in index.css), and
// nothing is left applied once it has finished. Under reduced motion it renders as a plain element.
export default function RevealBlock({ as: asTag = 'div', trigger = 'view', delay = 0, className = '', style, children, ...rest }) {
  const Tag = asTag;
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const preloaded = usePreloaderDone();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (trigger !== 'view' || seen) return undefined;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, seen]);

  const shown = reduced || (trigger === 'load' ? preloaded : seen);
  return (
    <Tag ref={ref} className={`reveal-block${shown ? ' is-shown' : ''} ${className}`} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
