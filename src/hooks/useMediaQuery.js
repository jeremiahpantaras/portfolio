import { useSyncExternalStore } from 'react';

// Subscribes to a CSS media query. `serverValue` is used before hydration / when matchMedia is unavailable.
export default function useMediaQuery(query, serverValue = false) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
