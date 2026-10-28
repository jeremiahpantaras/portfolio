// Creative gallery (20 photos). Derivatives come from scripts/optimize-images.mjs.
// Item 10 is stored on disk as "10 2.webp" (there is no 10.webp), so its original path differs.
import imageMeta from '../../data/imageMeta.json';

const COUNT = 20;

export const creativeGalleryImages = Array.from({ length: COUNT }, (_, i) => {
  const n = i + 1;
  const thumb = `/images/creative/${n}-800.webp`;
  const full = `/images/creative/${n}-2000.webp`;
  const file = n === 10 ? '10 2.webp' : `${n}.webp`;
  return {
    id: n,
    thumb,
    full,
    original: encodeURI(`/creative-assets/creative-gallery/${file}`),
    w: imageMeta[thumb].w,
    h: imageMeta[thumb].h,
    alt: `Creative work ${n}`,
  };
});
