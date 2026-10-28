// Route code-splitting entry points, shared by App.jsx (React.lazy) and the prefetch helpers below, so a
// chunk requested early (hover or keyboard focus on a link) is the same module that lazy() later resolves.
// (Idle prefetching of every route was tried and removed: it competed with the first load on slow networks.)
export const routeLoaders = {
  '/tech-stacks': () => import('./pages/TechStacks'),
  '/projects': () => import('./pages/Projects'),
  '/certifications': () => import('./pages/Certifications'),
  '/experience': () => import('./pages/Experience'),
  '/workshops': () => import('./pages/Workshop'),
  '/creative': () => import('./creatives/pages/CreativeHome'),
  '/creative/gallery': () => import('./creatives/pages/CreativeGalleryPage'),
};
export const notFoundLoader = () => import('./pages/NotFound');

const pathOf = (to) => String(to).split('#')[0].split('?')[0];

export function prefetchRoute(to) {
  routeLoaders[pathOf(to)]?.().catch(() => {});
}

// Spread onto a link: starts fetching its route chunk on hover or keyboard focus.
export const prefetchProps = (to) => ({
  onPointerEnter: () => prefetchRoute(to),
  onFocus: () => prefetchRoute(to),
});
