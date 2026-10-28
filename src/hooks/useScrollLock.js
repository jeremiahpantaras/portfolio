import { useEffect } from 'react';

// Shared, reference-counted body scroll lock. The old modals each reset body.style.overflow independently,
// so closing one could unlock the page while another was still open.
let locks = 0;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    locks += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = '';
    };
  }, [active]);
}
