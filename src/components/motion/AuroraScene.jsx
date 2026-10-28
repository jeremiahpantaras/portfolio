import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import SkySparkles from './SkySparkles';

const AuroraCanvas = lazy(() => import('./AuroraCanvas'));

// The home page's fixed background (see AuroraCanvas for the scene). A static CSS glow (.aurora-fallback) shows
// first and stays if WebGL is unavailable; the canvas loads when the browser is idle and fades in over it once it has
// drawn its first frame, so the scene never delays the first paint.
export default function AuroraScene() {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => {
    setReady(true);
    window.__auroraReady = true; // the preloader waits for the first drawn frame
    window.dispatchEvent(new Event('aurora-ready'));
  }, []); // stable: the canvas re-initialises if this changes

  useEffect(() => {
    const start = () => setMount(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 400);
    return () => clearTimeout(id);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-fallback absolute inset-0" />
      {mount && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <AuroraCanvas onReady={markReady} />
          </Suspense>
        </div>
      )}
      <SkySparkles />
    </div>
  );
}
