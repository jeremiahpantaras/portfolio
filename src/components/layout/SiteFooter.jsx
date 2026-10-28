import { ArrowUp } from 'lucide-react';
import Container from '../ui/Container';
import RevealBlock from '../ui/RevealBlock';
import { profile } from '../../data/profile';

// The footer is just the copyright line and "Back to top". It stays transparent, so the sky (and the mountains that pop up
// at the end of the page) show through behind it.
export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <RevealBlock as={Container} className="flex flex-wrap items-center justify-between gap-4 py-4">
        <p className="text-small text-fg-subtle">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="eyebrow inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 text-fg-muted transition-colors hover:text-fg"
        >
          Back to top
          <ArrowUp size={14} aria-hidden="true" />
        </button>
      </RevealBlock>
    </footer>
  );
}
