import { useSyncExternalStore } from 'react';

// Whether the opening preloader (components/layout/Preloader) has finished with the screen. The hero's text waits for it,
// so its blur-in is seen rather than played behind the overlay. After the first load it is simply true.
let done = false;
const listeners = new Set();

export const preloaderDone = () => done;
export const finishPreloader = () => {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
};

export const usePreloaderDone = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => true,
  );

// Run `cb` when the preloader has finished (right away if it already has). Returns a function that cancels it.
export const whenPreloaderDone = (cb) => {
  if (done) {
    cb();
    return () => {};
  }
  const once = () => {
    listeners.delete(once);
    cb();
  };
  listeners.add(once);
  return () => listeners.delete(once);
};

// The sky's opening reveal (the Milky Way, the stars and the aurora coming in) plays once per page load: on the first
// visit and on a refresh, not each time you come back to the home page in the same session.
let revealed = false;
export const skyRevealed = () => revealed;
export const markSkyRevealed = () => {
  revealed = true;
};
