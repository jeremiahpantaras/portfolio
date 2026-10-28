import { useEffect } from 'react';

const SITE = 'https://jeremiah.cosedevs.com';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Per-route <title>, description and canonical/OG URL. Updates the tags that already exist in index.html
// (a single source of static defaults) instead of injecting duplicates.
export default function useDocumentMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="title"]', 'content', title);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[name="twitter:title"]', 'content', title);
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    // noindex pages (404) get a self-referencing canonical rather than inheriting the previous page's.
    const canonicalPath = path ?? (noindex ? window.location.pathname : null);
    if (canonicalPath) {
      const url = `${SITE}${canonicalPath}`;
      setMeta('link[rel="canonical"]', 'href', url);
      setMeta('meta[property="og:url"]', 'content', url);
      setMeta('meta[name="twitter:url"]', 'content', url);
    }
    if (!noindex) return undefined;
    setMeta('meta[name="robots"]', 'content', 'noindex, follow');
    return () => setMeta('meta[name="robots"]', 'content', 'index, follow');
  }, [title, description, path, noindex]);
}
