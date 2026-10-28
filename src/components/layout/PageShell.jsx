import { useRef } from 'react';
import Container from '../ui/Container';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import usePageReveal from '../../hooks/usePageReveal';

// Shared frame for every sub-page: label, display title, optional count, and one-time reveals.
export default function PageShell({ label, title, count, meta, children }) {
  const ref = useRef(null);
  useDocumentMeta(meta);
  usePageReveal(ref);

  return (
    <div ref={ref} className="pb-16 pt-24 md:pb-20 md:pt-28">
      <Container>
        <header className="mb-8 md:mb-12">
          <div data-reveal="rule" className="h-px w-full bg-line" />
          <p data-reveal="fade" className="eyebrow mt-4 text-fg-subtle">
            {label}
          </p>
          <h1 data-reveal="heading" className="text-display mt-6 text-fg">
            {title}
          </h1>
          {count && (
            <p data-reveal="fade" className="mt-4 text-fg-muted">
              {count}
            </p>
          )}
        </header>
        {children}
      </Container>
    </div>
  );
}
